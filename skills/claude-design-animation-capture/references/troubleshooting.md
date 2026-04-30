# Troubleshooting

Common failure modes and how to fix them.

## "ffmpeg not found on PATH"

The skill calls `ffmpeg` via `spawnSync('ffmpeg', ...)`. It must be on your shell PATH.

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt install ffmpeg

# Windows
winget install Gyan.FFmpeg
# Then close and reopen your terminal.
```

Verify:

```bash
ffmpeg -version
```

## "Playwright not found"

```bash
npm install playwright
npx playwright install chromium
```

If you installed Playwright globally and the skill still cannot find it, install it locally inside this skill's folder:

```bash
cd ${CLAUDE_PLUGIN_ROOT}
npm install playwright
npx playwright install chromium
```

## Page is blank in the captured video, only `<div id="root"></div>` visible

Babel scripts in the Claude Design export did not load. Most likely causes:

1. The local server is not serving the right folder. Check the `[serve]` log lines printed by the skill, they should report `Serving <folder> at http://127.0.0.1:<port>/`.
2. Some scripts have absolute paths (`/animations.jsx`) and others have relative paths (`./animations.jsx`). The bundled server resolves both correctly. If the export uses an unusual path like `../shared/something`, copy the missing files into the served folder, or unzip and pass `--input <folder>` so you can manually adjust.
3. CORS / file:// errors. Always run via the skill (which spins up an HTTP server). Opening the export's HTML directly with `file://` will not work because Babel script loading is blocked.

## First frames show Arial, then snap to the export's real font (Space Grotesk / Inter)

Fonts didn't finish loading before recording started. The skill waits for `document.fonts.ready` plus 3 seconds for first paint. If you still see fallback fonts in the first second:

- Check that the export's font files (`.woff2`) are inside the served folder.
- If the export imports from Google Fonts and your machine is offline, replace with a local copy or run with internet access.
- As a last resort, increase the settle wait inside `capture.js` from 3000ms to 5000ms and rebuild.

## Recording is choppy, low FPS, or stutters

Headless Chromium can throttle when GPU compositing is unavailable.

- Try running with `headless: false` temporarily (edit `capture.js`, or expose as a flag in your fork). If the live preview is smooth and the recording is choppy, it's a headless-specific issue.
- Close other GPU-heavy applications (browsers, video calls, IDE animations).
- If the animation is rAF-driven, ensure no `setTimeout` ticks above 16ms, which can compete with rAF in headless mode.
- As a fallback, screen-record the live Claude Design preview at 60fps and post-process with ffmpeg.

## Output MP4 has the playback bar visible at the bottom

The skill hides bars matching `div[style*="rgba(20,20,20"]` and `div[style*="rgba(20, 20, 20"]`. If your export uses a different selector for the bar (Anthropic could change it):

1. Open the export's HTML in a browser, inspect the playback bar, copy a unique selector.
2. Edit `capture.js`'s `addInitScript` block and add the new selector to the `querySelectorAll` list.
3. Rerun.

## ZIP unzip fails on Windows

The skill tries `tar -xf` first, then `unzip` as fallback. On Windows 10+, `tar` ships with the OS and handles ZIP. If both fail:

1. Right-click the ZIP in Explorer -> Extract All -> pick a folder.
2. Pass that folder to the skill: `--input ./extracted-folder` instead of the ZIP.

## "Server did not respond at http://127.0.0.1:<port>/ within 4000ms"

Either:

1. The port was busy (the skill auto-tries 8765-8774). Close any conflicting service or pass `--port <high-number>` (e.g. `--port 19999`).
2. A firewall blocked localhost binding. Check OS / antivirus rules.
3. The server crashed at startup. Re-run with `--keep-temp` and inspect the `[serve]` log lines.

## ffmpeg fails with "Invalid data found when processing input"

The Playwright recordVideo did not produce a valid WebM. Usually means Chromium crashed mid-record.

- Re-run. Transient.
- If repeatable, install a newer Chromium: `npx playwright install chromium`.
- Check disk space in your OS temp directory.

## Output MP4 is shorter than --duration

The script's ffmpeg pass uses `-ss <offset> -t <duration>`. If the WebM was shorter than `offset + duration`, ffmpeg truncates to whatever is available.

- Increase `--duration` only up to the actual length of your animation in Claude Design.
- If the animation is shorter than 24s, pass `--duration <real-length>` to avoid wasted tail.
