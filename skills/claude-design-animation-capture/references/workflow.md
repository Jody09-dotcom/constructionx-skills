# Workflow: Claude Design Animation -> MP4

Step-by-step walkthrough from a finished Claude Design Animation project to a social-ready MP4 file.

## What Claude Design exports

When you build with Claude Design (Anthropic Labs, Research Preview) using the Animation template, the project plays smoothly inside Claude Design's preview but **does not** export as a video. Share -> Download as ZIP gives you an HTML + JSX bundle. That bundle plays correctly in a browser, served over HTTP, with a Babel-loaded React runtime.

This skill is the bridge: it takes the ZIP, plays the animation in headless Chromium, records the playback, then ffmpeg-trims and transcodes to a single MP4.

## Step 1: Finish the animation in Claude Design

Build, iterate, and verify in Claude Design until the live preview plays the way you want. Pay attention to:

- **Total duration.** Note it. You'll pass it as `--duration` later.
- **Aspect ratio.** Vertical 9:16 (1080x1920) is the default for social. If you want landscape (1920x1080) or square (1080x1080), make sure your composition is designed for it. The skill crops to the requested dimensions, it does not letterbox.
- **Fonts.** If the animation uses a custom font, make sure it is imported in the project so it ships in the export.

## Step 2: Export as ZIP

In Claude Design: Share -> Download as ZIP.

Save the ZIP somewhere obvious, e.g. `~/Downloads/my-animation.zip`. Keep the ZIP. If you ever need to re-render at different dimensions or duration, the ZIP is the source.

## Step 3: Run the skill

If the skill is installed via `/plugin install claude-design-animation-capture@constructionx-skills`:

```
/claude-design-animation-capture
```

Or pass arguments directly:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/run.js \
  --input ~/Downloads/my-animation.zip \
  --duration 24 \
  --output ./my-animation.mp4
```

The skill:

1. Unzips the export (or uses a folder if you pass one).
2. Finds the entry HTML (prefers `index.html`).
3. Spawns a tiny local HTTP server on port 8765 (auto-fallback if busy).
4. Launches headless Chromium at 1080 x (1920 + 80px playback-bar buffer).
5. Hides the playback bar, waits for fonts and first paint, presses Home to snap the animation to t=0, records.
6. Runs ffmpeg to seek to the t=0 mark, take exactly `--duration` seconds, crop to 1080x1920, transcode to H.264 at 30fps CRF 18.
7. Cleans up temp files.

## Step 4: Wait

Total time: usually 60-120 seconds for a 24-second animation. Shorter animations finish faster.

The skill prints progress to stdout so you can watch it work.

## Step 5: Use the MP4

The output MP4 is H.264, yuv420p, 30fps, with `+faststart` for fast streaming. It plays in everything: VLC, QuickTime, Windows Media Player, every social platform.

Upload to:

- **LinkedIn**: native video upload, 1080x1920 vertical.
- **Instagram Reels**: native upload, 1080x1920 vertical.
- **YouTube Shorts**: native upload, 1080x1920 vertical, max 60 seconds.
- **TikTok**: native upload.
- **X**: native upload, 1080x1920 vertical.

Add music or voiceover at upload time per platform. The MP4 is silent.

## Tips

- **Keep the ZIP.** If you want to re-render at different dimensions or duration later, you'll thank yourself.
- **Match `--duration` to the real animation length.** Longer durations than the actual animation produce a black tail; shorter durations cut off the end.
- **Test on the bundled example first.** From the skill's folder: `node scripts/run.js --input ./example --duration 6 --output ./test.mp4`. If that works, your Playwright + ffmpeg setup is good.
- **Animation template only.** Wireframe, High Fidelity, and Slide Deck don't have the same timeline contract. They are not supported.
- **Re-render is cheap.** If the first MP4 has a glitch, re-run. The skill is deterministic given the same inputs.
