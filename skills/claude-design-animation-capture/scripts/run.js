#!/usr/bin/env node
/**
 * claude-design-animation-capture
 *
 * Thin CLI entry point. Parses arguments, calls runCapture() from capture.js.
 *
 * Usage:
 *   node run.js --input ./export.zip
 *   node run.js --input ./unzipped-folder --duration 24 --output ./out.mp4
 *   node run.js --input ../example --duration 6 --output ./test.mp4
 */

const path = require('path');
const { runCapture } = require('./capture');

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

function usage() {
  console.error(
    [
      'Usage:',
      '  node run.js --input <zip-or-folder> [--output <mp4>] [--duration <s>] \\',
      '              [--width <px>] [--height <px>] [--port <int>] [--keep-temp]',
      '',
      'Required:',
      '  --input <path>         ZIP file OR unzipped folder containing the Claude',
      '                         Design Animation export.',
      '',
      'Optional:',
      '  --output <path>        Output MP4 path (default: ./<inputName>.mp4)',
      '  --duration <seconds>   Animation duration to capture (default: 24)',
      '  --width <px>           Output width  (default: 1080)',
      '  --height <px>          Output height (default: 1920)',
      '  --port <int>           Local server port (default: 8765, auto-fallback)',
      '  --keep-temp            Preserve intermediate WebM and unzipped folder',
      '',
      'Prerequisites: Node 20+, Playwright (chromium), ffmpeg on PATH.',
    ].join('\n'),
  );
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.input || args.help === true || args.h === true) {
    usage();
    process.exit(args.input ? 0 : 2);
  }

  // Resolve --input relative to the caller's CWD, not this script's folder
  const input = path.resolve(process.cwd(), args.input);
  const output = args.output ? path.resolve(process.cwd(), args.output) : undefined;

  try {
    const result = await runCapture({
      input,
      output,
      duration: args.duration,
      width: args.width,
      height: args.height,
      port: args.port,
      keepTemp: args['keep-temp'] === true,
    });
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } catch (err) {
    console.error(`\n[run] ERROR: ${err.message || err}`);
    process.exit(1);
  }
}

main();
