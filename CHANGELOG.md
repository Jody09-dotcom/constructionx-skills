# Changelog

All notable changes to the ConstructionX Skills pack are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the pack uses [Semantic Versioning](https://semver.org/).

## v1.2.0 (2026-05-01)

### Added

- **claude-design-animation-capture** skill. Converts a Claude Design Animation export (ZIP or folder) into a clean 1080x1920 H.264 MP4 ready for Reels, Shorts, TikTok, or any social upload. Spins up a tiny local HTTP server to serve the React + Babel HTML, drives Playwright headless Chromium to record the playback at the requested dimensions, runs ffmpeg to crop, trim, and transcode. Bridges the gap that Claude Design has no native MP4 export. Cross-platform via Node 20+ and platform-agnostic APIs (tested on Windows, expected to work on macOS and Linux). Requires user-installed Playwright and ffmpeg. Includes a bundled minimal verification example so users can confirm their setup before pointing the skill at a real export. MIT.
- 1280x640 hero image at `assets/claude-design-animation-capture.png`.

### Changed

- Top-level README intro broadened to acknowledge the pack now spans UK construction skills and general utility skills.

## v1.1.1 (2026-04-29)

### Added

- **ghl-stage-update** skill. Move a GoHighLevel contact through pipeline stages with one command. Searches contact by name or email, finds the opportunity in the named pipeline, moves it to the target stage, optionally appends a note and sets the next follow-up date. Replaces the click-through flow in the GHL UI. Requires `GHL_API_KEY` and `GHL_LOCATION_ID` environment variables. First general-utility (non-construction) skill in the pack. Backfilled to CHANGELOG retroactively in v1.2.0; the skill itself shipped 2026-04-29 (commit eb04cf9 plus predecessors).

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
