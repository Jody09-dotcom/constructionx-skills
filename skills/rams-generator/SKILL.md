---
name: rams-generator
description: Draft a UK construction Risk Assessment and Method Statement (RAMS) from a task description. Use when the user asks for "RAMS", "risk assessment", "method statement", "draft a RAMS for [task]", or needs a working RAMS draft before a competent-person review. Covers hazard identification, 5x5 risk matrix, control measures, PPE, sign-off block. Aligned to HSE 5-step risk assessment.
---

# RAMS Generator

This skill drafts a UK Risk Assessment and Method Statement (RAMS) from a task description. It is aligned to the HSE 5-step risk assessment approach and uses a 5x5 risk matrix. The output is a working draft. A competent person must review and approve before the RAMS is issued, filed, or used to authorise work.

## When to Use

- New task or method coming up on site and you need a first draft
- Subcontractor RAMS submission, draft before a detailed review
- Client or principal contractor submittal, first pass
- Updating an existing RAMS after a change in method or circumstances

This skill does NOT file the RAMS, does NOT replace professional judgement, and does NOT produce an approved document.

## Workflow

**Phase 1, gather inputs.**

Ask the user for the following. If anything is missing, ask one short follow-up, do not guess.

- Task description (what is being done)
- Location (site, area, elevation if working at height)
- Operatives (how many, trade, any subbie firm names)
- Equipment and materials used
- Duration (hours, shifts, duration of the phase)
- Access method (ladders, tower scaffold, MEWP, stairs)
- Environmental factors (weather exposure, dust, noise, confined space, live services, public nearby)

**Phase 2, identify hazards.**

Consult `references/common-construction-hazards.md`. Pick every hazard that applies to the task. If a hazard is borderline, include it. It is easier for the competent-person reviewer to strike a line than to add one.

**Phase 3, score risks.**

For each hazard, score the inherent risk before controls using `references/hse-risk-matrix.md`, 5x5, Likelihood 1 to 5 times Severity 1 to 5. Band the score as Low (1-6), Medium (8-12), or High (15-25).

After the control measures, also score the residual risk. Both scores go in the hazard table.

**Phase 4, propose controls using the hierarchy of control.**

For each hazard, apply controls in this order:

1. Eliminate the hazard (can the task be done another way that removes the hazard entirely)
2. Substitute (lower-risk material, method, or tool)
3. Engineering controls (guards, ventilation, bunds, edge protection)
4. Administrative controls (permits, training, sequencing, exclusion zones)
5. PPE (last line of defence)

**Phase 5, produce the RAMS document.**

Use the output template below. Include a sign-off block. Save as markdown to a user-specified path, default `rams/{task-slug}-{YYYY-MM-DD}.md`.

## Output Template

```markdown
# Risk Assessment and Method Statement

**Task:** {Task description}
**Location:** {Site, area}
**Date prepared:** {YYYY-MM-DD}
**Prepared by:** {Name (drafted by AI, for competent-person review)}
**Reference:** {RAMS number or "TBC"}

## Scope

{One paragraph. What is being done, where, by whom, over what duration.}

## Operatives

| Role | Number | Trade / Firm | Competency / Training |
|------|--------|--------------|------------------------|
| ...  | ...    | ...          | ...                    |

## Equipment and Materials

- {item}
- ...

## Access Method

{Ladders / MEWP / tower scaffold / stairs / etc. Include inspection requirements.}

## Hazards and Risks

| # | Hazard | Who at risk | Inherent L | S | Score | Band | Controls (hierarchy) | Residual L | S | Score | Band |
|---|--------|-------------|------------|---|-------|------|----------------------|------------|---|-------|------|
| 1 | ...    | ...         | ...        |...| ...   | ...  | ...                  | ...        |...| ...   | ...  |

## Method Statement, Step by Step

1. {pre-task check, permits, isolations}
2. {setup and access}
3. {execution, step by step}
4. {quality checks}
5. {tidy-down and handover}

## Emergency Procedures

- First aid: {named first aider, location of kit}
- Fire: {nearest extinguisher, muster point}
- Incident: {report to site manager, call 999 if required, record in diary, RIDDOR if applicable}
- Spill or environmental release: {containment, reporting}

## PPE

Mandatory: hard hat, high-vis, safety boots, gloves, eye protection.
Task-specific: {e.g. FFP3 mask for dust, hearing protection for noise >80dB, harness and lanyard for height}.

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Prepared by | | | |
| Reviewed by (competent person) | | | |
| Approved by | | | |
| Briefed to operatives | | | |

Operatives briefed (print name, sign):

| Name | Signature | Date |
|------|-----------|------|
| ...  | ...       | ...  |
```

## References

- `references/hse-risk-matrix.md`, 5x5 matrix and banding
- `references/common-construction-hazards.md`, hazard library with standard controls

## Disclaimer

This is an AI-generated draft. A competent person must review and approve before the RAMS is issued, filed, or used to authorise work. The skill does not replace professional judgement. The RAMS is not valid until signed off by a competent person under your own company's procedures. HSE guidance (INDG163 and the Construction pages) is the authoritative source for UK risk assessment practice.
