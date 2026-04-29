# GHL API Quick Reference

Quick reference for the GoHighLevel API endpoints this skill uses. Source: https://highlevel.stoplight.io/docs/integrations.

## Base URL

```
https://services.leadconnectorhq.com
```

All requests need:

```
Authorization: Bearer <GHL_API_KEY>
Version: 2021-07-28
Content-Type: application/json
```

## Data Model

```
Location (sub-account)
  -> Pipelines
       -> Stages (ordered list per pipeline)
  -> Contacts
       -> Opportunities (each opportunity sits in ONE pipeline stage)
       -> Notes (timestamped, append-only)
       -> Custom field values
  -> Custom Fields (location-wide schema)
```

A "stage update" is conceptually: change `opportunity.pipelineStageId` to a new stage in the same pipeline. The opportunity is the link between contact and pipeline; the stage is the sub-position within that pipeline.

## Endpoints Used by This Skill

### Search contacts

```
GET /contacts/?locationId={loc}&query={text}&limit=20
```

Returns `{ contacts: [{ id, firstName, lastName, email, contactName, ... }] }`. Fuzzy-matches across name, email, phone.

### Get opportunities for a contact

```
GET /contacts/{contactId}/opportunities
```

Returns `{ opportunities: [{ id, pipelineId, pipelineStageId, status, monetaryValue, ... }] }`.

### Get all pipelines

```
GET /opportunities/pipelines?locationId={loc}
```

Returns `{ pipelines: [{ id, name, stages: [{ id, name, position }] }] }`.

### Update opportunity (the move)

```
PUT /opportunities/{opportunityId}
Body: { "pipelineStageId": "<new stage id>" }
```

### Append a note to a contact

```
POST /contacts/{contactId}/notes
Body: { "body": "<text>" }
```

Notes are append-only with auto-timestamp. The skill prefixes the note text with an ISO timestamp + the from->to stage move so the audit trail is human-readable.

### Read custom fields (for the Next Follow Up date)

```
GET /locations/{locationId}/customFields
```

Returns `{ customFields: [{ id, name, fieldKey, dataType, ... }] }`. The skill looks for a field named "Next Follow Up" (case-insensitive, space or underscore tolerated).

### Update contact custom field value

```
PUT /contacts/{contactId}
Body: { "customFields": [{ "id": "<fld id>", "key": "<fld key>", "value": "<value>" }] }
```

## Rate Limits

GHL enforces 100 requests per 10 seconds per token. The skill includes a sliding-window rate limiter that delays when the cap is hit, plus exponential backoff on 429 responses. For one-off stage updates this never fires; for bulk batches of 50+ it occasionally pauses.

## Required Token Scopes

Private Integration token (pk_...) needs:

- `contacts.readonly`
- `contacts.write`
- `opportunities.readonly`
- `opportunities.write`

If you also want the Next-Follow-Up custom field write to succeed:

- `locations/customFields.readonly`

Tokens with fewer scopes will fail at the relevant step with a 403. The skill reports the failing step rather than crashing.

## Common Errors

| Code | Meaning | Fix |
|---|---|---|
| 401 | Bad token | Regenerate Private Integration token |
| 403 | Missing scope | Add the scope to the token |
| 404 | ID not found | Contact / opportunity / pipeline doesn't exist |
| 422 | Validation failed | Body shape wrong; check the Stoplight docs for the endpoint |
| 429 | Rate limited | Skill auto-retries with backoff |
| 500 | GHL outage | Wait and retry, or check GHL status page |

## Notes on Pipeline IDs

Pipeline IDs and stage IDs are stable across renames. The skill matches by name (case-insensitive, fuzzy fallback) for the user-facing argument, and resolves to IDs internally for the actual API call. If you rename a stage, this skill keeps working without code changes.
