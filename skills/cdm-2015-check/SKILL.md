---
name: cdm-2015-check
description: Check a UK construction project against CDM 2015 duty-holder requirements and determine F10 notifiability. Use when the user asks about "CDM 2015", "CDM check", "F10", "notifiable project", "duty holders", or is scoping a new project and needs the CDM picture. Outputs duty-holder roles, F10 y/n with reasoning, pre-construction info checklist, construction phase plan checklist.
---

# CDM 2015 Check

This skill produces a one-page CDM 2015 brief for a UK construction project. It checks F10 notifiability, lists the duty-holders that apply, and produces Pre-Construction Information (PCI) and Construction Phase Plan (CPP) checklists. Advisory only. HSE is the authoritative source. For formal compliance, engage a qualified CDM coordinator or chartered construction professional.

## When to Use

- New project scoping, before tender or contract signing
- Tender stage, checking what the client must provide
- Due-diligence review on a project you are about to take on
- Client education, explaining CDM duties to a commercial or domestic client
- Checking F10 notifiability for a project you are mid-way through planning

## Workflow

**Phase 1, ask project facts.**

- Project description and scope
- Duration in working days (elapsed)
- Peak workforce on site at any one time
- Client type: commercial, public sector, domestic (i.e. private householder for their own dwelling)
- Is there more than one contractor on site (including subbies)? Yes/No
- Location and environmental factors (live building, public nearby, rail/road adjacency)

**Phase 2, apply F10 notifiability test.**

Under CDM 2015 Regulation 6, a project is notifiable to HSE via Form F10 if either:

- It is expected to last longer than 30 working days AND have more than 20 workers working simultaneously at any point, OR
- It is expected to exceed 500 person-days.

If either threshold is met, F10 notification is required. The client is the duty-holder for submitting the F10, but in practice the Principal Designer or Principal Contractor often prepares it.

Reference `references/cdm-2015-duty-holders.md` for the exact HSE wording and guidance.

**Phase 3, list duty-holders.**

Apply the CDM 2015 roles:

- **Client** (always). Domestic clients: their duties pass to the contractor (single-contractor) or Principal Contractor (multi-contractor). Commercial clients: full duties apply.
- **Principal Designer**. Required when more than one contractor is on site. Appointed in writing by the client.
- **Principal Contractor**. Required when more than one contractor is on site. Appointed in writing by the client.
- **Designers**. Anyone preparing or modifying a design, including temporary works designers and specifier-subcontractors.
- **Contractors**. Anyone managing or carrying out construction work.
- **Workers**. Operatives on site.

For domestic clients, note the pass-through: duties do not disappear, they move to PD/PC or sole contractor.

**Phase 4, produce PCI and CPP checklists.**

Pre-Construction Information (PCI): what the client provides to designers and contractors before work starts. Construction Phase Plan (CPP): what the Principal Contractor (or sole contractor) produces before work starts on site.

**Phase 5, present result.**

Use the output template below. Single-page brief. Short sentences.

## Output Template

```markdown
# CDM 2015 Project Brief

**Project:** {name}
**Client type:** {Commercial / Public sector / Domestic}
**Duration (working days):** {n}
**Peak workforce:** {n}
**More than one contractor:** {Yes / No}
**Prepared:** {YYYY-MM-DD}

## F10 Notifiable?

{Yes / No}

Reason: {Threshold calculation, e.g. "Duration 45 working days with peak 24 workers on site, exceeds the 30-day AND 20-workers test. F10 required."}

## Duty-Holders

| Role | Who | Key duties (summary) |
|------|-----|----------------------|
| Client | {name} | Provide PCI. Appoint PD and PC in writing. Ensure adequate time and resource. |
| Principal Designer | {name / "not required, single contractor"} | Plan, manage, coordinate H&S in pre-construction phase. Prepare PCI. |
| Principal Contractor | {name / "not required, single contractor"} | Plan, manage, coordinate H&S in construction phase. Produce CPP. |
| Designers | {list} | Design to eliminate/reduce risk. Provide information on residual risks. |
| Contractors | {list} | Plan, manage, monitor their own work. Produce RAMS. |
| Workers | n/a | Take care of own safety. Report risks. Cooperate. |

## Pre-Construction Information (PCI) Checklist

- [ ] Project description, scope, and programme
- [ ] Client's considerations and management requirements
- [ ] Existing site information (drawings, surveys, services)
- [ ] Asbestos survey (Refurbishment/Demolition where disturbing fabric)
- [ ] Ground conditions and contamination reports
- [ ] Structural information for the existing building (where relevant)
- [ ] Site hazards (overhead lines, buried services, adjacent occupants, restricted access)
- [ ] Welfare requirements
- [ ] Programme and key dates
- [ ] Procurement route and contractor list (where known)
- [ ] Design risk register from the design team
- [ ] Information for the CPP

## Construction Phase Plan (CPP) Checklist

- [ ] Description of the project and programme
- [ ] Management arrangements and responsibilities
- [ ] Key dates and phasing
- [ ] Arrangements for managing the significant risks identified in PCI
- [ ] Site rules and induction process
- [ ] Traffic management plan
- [ ] Welfare provision (toilets, drying room, rest facility, drinking water)
- [ ] First aid and emergency arrangements
- [ ] Fire safety plan
- [ ] RAMS for high-risk works (work at height, excavations, lifting, hot works, etc.)
- [ ] Arrangements for monitoring and review
- [ ] Asbestos management plan (where applicable)

## Notes and Escalations

{Free-text notes. Items the client needs to address. Any gaps that need competent-person input.}
```

## References

- `references/cdm-2015-duty-holders.md`, full duty-holder table, F10 thresholds, HSE L153 pointer

## Disclaimer

Advisory only. HSE is the authoritative source for CDM 2015 compliance. This brief is a starting point for discussion with a qualified CDM coordinator, chartered construction professional, or competent person. It does not replace formal appointments in writing, formal PCI, or a formal CPP. The skill does not file F10 with HSE. The client (or their appointed PD/PC acting on their behalf) is responsible for F10 submission at https://notifications.hse.gov.uk/fod/.
