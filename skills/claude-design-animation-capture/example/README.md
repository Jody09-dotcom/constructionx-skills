# Example

This folder is an intentionally-minimal verification example for the `claude-design-animation-capture` skill. It is **not** a real Claude Design export. It is a single-file vanilla HTML animation that mimics enough of the Claude Design Animation contract for `capture.js` to drive it end-to-end.

## What it does

- Slate background `#1e293b`, off-white text `#f1f5f9`.
- "Demo" fades in over 0.5s, holds, then fades out over 0.5s.
- Total duration: 6 seconds.
- Listens for the `Home` key to reset its internal time variable to 0 (matching the Stage contract `capture.js` relies on).
- Includes a stand-in `rgba(20, 20, 20, 0.92)` bar so the playback-bar hide-selector has something to verify against.

## How to use

From this skill's root folder:

```bash
node scripts/run.js --input ./example --duration 6 --output ./test.mp4
```

After ~30 seconds you should see `test.mp4` (1080x1920, ~6 seconds, H.264). If the MP4 plays "Demo" fading in, holding, then fading out on a slate background, your Playwright + ffmpeg setup is good and you can point the skill at a real Claude Design export with confidence.

## How to swap in a real Claude Design export

Either:

1. Pass `--input ./your-export.zip` instead of `--input ./example`, or
2. Unzip the export first and pass the folder: `--input ./your-unzipped-export`.

The skill auto-detects the entry HTML, copies it to `index.html` if needed, and serves the folder via the bundled minimal HTTP server.
