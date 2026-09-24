#!/usr/bin/env node
/**
 * Generate responsive AVIF + WebP variants next to a source image.
 *
 *   node scripts/make-image-variants.mjs <source> [--widths 420,800,1600,2400] [--stem name]
 *
 * Writes `<dir>/<stem>-<width>.avif` and `.webp`, which is exactly the naming
 * that <ResponsiveImage> globs at build time. Nothing else needs updating.
 *
 * ── Why a script and not a one-off ────────────────────────────────────
 *
 * The hero variants in this repo were generated once by hand, topped out at
 * 1600w, and then the reason was forgotten. That is how the blur got in and
 * stayed: the desktop hero box asks for ~2420 device pixels on a retina
 * laptop, the widest variant was 1600, so the browser upscaled 2x. Having
 * the generation step in the repo means the next person can see the widths
 * and regenerate rather than guess.
 *
 * ── Two rules the widths have to respect ──────────────────────────────
 *
 * 1. Never upscale. A variant wider than the master is fake resolution: it
 *    costs bytes and looks identical to the smaller one scaled up. The
 *    script skips those widths and says so, rather than writing a file that
 *    lies about its detail.
 *
 * 2. The top width should cover the largest box the image renders into,
 *    times the device pixel ratio, capped at 2. Past DPR 2 the returns are
 *    invisible and the bytes are not.
 *
 * Alpha is preserved. The hero asset is a cutout and flattening it onto
 * white would put a rectangle on the cream section.
 */
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const src = args[0];
if (!src) {
  console.error('usage: node scripts/make-image-variants.mjs <source> [--widths a,b,c] [--stem name]');
  process.exit(1);
}

const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const widths = flag('widths', '420,800,1600,2400').split(',').map(Number).sort((a, b) => a - b);
const dir = path.dirname(src);
const stem = flag('stem', path.basename(src).replace(/\.[^.]+$/, ''));

const meta = await sharp(src).metadata();
console.log(`source: ${path.basename(src)}  ${meta.width}x${meta.height}  alpha=${meta.hasAlpha}`);

let wrote = 0;
for (const w of widths) {
  if (w > meta.width) {
    console.log(`  ${String(w).padStart(5)}w  skipped, master is only ${meta.width}px wide`);
    continue;
  }
  const base = sharp(src).resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' });

  const avifPath = path.join(dir, `${stem}-${w}.avif`);
  const webpPath = path.join(dir, `${stem}-${w}.webp`);

  /* effort 6 / quality 60 is the knee of the curve for AVIF photographs:
     below 55 the skin tones posterise, above 70 the file doubles for a
     difference nobody sees on a phone. */
  await base.clone().avif({ quality: 60, effort: 6 }).toFile(avifPath);
  await base.clone().webp({ quality: 82, effort: 6 }).toFile(webpPath);

  const kb = (p) => (fs.statSync(p).size / 1024).toFixed(1).padStart(7);
  console.log(`  ${String(w).padStart(5)}w  avif ${kb(avifPath)} KB   webp ${kb(webpPath)} KB`);
  wrote++;
}

console.log(`\n${wrote} width${wrote === 1 ? '' : 's'} written as ${stem}-<width>.{avif,webp} in ${dir}`);
