#!/usr/bin/env node
/**
 * ghl-stage-update
 *
 * Move a GoHighLevel contact through pipeline stages with one command.
 *
 * Usage:
 *   node run.js --contact "Karen Harris" --stage "Interested"
 *   node run.js --contact ryan@watts-electrical.co.uk --stage "Booked Call" \
 *               --pipeline "CXAI Pipeline" --note "Site visit Wed 5pm" \
 *               --next-follow-up 2026-05-06
 *
 * Required env:
 *   GHL_API_KEY        Private Integration token (pk_...)
 *   GHL_LOCATION_ID    Sub-account location ID
 */

const BASE_URL = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-07-28';
const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 10_000;

const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!API_KEY || !LOCATION_ID) {
  console.error('ERROR: GHL_API_KEY and GHL_LOCATION_ID must be set in the environment.');
  console.error('See the SKILL.md prerequisites section for how to obtain them.');
  process.exit(2);
}

let requestTimestamps = [];

async function rateLimitWait() {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(t => now - t < RATE_WINDOW_MS);
  if (requestTimestamps.length >= RATE_LIMIT) {
    const waitMs = RATE_WINDOW_MS - (now - requestTimestamps[0]) + 100;
    await new Promise(r => setTimeout(r, waitMs));
  }
  requestTimestamps.push(Date.now());
}

async function api(method, path, body = null, retries = 3) {
  await rateLimitWait();
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Version: API_VERSION,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500));
      continue;
    }
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      throw new Error(`GHL ${method} ${path} -> ${res.status}: ${typeof data === 'object' ? JSON.stringify(data) : data}`);
    }
    return data;
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function normalise(s) {
  return (s || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
}

async function findContact(query) {
  const data = await api('GET', `/contacts/?locationId=${LOCATION_ID}&query=${encodeURIComponent(query)}&limit=20`);
  const contacts = data.contacts || [];
  if (contacts.length === 0) return { match: null, candidates: [] };
  if (contacts.length === 1) return { match: contacts[0], candidates: contacts };

  // Try exact email or full-name match before declaring ambiguity.
  const q = normalise(query);
  const exact = contacts.find(c =>
    normalise(c.email) === q ||
    normalise(`${c.firstName || ''} ${c.lastName || ''}`) === q ||
    normalise(c.contactName) === q,
  );
  if (exact) return { match: exact, candidates: contacts };
  return { match: null, candidates: contacts };
}

async function getAllPipelines() {
  const data = await api('GET', `/opportunities/pipelines?locationId=${LOCATION_ID}`);
  return data.pipelines || [];
}

function findPipelineByName(pipelines, name) {
  const q = normalise(name);
  let match = pipelines.find(p => normalise(p.name) === q);
  if (match) return match;
  match = pipelines.find(p => normalise(p.name).includes(q));
  return match || null;
}

function findStageInPipeline(pipeline, stageName) {
  const stages = pipeline.stages || [];
  const q = normalise(stageName);
  let match = stages.find(s => normalise(s.name) === q);
  if (match) return match;
  match = stages.find(s => normalise(s.name).includes(q));
  return match || null;
}

async function getOpportunitiesForContact(contactId) {
  const data = await api('GET', `/contacts/${contactId}/opportunities`);
  return data.opportunities || [];
}

async function updateOpportunity(opportunityId, body) {
  return api('PUT', `/opportunities/${opportunityId}`, body);
}

async function addNoteToContact(contactId, body) {
  return api('POST', `/contacts/${contactId}/notes`, { body });
}

function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

async function main() {
  const args = parseArgs(process.argv);
  const contactQuery = args.contact;
  const stageName = args.stage;
  const pipelineName = args.pipeline || null;
  const note = args.note || null;
  const nextFollowUp = args['next-follow-up'] || null;

  if (!contactQuery || !stageName) {
    console.error('Usage: node run.js --contact "<name or email>" --stage "<stage>" [--pipeline "<name>"] [--note "<text>"] [--next-follow-up YYYY-MM-DD]');
    process.exit(2);
  }

  // 1. Find the contact.
  const { match: contact, candidates } = await findContact(contactQuery);
  if (!contact) {
    if (candidates.length > 0) {
      console.error(`Multiple matching contacts for "${contactQuery}". Please disambiguate:`);
      for (const c of candidates.slice(0, 10)) {
        console.error(`  - ${c.firstName || ''} ${c.lastName || ''} <${c.email || 'no-email'}>  id=${c.id}`);
      }
      process.exit(3);
    }
    console.error(`Contact not found: "${contactQuery}".`);
    process.exit(4);
  }
  const contactName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.contactName || contact.email;

  // 2. Find their opportunities.
  const opportunities = await getOpportunitiesForContact(contact.id);
  if (opportunities.length === 0) {
    console.error(`No opportunities found for ${contactName}. Create one in GHL first.`);
    process.exit(5);
  }

  // 3. Get all pipelines, narrow to the requested pipeline if provided.
  const pipelines = await getAllPipelines();

  let pipeline;
  let opportunity;

  if (pipelineName) {
    pipeline = findPipelineByName(pipelines, pipelineName);
    if (!pipeline) {
      console.error(`Pipeline not found: "${pipelineName}". Available pipelines:`);
      for (const p of pipelines) console.error(`  - ${p.name}`);
      process.exit(6);
    }
    opportunity = opportunities.find(o => o.pipelineId === pipeline.id);
    if (!opportunity) {
      console.error(`No opportunity for ${contactName} in pipeline "${pipeline.name}".`);
      process.exit(7);
    }
  } else {
    if (opportunities.length > 1) {
      console.error(`${contactName} has opportunities in multiple pipelines. Please specify --pipeline:`);
      for (const o of opportunities) {
        const p = pipelines.find(pp => pp.id === o.pipelineId);
        console.error(`  - ${p ? p.name : o.pipelineId}  (opportunity id=${o.id})`);
      }
      process.exit(8);
    }
    opportunity = opportunities[0];
    pipeline = pipelines.find(p => p.id === opportunity.pipelineId);
    if (!pipeline) {
      console.error(`Opportunity ${opportunity.id} references pipeline ${opportunity.pipelineId} which was not returned by /pipelines. Aborting.`);
      process.exit(9);
    }
  }

  // 4. Find the target stage.
  const stage = findStageInPipeline(pipeline, stageName);
  if (!stage) {
    console.error(`Stage "${stageName}" not found in pipeline "${pipeline.name}". Available stages:`);
    for (const s of pipeline.stages || []) console.error(`  - ${s.name}`);
    process.exit(10);
  }

  // 5. Capture from-stage for the report.
  const fromStage = (pipeline.stages || []).find(s => s.id === opportunity.pipelineStageId);
  const fromStageName = fromStage ? fromStage.name : '(unknown)';

  // 6. Move it.
  const updateBody = { pipelineStageId: stage.id };
  await updateOpportunity(opportunity.id, updateBody);

  // 7. Add a note if requested.
  let noteLogged = false;
  if (note) {
    const stamp = new Date().toISOString();
    const fullNote = `[${stamp}] Stage moved ${fromStageName} -> ${stage.name}. ${note}`;
    await addNoteToContact(contact.id, fullNote);
    noteLogged = true;
  }

  // 8. Update next-follow-up date if requested. GHL doesn't have a single
  //    canonical "next follow up" field; this writes to a custom field if
  //    present (Next Follow Up), otherwise we skip with a warning.
  let followUpSet = false;
  let followUpWarning = null;
  if (nextFollowUp) {
    const date = isoDate(nextFollowUp);
    try {
      const cfRes = await api('GET', `/locations/${LOCATION_ID}/customFields`);
      const customFields = cfRes.customFields || [];
      const fld = customFields.find(f => normalise(f.name) === 'next follow up' || normalise(f.name) === 'next_follow_up');
      if (fld) {
        await api('PUT', `/contacts/${contact.id}`, { customFields: [{ id: fld.id, key: fld.fieldKey, value: date }] });
        followUpSet = true;
      } else {
        followUpWarning = `Custom field "Next Follow Up" not found on this location; date "${date}" not written.`;
      }
    } catch (err) {
      followUpWarning = `Failed to set next-follow-up date: ${err.message}`;
    }
  }

  // 9. Report.
  const report = {
    contact: contactName,
    contactId: contact.id,
    pipeline: pipeline.name,
    fromStage: fromStageName,
    toStage: stage.name,
    opportunityId: opportunity.id,
    noteLogged,
    nextFollowUp: followUpSet ? isoDate(nextFollowUp) : null,
    followUpWarning,
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
