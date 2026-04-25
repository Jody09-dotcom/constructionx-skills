# Changelog

All notable changes to the ConstructionX Skills pack are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the pack uses [Semantic Versioning](https://semver.org/).

## v1.1.0 (2026-05-01)

### Added

- **toolbox-talk-generator** skill. Generates a 5-minute UK construction toolbox talk from a one-line risk topic. Real-world site examples, one open question for the team, one specific "do this today" instruction, foreman sign-off block. UK conventions, HSE-aligned. Includes 5 worked example outputs in `references/example-outputs.md` covering working at height, manual handling, wet weather, lone working, and asbestos awareness.

### Pattern

- **Image-on-skill.** Every skill in the pack now ships with a header image (1280x640 PNG) in `assets/{skill-name}.png`. Images are embedded in the top-level pack README in both the banner row and the skills table thumbnail column. Going forward, no skill ships without one.

## v1.0.0 (2026-04-20)

### Added

Initial public release. Five UK construction skills:

- **site-diary**. Generates a daily UK construction site diary from a brief site-manager input. Captures weather, labour, plant, deliveries, works completed, delays, incidents, visitors, photos.
- **rams-generator**. Drafts a UK Risk Assessment and Method Statement (RAMS) from a task description. 5x5 risk matrix, hierarchy of control, PPE, sign-off block. Aligned to HSE 5-step risk assessment.
- **cdm-2015-check**. Checks a UK construction project against CDM 2015 duty-holder requirements and determines F10 notifiability. Outputs duty-holder roles, F10 y/n with reasoning, PCI checklist, CPP checklist.
- **cis-verification**. Walks a UK contractor through HMRC CIS subcontractor verification and calculates the correct deduction. 0/20/30% rate logic, materials exemption, CIS300 reminder.
- **nhbc-lookup**. Looks up NHBC Standards chapter requirements for a UK residential build element. Chapter pointer, key requirements, common failure points, official URL.

MIT licensed. Published at https://github.com/Jody09-dotcom/constructionx-skills.
