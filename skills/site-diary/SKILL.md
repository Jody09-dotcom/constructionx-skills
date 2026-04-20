---
name: site-diary
description: Generate a daily UK construction site diary from a brief site-manager input. Use when the user asks for "site diary", "daily diary", "end of day report", "site log", or needs to write up a day's works. Captures weather, labour, plant, deliveries, works completed, delays, incidents, visitors, photos. UK construction conventions.
---

# Site Diary

This skill produces a UK construction site diary for a single day from a short verbal or typed brief. It follows conventions used by CITB-trained site managers and main contractors. The diary is a draft. The site manager or project manager reviews, signs, and files it.

## When to Use

- End of day on site, writing up the day's works
- Morning after, filling in yesterday's diary from notes
- Back-filling missed days before a monthly report or claim
- Preparing records for a delay claim, variation, or dispute

## Workflow

**Phase 1, gather inputs.**

Ask the user for the following. If anything is missing, ask one short follow-up question, do not guess.

- Date (default to today if user says "today")
- Site name or project name
- Site reference or job number, if used
- Site manager name (for sign-off)
- Weather through the day (am and pm, temperature, rain, wind)
- Labour breakdown, direct employed vs subcontractors, by trade
- Plant and equipment on site (excavator, scaffold, scissor lift, etc.)
- Deliveries received (time, supplier, material)
- Works completed by trade
- Delays, with reason (weather, delivery, design info, subbie no-show, etc.)
- Incidents or near-misses (RIDDOR reportable flagged)
- Visitors (name, company, reason, time in/out)
- Photos taken (count and subjects, consent status for any workers in frame)

**Phase 2, produce the diary.**

Fill the template below. Use plain English. Keep trade labels standard (bricklayer, groundworker, carpenter, electrician, plumber, plasterer, labourer, scaffolder, etc.). If a field has no entry, write "None" rather than leaving it blank.

**Phase 3, save.**

Save the diary as markdown to the user-specified path. Default path: `site-diaries/{site-slug}/{YYYY-MM-DD}-site-diary.md`. Create the folder if missing. Confirm the save path back to the user.

## Diary Template

```markdown
# Site Diary, {Site Name}

**Date:** {YYYY-MM-DD}
**Job Reference:** {ref or "n/a"}
**Site Manager:** {Name}
**Weather AM:** {conditions, temp}
**Weather PM:** {conditions, temp}

## Labour on Site

| Trade | Direct | Subcontractor | Total |
|-------|--------|---------------|-------|
| ...   | ...    | ...           | ...   |

**Total on site:** {number}

## Plant and Equipment

- {item, owner, in/out}

## Deliveries

| Time | Supplier | Material | Qty | Notes |
|------|----------|----------|-----|-------|
| ...  | ...      | ...      | ... | ...   |

## Works Completed

- {trade}: {description of works}
- ...

## Delays

| Delay | Reason | Hours Lost | Follow-up |
|-------|--------|------------|-----------|
| ...   | ...    | ...        | ...       |

## Incidents and Near-Misses

- {time, description, persons involved, action taken, RIDDOR reportable y/n}

If none: "No incidents or near-misses reported."

## Visitors

| Time In | Time Out | Name | Company | Reason | Inducted |
|---------|----------|------|---------|--------|----------|
| ...     | ...      | ...  | ...     | ...    | ...      |

## Photos

- {count} photos taken. Subjects: {list}. Consent obtained for all workers in frame: {y/n}.

## Notes

{Free-text notes, observations, items for tomorrow.}

---

Drafted by site diary skill. Reviewed and signed by:

**{Site Manager Name}** ______________________ **Date:** ______________
```

## Inputs Needed, Minimum

To produce a usable diary, the skill needs at least:

1. Date
2. Site name
3. Weather summary
4. Labour summary (trades and numbers)
5. Works completed, at least one line per trade on site

Everything else is optional but improves the record. If the user gives a short brief, the skill should fill the required fields and mark optional fields as "None" or "Not reported".

## References

- `references/uk-site-diary-guide.md`, standard fields expected on a UK construction site diary plus CITB and HSE pointers.

## Disclaimer

This is a draft. The site manager or PM must review, sign, and file the diary before it becomes a formal project record. The skill does not replace the site manager's duty to keep an accurate daily record. Photos of workers require worker consent under UK GDPR. RIDDOR reportable incidents must be reported to HSE separately, the diary is not a substitute for RIDDOR reporting.
