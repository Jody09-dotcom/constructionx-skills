#!/usr/bin/env node
/**
 * claude-design-animation-capture
 *
 * Convert a Claude Design Animation export (ZIP or folder) into a clean
 * 1080x1920 H.264 MP4 by driving a headless browser through Playwright,
 * recording the playback, and post-processing with ffmpeg.
 *
 * Usage (CLI):
 *   node capture.js --input <path-to-zip-or-folder> [--output <mp4>] \
 *                   [--duration <seconds>] [--width <px>] [--height <px>] \
 *                   [--port <int>] [--keep-temp]
 *
 * Usage (module):
 *   const { runCapture } = require('./capture');
 *   await runCapture({ input: './export.zip', duration: 24 });
 *
 * Prerequisites: Node 20+, Playwright (with chromium), ffmpeg on PATH.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');
const { spawn, spawnSync } = require('child_process');

const DEFAULTS = {
  duration: 24,
  width: 1080,
  height: 1920,
  port: 8765,
  keepTemp: false,
};

const HTML_NAME_HINTS = ['composition', 'launch', 'clip', 'main', 'index'];

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function logStep(msg) {
  console.log(`[capture] ${msg}`);
}

function fail(msg, code = 1) {
  console.error(`[capture] ERROR: ${msg}`);
  process.exit(code);
}

function checkFfmpeg() {
  const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (r.error || r.status !== 0) {
    fail(
      'ffmpeg not found on PATH. Install:\n' +
        '  macOS:   brew install ffmpeg\n' +
        '  Ubuntu:  sudo apt install ffmpeg\n' +
        '  Windows: winget install Gyan.FFmpeg  (then restart shell)',
      2,
    );
  }
}

function requirePlaywright() {
  try {
    return require('playwright');
  } catch (err) {
    fail(
      'Playwright not found. From this skill folder run:\n' +
        '  npm install playwright\n' +
        '  npx playwright install chromium',
      2,
    );
    return null;
  }
}

async function isPortFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.once('listening', () => srv.close(() => resolve(true)));
    srv.listen(port, '127.0.0.1');
  });
}

async function findFreePort(startPort, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    const p = startPort + i;
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(p)) return p;
  }
  throw new Error(`No free port in range ${startPort}-${startPort + attempts - 1}`);
}

function unzipToTemp(zipPath) {
  // Use Node's built-in unzip via the `unzipper`-free path: require AdmZip
  // would add a dep. Instead, use the platform unzip. ZIP format is the same
  // everywhere; we shell out to a tool that exists on every supported OS.
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cda-capture-'));
  logStep(`Unzipping to ${tempDir}`);

  // Try Node 22+ built-in via fflate-style? Stick to platform tools that ship
  // with the OS. tar handles .zip on modern macOS, Linux (via bsdtar), and
  // Windows 10+. Try `tar -xf` first because it works cross-platform.
  let r = spawnSync('tar', ['-xf', zipPath, '-C', tempDir], { stdio: 'inherit' });
  if (r.status !== 0) {
    // Fallback: try `unzip`
    r = spawnSync('unzip', ['-q', zipPath, '-d', tempDir], { stdio: 'inherit' });
  }
  if (r.status !== 0) {
    throw new Error(
      `Could not unzip ${zipPath}. Tried 'tar -xf' and 'unzip'. ` +
        `Unzip the archive manually and pass --input <folder> instead.`,
    );
  }
  return tempDir;
}

function findEntryHtml(folder) {
  const all = [];
  function walk(d, depth = 0) {
    if (depth > 4) return;
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full, depth + 1);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) all.push(full);
    }
  }
  walk(folder);

  if (all.length === 0) return null;

  // 1. Prefer index.html if present, anywhere
  const idx = all.find((f) => path.basename(f).toLowerCase() === 'index.html');
  if (idx) return idx;

  // 2. Prefer files at the shallowest depth
  all.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length);
  const minDepth = all[0].split(path.sep).length;
  const shallow = all.filter((f) => f.split(path.sep).length === minDepth);

  // 3. Prefer hint-matching names
  for (const hint of HTML_NAME_HINTS) {
    const m = shallow.find((f) => path.basename(f).toLowerCase().includes(hint));
    if (m) return m;
  }

  // 4. If exactly one shallow HTML, use it
  if (shallow.length === 1) return shallow[0];

  // Ambiguous: return null and let caller raise with the list
  return null;
}

function ensureIndexHtml(htmlPath) {
  const dir = path.dirname(htmlPath);
  const idx = path.join(dir, 'index.html');
  if (path.basename(htmlPath).toLowerCase() === 'index.html') return dir;
  fs.copyFileSync(htmlPath, idx);
  logStep(`Copied ${path.basename(htmlPath)} -> index.html in ${dir}`);
  return dir;
}

function startServer(scriptDir, serveDir, port) {
  const serveScript = path.join(scriptDir, 'serve.js');
  const child = spawn(process.execPath, [serveScript, serveDir, String(port)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
    detached: false,
  });
  child.stdout.on('data', (d) => process.stdout.write(`[serve] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[serve] ${d}`));
  return child;
}

async function waitForServer(port, timeoutMs = 4000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`Server did not respond at http://127.0.0.1:${port}/ within ${timeoutMs}ms`);
}

function killServer(child) {
  if (!child) return;
  try {
    child.kill();
  } catch {
    /* noop */
  }
}

async function runCapture(opts = {}) {
  const input = opts.input;
  if (!input) throw new Error('--input is required (path to ZIP or folder).');
  if (!fs.existsSync(input)) throw new Error(`Input not found: ${input}`);

  const duration = Number(opts.duration ?? DEFAULTS.duration);
  const width = Number(opts.width ?? DEFAULTS.width);
  const height = Number(opts.height ?? DEFAULTS.height);
  const requestedPort = Number(opts.port ?? DEFAULTS.port);
  const keepTemp = Boolean(opts.keepTemp);

  if (!Number.isFinite(duration) || duration <= 0) throw new Error('--duration must be a positive number');
  if (!Number.isFinite(width) || width <= 0) throw new Error('--width must be positive');
  if (!Number.isFinite(height) || height <= 0) throw new Error('--height must be positive');

  checkFfmpeg();
  const playwright = requirePlaywright();

  // Resolve input: ZIP or folder
  let workDir;
  let unzippedTemp = null;
  const stat = fs.statSync(input);
  if (stat.isFile() && input.toLowerCase().endsWith('.zip')) {
    unzippedTemp = unzipToTemp(input);
    workDir = unzippedTemp;
  } else if (stat.isDirectory()) {
    workDir = path.resolve(input);
  } else {
    throw new Error(`--input must be a .zip file or a folder, got: ${input}`);
  }

  const entryHtml = findEntryHtml(workDir);
  if (!entryHtml) {
    throw new Error(
      `Could not find an entry HTML file in ${workDir}. ` +
        `Rename one of the HTML files to index.html and rerun with --input <folder>.`,
    );
  }
  const serveDir = ensureIndexHtml(entryHtml);

  // Output path
  const inputBase = stat.isFile()
    ? path.basename(input, path.extname(input))
    : path.basename(workDir);
  const output = path.resolve(opts.output || `./${inputBase}.mp4`);
  logStep(`Output: ${output}`);

  // Find a free port
  const port = await findFreePort(requestedPort, 10);
  if (port !== requestedPort) logStep(`Port ${requestedPort} busy; using ${port}`);

  // Temp dir for raw recording
  const captureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cda-record-'));
  logStep(`Recording into ${captureDir}`);

  const scriptDir = __dirname;
  const serverChild = startServer(scriptDir, serveDir, port);
  let browser = null;

  try {
    await waitForServer(port);

    logStep('Launching headless chromium...');
    browser = await playwright.chromium.launch({ headless: true });

    const recordingStart = Date.now();
    const context = await browser.newContext({
      viewport: { width, height: height + 80 },
      deviceScaleFactor: 1,
      recordVideo: { dir: captureDir, size: { width, height: height + 80 } },
    });
    const page = await context.newPage();

    // Hide playback bar (gets injected after React mounts) + clear persisted playhead
    await page.addInitScript(() => {
      const hide = () => {
        document
          .querySelectorAll(
            'div[style*="rgba(20,20,20"], div[style*="rgba(20, 20, 20"]',
          )
          .forEach((b) => {
            b.style.display = 'none';
          });
      };
      new MutationObserver(hide).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      try {
        localStorage.removeItem('animstage:t');
      } catch {
        /* noop */
      }
    });

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3000);

    await page.keyboard.press('Home');
    await page.waitForTimeout(80);

    const animTzeroAt = Date.now();
    const offsetSec = ((animTzeroAt - recordingStart) / 1000).toFixed(3);
    logStep(`Animation t=0 at recording-time ${offsetSec}s`);

    await page.waitForTimeout(Math.round((duration + 0.5) * 1000));

    await page.close();
    await context.close();
    await browser.close();
    browser = null;

    const webm = fs.readdirSync(captureDir).find((f) => f.endsWith('.webm'));
    if (!webm) throw new Error('No WebM produced by Playwright recordVideo.');
    const webmPath = path.join(captureDir, webm);
    logStep(`Raw recording: ${webmPath}`);

    logStep(`ffmpeg: -ss ${offsetSec} -t ${duration} crop=${width}:${height} H.264...`);
    const r = spawnSync(
      'ffmpeg',
      [
        '-y',
        '-ss', String(offsetSec),
        '-i', webmPath,
        '-t', String(duration),
        '-vf', `crop=${width}:${height}:0:0`,
        '-r', '30',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'slow',
        '-crf', '18',
        '-movflags', '+faststart',
        output,
      ],
      { stdio: 'inherit' },
    );
    if (r.status !== 0) throw new Error(`ffmpeg failed (exit ${r.status}).`);

    const outStat = fs.statSync(output);
    const sizeMb = (outStat.size / 1024 / 1024).toFixed(2);
    console.log(`\n[capture] OK. ${output} (${sizeMb} MB)`);
    return { output, sizeMb, durationSec: duration };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* noop */
      }
    }
    killServer(serverChild);

    if (!keepTemp) {
      try {
        fs.rmSync(captureDir, { recursive: true, force: true });
      } catch {
        /* noop */
      }
      if (unzippedTemp) {
        try {
          fs.rmSync(unzippedTemp, { recursive: true, force: true });
        } catch {
          /* noop */
        }
      }
    } else {
      logStep(`--keep-temp set. Preserved: ${captureDir}${unzippedTemp ? `, ${unzippedTemp}` : ''}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.input) {
    console.error(
      'Usage: node capture.js --input <zip-or-folder> [--output <mp4>] ' +
        '[--duration <s>] [--width <px>] [--height <px>] [--port <int>] [--keep-temp]',
    );
    process.exit(2);
  }
  try {
    await runCapture({
      input: args.input,
      output: args.output,
      duration: args.duration,
      width: args.width,
      height: args.height,
      port: args.port,
      keepTemp: args['keep-temp'] === true,
    });
  } catch (err) {
    fail(err.message || String(err), 1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runCapture };
