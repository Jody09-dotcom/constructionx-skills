---
name: toolbox-talk-generator
description: Generate a 5-minute UK construction toolbox talk from a one-line risk topic. Use when the user asks for a "toolbox talk", "safety briefing", "tbt", "weekly safety talk", or needs a short briefing to deliver to site operatives. Plain English, real site examples, one question to throw to the team, one specific "do this today" instruction, and a foreman sign-off block. UK conventions, HSE-aligned.
---

# Toolbox Talk Generator

This skill drafts a UK construction toolbox talk from a one-line risk topic (for example: "ladders", "manual handling", "lone working", "wet weather", "asbestos awareness"). The output is a five-minute briefing the foreman can read straight from a clipboard or paste into WhatsApp. Plain English. UK conventions. HSE-aligned where guidance is named.

The output is a draft. The foreman or site manager reviews and delivers it. Names, dates, and signatures are filled in on the day.

## When to Use

- Monday morning briefing on a recurring weekly hazard
- Mid-week response to something that happened on site (near-miss, weather change, new phase of works)
- Pre-task briefing before a high-risk activity (work at height, lifting, hot works)
- Subbie tool-up day, briefing a new gang on site rules
- Backfilling a missed week before an HSE audit, principal contractor inspection, or insurance review

## What This Skill Does NOT Do

- It does not file the talk. The foreman keeps the signed sheet in the site file.
- It does not replace a RAMS. A RAMS authorises the work. A toolbox talk reminds operatives of the controls.
- It does not invent regulations. If the model is not confident about a specific rule or document number, it says "verify against current HSE guidance for this hazard" rather than confabulating.

## Workflow

**Phase 1, gather inputs.**

The skill needs at minimum:

- Risk topic (one line, e.g. "ladders" or "lone working in occupied dwellings")

Optional inputs that make the talk land harder. Ask for any that are missing only if the topic is ambiguous, otherwise use sensible defaults:

- Site name or job number (default: leave as `{Site}` placeholder for the foreman to fill)
- Trade or trades on site (default: "all trades")
- Current phase of works (default: omit)
- Weather or seasonal factors (default: omit)
- Site-specific incident or near-miss this week (powerful when present, leave out if not)

**Phase 2, build the talk.**

Use the output template below. Hold to the structure:

1. **Opening hook (one sentence).** Name the consequence in plain English, not the regulation. "Three workers a year die falling from ladders in this country" beats "Working at Height Regulations 2005 requires...". Lead with what happens, not what's written down.
2. **Why this matters today (two or three sentences).** Connect to something specific: weather, a recent near-miss, the phase of works, a job on the programme this week.
3. **3 to 5 key points.** Each point: one short rule + one real-world site example. The example must be plausible on a UK construction site. Avoid generic "always wear PPE" filler. Specifics: "Last summer in Norwich a lad broke his foot when a 25kg bag of plaster slipped off a stack at chest height. He lifted it from a bad position and the strain pulled it out of his grip." Examples beat slogans.
4. **One question to throw to the team.** It should be open, not yes/no. It should start a conversation, not a register. "Where on this site this week could a ladder slide out from under you?" not "Do you know how to use a ladder safely?".
5. **One "do this today" instruction.** Specific. Actionable in the next eight hours. "Before you go up the ladder for the soffit work, walk around the base and check the ground for soft spots, mud, or tools left in the way" beats "be careful". The foreman should be able to point at it and a worker should know exactly what to do.
6. **HSE guidance reference.** If the hazard has well-known HSE guidance, name the document number (e.g. INDG401 for slips and trips, INDG143 for working at height, INDG163 for risk assessment, HSG150 for health and safety in construction). If the model is not confident about the right document, write "Verify against current HSE guidance at hse.gov.uk for this hazard" and stop.
7. **Sign-off block.** Foreman name, date, list of operatives briefed (print name + signature column).

**Phase 3, save.**

Save the talk as plain markdown to a user-specified path. Default path: `toolbox-talks/{YYYY-MM-DD}-{topic-slug}.md`. Confirm the save path back to the user.

The output must read cleanly on a phone screen. No nested tables. No fancy formatting. Markdown that copy-pastes into WhatsApp without breaking.

## UK Conventions, Critical

- UK English spelling throughout (colour, organisation, recognise, manoeuvre).
- UK terms: PPE, RAMS, RIDDOR, CDM 2015, HSE, F10, induction, banksman (or signaller), MEWP (mobile elevating work platform), scaffold (not scaffolding in safety contexts).
- Trades: bricklayer, groundworker, carpenter, electrician, plumber, plasterer, labourer, scaffolder, roofer, glazier.
- Distances in metres, weights in kilograms.
- Phone number for emergency: 999.
- HSE incident reporting: RIDDOR via hse.gov.uk/riddor (the foreman or site manager files, not the operative).

## Output Template

```markdown
# Toolbox Talk: {Topic Title}

**Site:** {Site name or job number}
**Date:** {YYYY-MM-DD}
**Foreman:** {Name}
**Trades briefed:** {list, or "all trades on site"}
**Read time:** 5 minutes

---

## Why we are talking about this today

{One-sentence hook naming the consequence in plain English.}

{Two or three sentences connecting the topic to today: weather, current works, a recent incident, a job this week.}

---

## Key points

**1. {Short rule.}**
{One real-world site example, plausible on a UK construction site, with specifics.}

**2. {Short rule.}**
{Real-world example.}

**3. {Short rule.}**
{Real-world example.}

{Optional 4 and 5 if the topic warrants it. 3 is the floor, 5 is the ceiling. Anything more and people stop listening.}

---

## Question for the team

{One open question. Not yes/no. Designed to start a conversation, not a register.}

---

## Do this today

{One specific, actionable instruction. The foreman should be able to point at it and an operative should know exactly what to do in the next eight hours.}

---

## HSE guidance

{Document number and short title, e.g. "INDG401, Preventing slips and trips at work, hse.gov.uk/pubns/indg401.pdf"}

{Or, if not confident: "Verify against current HSE guidance at hse.gov.uk for this hazard."}

---

## Sign-off

**Briefed by:** {Foreman name} **Date:** {YYYY-MM-DD}

Operatives briefed (print name and signature):

| Name | Signature |
|------|-----------|
|      |           |
|      |           |
|      |           |
|      |           |
|      |           |
|      |           |

---

_Drafted by toolbox-talk-generator. The foreman delivers and signs the talk on the day._
```

## Inputs Needed, Minimum

To produce a usable talk, the skill needs at least:

1. Risk topic (one line)

That is the only required input. Everything else either defaults or stays as a placeholder for the foreman to complete in pen on the day.

## References

- `references/hse-toolbox-talk-guide.md`, what an HSE-acceptable toolbox talk looks like, document references (INDG401, INDG143, INDG163, HSG150, etc.), record-keeping guidance.
- `references/example-outputs.md`, five worked examples across the most common UK site hazards.

## Disclaimer

This is an AI-generated draft. The foreman or site manager reviews, delivers, and signs the talk before it counts as a delivered toolbox talk. The skill does not replace a RAMS, a method statement, or formal HSE compliance. HSE guidance at hse.gov.uk is the authoritative source for UK construction health and safety. RIDDOR-reportable incidents must be reported separately to HSE; a toolbox talk is not a substitute for RIDDOR reporting.
