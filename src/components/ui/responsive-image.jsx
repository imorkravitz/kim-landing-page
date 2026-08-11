import React from 'react';

/**
 * Serves the smallest image that still looks right on the device asking.
 *
 * The page previously shipped one file per image sized for its largest use.
 * That cannot be correct in both places at once: a testimonial renders 148css
 * on a phone and 286css on a desktop, so a single file is either soft on one
 * or roughly 4x the pixels needed on the other. Measured across the page, 92
 * of 96 images were being served more than 1.5x larger than the device could
 * use, and none carried a srcset.
 *
 * Variants are pre-generated next to the source as `name-<width>.avif|webp`
 * and collected here at build time, so nothing is fetched or guessed at
 * runtime and unused variants are never bundled.
 *
 * AVIF first, WebP second, original last — browsers take the first <source>
 * they understand, so old ones simply fall through to the file that was
 * already there.
 */
const VARIANTS = import.meta.glob('/src/assets/**/*-[0-9]*.{avif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Build "url 300w, url 576w" for one extension, or null if none exist. */
function buildSrcSet(stem, ext) {
  const prefix = `${stem}-`;
  const entries = Object.entries(VARIANTS)
    .filter(([p]) => p.startsWith(prefix) && p.endsWith(`.${ext}`))
    .map(([p, url]) => {
      const m = p.match(/-(\d+)\.[a-z]+$/);
      return m ? { w: Number(m[1]), url } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.w - b.w);

  return entries.length ? entries.map((e) => `${e.url} ${e.w}w`).join(', ') : null;
}

export default function ResponsiveImage({
  src,          // the original import — also the fallback
  stem,         // absolute source path without extension, e.g. /src/assets/patientsSuccess/1
  sizes,        // required: tells the browser the rendered width before layout
  alt = '',
  className = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  ...rest
}) {
  const avif = stem ? buildSrcSet(stem, 'avif') : null;
  const webp = stem ? buildSrcSet(stem, 'webp') : null;

  // No variants generated for this image yet — render a plain <img> rather
  // than an empty <picture>, so adding variants later is purely additive.
  if (!avif && !webp) {
    return (
      <img
        src={src} alt={alt} className={className} width={width} height={height}
        loading={loading} decoding={decoding} fetchPriority={fetchPriority} {...rest}
      />
    );
  }

  return (
    <picture>
      {avif && <source type="image/avif" srcSet={avif} sizes={sizes} />}
      {webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
      <img
        src={src} alt={alt} className={className} width={width} height={height}
        loading={loading} decoding={decoding} fetchPriority={fetchPriority} {...rest}
      />
    </picture>
  );
}
