---
name: claude-design-animation-capture
description: Convert a Claude Design Animation export (ZIP or folder) into a clean 1080x1920 H.264 MP4 ready for Reels, Shorts, TikTok, or any social upload. Use when the user asks for "render claude design", "capture animation export", "mp4 from claude design", "claude design to video", "export animation to mp4", or has a Claude Design Animation ZIP and wants a video file. Bridges the gap that Claude Design has no native MP4 export. Spins up a tiny local HTTP server to serve the React+Babel HTML, drives Playwright to record at the requested dimensions, runs ffmpeg to crop/trim/transcode. Requires Playwright and ffmpeg installed locally.
---

# Claude Design Animation Capture

Convert a Claude Design Animation export (ZIP or unzipped folder) into a clean 1080x1920 H.264 MP4 ready for Reels, Shorts, TikTok, or any social upload.

Claude Design (Anthropic Labs, Research Preview) ships an Animation template that exports an HTML + JSX bundle, not a video file. This skill bridges that gap. It spins up a tiny local HTTP server to serve the React + Babel HTML, drives Playwright headless Chromium to record the playback at the requested dimensions, then runs ffmpeg to crop, trim, and transcode to a single MP4.

## When to Use

- You exported a Claude Design Animation project as a ZIP and want an MP4 to upload to LinkedIn, Instagram Reels, YouTube Shorts, TikTok, or X.
- You want the same pixel-accurate playback the Claude Design preview shows, captured headlessly without screen-recording.
- You want a repeatable, scriptable pipeline — same input ZIP, same output MP4, every time.

Do NOT use this skill to:

- Capture Claude Design Wireframe, High Fidelity, or Slide Deck templates. They export different structures and don't have the timeline contract this skill relies on. Animation only.
- Render hosted Hyperframes URLs. Use the official Hyperframes CLI for those.
- Edit, trim, or merge multiple animations. This skill captures one export end-to-end. Compose afterwards in your editor of choice.

## Prerequisites

Node 20+, plus two user-installed tools.

**Playwright** (and a Chromium binary):

```bash
# From this skill's folder, or anywhere you want a local install:
npm install playwright
npx playwright install chromium
```

**ffmpeg** on PATH:

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt install ffmpeg

# Windows
winget install Gyan.FFmpeg
# Then close and reopen your terminal so ffmpeg is on PATH.
```

The skill itself has zero npm dependencies. Playwright and ffmpeg are user-installed because bundling them would push the skill from kilobytes to ~300 MB.

## Workflow

**Phase 1, gather inputs.**

Ask the user for the following. If anything is missing, ask one short follow-up question.

- **Input** (required): Path to the Claude Design Animation export. Either a `.zip` file (Share -> Download as ZIP from Claude Design) or an already-unzipped folder.
- **Output** (optional): Where to write the MP4. Defaults to `./<inputName>.mp4` in the current working directory.
- **Duration** (optional): How many seconds of the animation to capture. Defaults to 24. Match the actual length of the Animation in Claude Design.
- **Width / Height** (optional): Output dimensions. Defaults to 1080x1920 (vertical, social-ready).

**Phase 2, run the script.**

Invoke the bundled script:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/run.js \
  --input "{path to ZIP or folder}" \
  [--output "{path/to/output.mp4}"] \
  [--duration {seconds}] \
  [--width {px}] [--height {px}] \
  [--port {int}] [--keep-temp]
```

If `${CLAUDE_PLUGIN_ROOT}` is not available, use the absolute path printed by the plugin manager.

The script:

1. Resolves the input. If a ZIP, unzips into a temp folder. If a folder, uses it directly.
2. Finds the entry HTML file (prefers `index.html`, falls back to hint-matching names).
3. Spawns a minimal local HTTP server on a free port.
4. Launches headless Chromium via Playwright at the requested dimensions plus 80px for the playback bar.
5. Hides the playback bar, waits for fonts, snaps the animation to t=0, records.
6. Runs ffmpeg to seek to the t=0 mark, take exactly `duration` seconds, crop to the requested dimensions, transcode to H.264 at 30fps CRF 18 with `+faststart` for fast streaming.
7. Cleans up temp files unless `--keep-temp` was passed.

Total time: usually 60-120 seconds for a 24-second animation.

**Phase 3, report back.**

Confirm to the user:

- Output path: `{absolute path}`
- File size: `{N MB}`
- Duration: `{N seconds}`
- Codec: H.264, 30fps, yuv420p, MOV +faststart

If the script fails, summarise the cause in plain English and point at `references/troubleshooting.md` for the full failure-mode list.

## Inputs Needed, Minimum

To produce an MP4, the skill needs at least:

1. `--input` pointing at a ZIP or a folder
2. ffmpeg on PATH
3. Playwright + Chromium installed

Everything else (output, duration, dimensions, port) has sensible defaults.

## Examples

**Example 1, the bundled verification example:**

> "Test the skill works on my machine."

Run from this skill's folder:

```bash
node scripts/run.js --input ./example --duration 6 --output ./test.mp4
```

Produces a 6-second MP4 at 1080x1920 showing "Demo" fading in, holding, fading out. If this works, your Playwright + ffmpeg setup is good.

**Example 2, real Claude Design export:**

> "Render my Claude Design Animation export to MP4."

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/run.js \
  --input "C:/Users/me/Downloads/my-animation-export.zip" \
  --duration 24
```

Defaults to `./my-animation-export.mp4` next to the working directory. Vertical 1080x1920, ready for Reels.

**Example 3, custom dimensions for landscape:**

> "Same export but I want 1920x1080 landscape for YouTube."

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/run.js \
  --input ./my-animation.zip \
  --output ./my-animation-landscape.mp4 \
  --duration 24 \
  --width 1920 \
  --height 1080
```

Note: the underlying viewport is still rendered at `width x (height + 80)`, so the source animation must be designed for the requested aspect ratio. The skill crops, it does not letterbox.

## References

- `references/workflow.md` — step-by-step Claude Design -> ZIP -> MP4 walkthrough.
- `references/troubleshooting.md` — common failure modes (ffmpeg not found, Chromium missing, blank capture, font fallback, choppy playback, playback bar visible).

## Disclaimer

- **Animation template only.** Claude Design's Wireframe, High Fidelity, and Slide Deck templates export different structures. They are not supported.
- **Tested on Windows.** Mac and Linux paths are written by reasoning and follow Node's cross-platform APIs, but haven't been verified by the maintainer. Issues and pull requests welcome at https://github.com/Jody09-dotcom/constructionx-skills.
- **Claude Design is in Research Preview.** Anthropic may change the export format. If a future export breaks this skill, raise an issue.
- **No audio.** The skill captures video only. Add music or voiceover at upload time, per platform.
