---
name: nhbc-lookup
description: Look up NHBC Standards chapter requirements for a specific UK residential build element. Use when the user asks about "NHBC", "NHBC Standards", "warranty requirement", or needs to know what NHBC requires for foundations, roofing, windows, drainage, DPC, or any other build element. Returns chapter pointer, key requirements summary, common failure points, and a link to the official chapter.
---

# NHBC Lookup

This skill helps a UK housebuilder or residential contractor quickly find the relevant NHBC Standards chapter for a build element, with a short summary of what NHBC typically requires and the most common failure points. Summary only. Full NHBC Standards are copyright NHBC and available to subscribers at nhbc.co.uk. Always check the current edition for compliance.

NHBC Standards are updated annually. Treat any summary here as a pointer, not a substitute for the live document.

## When to Use

- Design stage, checking whether a detail meets NHBC's technical requirements
- Inspection stage, knowing what the NHBC inspector will look at
- Pre-completion QA, working through a chapter checklist
- Investigating a defect claim, identifying the governing chapter
- Trades conversation, grounding a discussion in the right chapter

## Workflow

**Phase 1, identify the build element.**

Ask the user which element they want checked. Common elements, with fuzzy matching:

- Foundations (strip, raft, pile, trench fill)
- DPC and DPM
- External walls (cavity, brick, block, render, cladding, timber frame)
- Internal walls
- Floors (ground bearing, suspended, beam and block)
- Roofs (pitched, flat, warm deck, cold deck)
- Windows and doors
- Services (plumbing, electrical, ventilation, heating)
- Drainage (below-ground, above-ground)
- Finishes (plastering, tiling, flooring, decorating)
- External works (paving, retaining walls, fencing, trees, boundaries)

**Phase 2, retrieve chapter pointer.**

Refer to `references/nhbc-chapter-index.md` for the chapter map. Identify the chapter that governs the element.

**Phase 3, produce output.**

Use the template below. Keep key requirements short (3 to 6 bullets). Common failure points help the user focus the inspection.

**Phase 4, caveat the year.**

NHBC Standards are revised annually. Tell the user to check the current edition before relying on any summary. Give the URL to the live chapter.

## Output Template

```markdown
# NHBC Standards Check, {Element}

**Element:** {e.g. "Ground bearing slab, DPM installation"}
**NHBC Chapter reference:** {e.g. "Chapter 5.1, Substructure and ground bearing floors"}
**Summary checked against edition:** {year of summary, mark as "check live edition for current"}

## Key Requirements (summary, not the full chapter)

- {Requirement 1}
- {Requirement 2}
- {Requirement 3}
- {Requirement 4}

## Common Failure Points

- {Failure 1, with what to check at inspection}
- {Failure 2}
- {Failure 3}

## Authoritative Source

Live chapter: {URL to the NHBC Standards chapter}
NHBC Standards home: https://www.nhbc.co.uk/builders/products-and-services/techzone/nhbc-standards

## Year Caveat

NHBC Standards are revised annually. This summary is a pointer only. For compliance, always check the current edition of the chapter. Subscribers access full text at nhbc.co.uk TechZone.
```

## References

- `references/nhbc-chapter-index.md`, chapter map for the main NHBC Standards parts

## Disclaimer

Summary only. Full NHBC Standards are copyright NHBC and available to subscribers at nhbc.co.uk. This skill does not reproduce NHBC Standards content. It provides a structural pointer (chapter number, scope), a short summary of typical requirements informed by publicly available NHBC guidance, and a link to the authoritative chapter. For warranty compliance, the governing document is the current edition of NHBC Standards, not this summary. The skill does not constitute technical advice. Defect claims must be raised through NHBC's formal claims process.
