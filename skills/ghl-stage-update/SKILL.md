---
name: ghl-stage-update
description: Move a GoHighLevel contact through a pipeline stage with one command. Use when the user asks for "ghl update", "move contact", "update stage", "ghl-stage-update", or wants to log a sales-pipeline change to GHL without opening the GHL UI. Searches contact by name or email, finds the opportunity in the named pipeline, moves it to the target stage, optionally appends a note and sets the next follow-up date. Requires GHL_API_KEY and GHL_LOCATION_ID environment variables.
---

# GHL Stage Update

Move a contact through GoHighLevel pipeline stages with a single command. Replaces the click-through flow in the GHL UI (search contact, click opportunity, change stage, add note, set follow-up) with one structured input.

The skill reads from your GoHighLevel sub-account using a Private Integration token. It does not store data anywhere except GHL itself. Every action is logged to GHL's audit trail under the API user.

## When to Use

- After a sales call where a contact moves stage (e.g. "Replied" -> "Interested" -> "Booked Call")
- After sending a follow-up where you want to log the touch and reset the next-follow-up date
- When clearing a backlog of stale GHL stage updates that piled up while you focused on conversations
- When you want a one-line audit trail of pipeline movement without opening the GHL UI

Do NOT use this skill to:
- Create new contacts (use GHL UI, contact form, or a different tool)
- Change pipeline structure (stages, pipelines themselves)
- Send messages or trigger workflows

## Prerequisites

Set these environment variables before running:

```
GHL_API_KEY=pk_your_private_integration_token
GHL_LOCATION_ID=your_sub_account_location_id
```

You can put them in a `.env` file in your project root if you use a dotenv loader, or export them in your shell. The skill itself does not load `.env`.

To find the values:

- **API key:** GHL UI -> Settings -> Private Integrations -> Create new token. Required scopes: `contacts.readonly`, `contacts.write`, `opportunities.readonly`, `opportunities.write`. Store the token securely; it cannot be retrieved after creation.
- **Location ID:** GHL UI -> Settings -> Business Profile -> Location ID. Or call `GET /locations` if you have agency access.

## Workflow

**Phase 1, gather inputs.**

Ask the user for the following. If anything is missing, ask one short follow-up question, do not guess.

- **Contact** (required): Name or email. Name is fuzzy-matched; email is exact-matched.
- **Target stage** (required): The destination stage name. Fuzzy-matched against pipeline stages.
- **Pipeline** (optional): Pipeline name. If omitted, the skill checks all pipelines and flags ambiguity if the contact has opportunities in more than one.
- **Note** (optional): Free-text note appended to the contact's notes log with a timestamp.
- **Next follow-up** (optional): ISO date `YYYY-MM-DD` or natural-language ("next Tuesday", "in 7 days"). If natural-language, resolve to ISO before passing to the script.

**Phase 2, run the script.**

Invoke the bundled script:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/run.js \
  --contact "{name or email}" \
  --stage "{target stage}" \
  [--pipeline "{pipeline name}"] \
  [--note "{note text}"] \
  [--next-follow-up "{YYYY-MM-DD}"]
```

If `${CLAUDE_PLUGIN_ROOT}` is not available, use the absolute path printed by the plugin manager.

**Phase 3, report back.**

Confirm to the user:

- Contact moved: `{Name}` -> stage `{From}` -> `{To}`
- Pipeline: `{Pipeline name}`
- Note logged: yes/no
- Next follow-up: `{date}` or "not set"
- GHL opportunity URL (if available)

If the script returns an error, summarise the cause in plain English and suggest the fix:

- "Contact not found": ask for spelling or email
- "Stage not found in pipeline": list the available stages
- "Multiple matching contacts": list candidates, ask which one
- "Multiple opportunities for this contact across pipelines": ask which pipeline

## Inputs Needed, Minimum

To produce a successful update, the skill needs at least:

1. Contact identifier (name or email)
2. Target stage name

Everything else (pipeline, note, next follow-up) is optional. If the contact has opportunities in only one pipeline, the pipeline argument is inferred.

## Examples

**Example 1, simple stage move:**

> "Move Karen Harris to Interested"

The skill searches for "Karen Harris", finds her opportunity, moves it to the "Interested" stage in the matching pipeline, reports back.

**Example 2, with note and follow-up:**

> "Move ryan@watts-electrical.co.uk to Booked Call, note 'Site visit Wed 22 Apr 5pm at his offices', next follow up next Wednesday"

The skill resolves "next Wednesday" to an ISO date, finds Ryan's opportunity, moves it, adds the note, sets the follow-up.

**Example 3, ambiguous contact:**

> "Move Smith to Replied"

The skill returns 3 candidates (John Smith, Jane Smith, Sam Smithers). The user picks one and the skill re-runs.

## References

- `references/ghl-api-quickref.md` — pipeline / stage / opportunity / contact data model in GHL, with the exact endpoints this skill calls.

## Disclaimer

Stage updates are real and immediate. The skill does not have a dry-run mode. Test against a sandbox sub-account first if your GHL sub-account is production-critical. The skill respects GHL's rate limits (100 requests per 10 seconds) but consecutive bulk updates may need pacing.
