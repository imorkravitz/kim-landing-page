# Asset pipeline

How the images and videos under `src/assets/` were produced, so the next
person can reproduce or adjust them instead of guessing.

The full-quality originals live in `masters/`, which is **git-ignored**. Back
that folder up somewhere real. Everything below derives from it.

---

## Why this file exists

The hero image variants were generated once by hand, topped out at 1600px,
and the reason was forgotten. The desktop hero box asks for ~2420 device
pixels on a retina laptop, so the browser upscaled 2x and the hero looked
soft for months. Nobody could tell whether 1600 was a deliberate budget or an
accident, because nothing recorded the intent.

Same story with the stethoscope: the encode had no colour metadata and left
compression halos in what should have been pure white, and there was no
record of what produced it.

If you change any command here, change the note next to it too.

---

## Images

```bash
node scripts/make-image-variants.mjs <source> [--widths 420,800,1600,2400] [--stem name]
```

Writes `<stem>-<width>.avif` and `.webp` next to the source, which is the
naming `<ResponsiveImage>` globs at build time. Preserves alpha. Refuses to
generate a width larger than the master, because that is fake resolution: it
costs bytes and looks identical to the smaller file scaled up.

### Hero

```bash
node scripts/make-image-variants.mjs \
  src/assets/images/kim-hero-v1-nobg.png \
  --stem kim-hero-v1 --widths 420,800,1200,1586
```

`kim-hero-v1-nobg.png` (1586x992, matted to transparency) is **tracked**, not
in `masters/`. It is small enough to belong in the repo and it is the only
way to regenerate the eight derived files.

The fallback `src` that the component imports is a full-size WebP:

```bash
node -e "require('sharp')('src/assets/images/kim-hero-v1-nobg.png') \
  .webp({quality:82,effort:6}).toFile('src/assets/images/kim-hero-v1.webp')"
```

**Known ceiling.** The master is 1586px wide; the desktop hero box needs
~2420 device px, so there is a 1.53x upscale. Fixing that needs a wider
export from the photographer's original, not a wider variant from this file.

**If you replace the photo:** check the aspect ratio. This one is 1.599, not
the 1.778 of the photo it replaced, and the `width`/`height` attributes in
`ScrollStorySection.jsx` encode that. They are what reserves the box before
the image decodes, so a stale pair means layout shift on load. The mobile
`sizes="480px"` is derived from the same ratio.

---

## Stethoscope scroll video

Two encodes of one master, because the canvas fits the video to the viewport
**width**: a 375px phone at dpr 2 needs ~750px across, a 1512px desktop needs
~3024.

Master: `masters/stethoscope-4k-web.mp4` (3840x2160, 241 frames, 24fps).

> The master is 4K in dimensions but roughly 1080p in real detail. Measured:
> downscaling it to 1920 and back up loses almost nothing (PSNR 47.4 dB, where
> anything above ~45 means the extra pixels carry no information). So there is
> no point shipping a 2560 or 4K tier — it would double the bytes to deliver
> detail that does not exist. If a genuine 4K render ever arrives, re-measure
> before assuming that still holds.

```bash
LIFT="format=rgb24,lutrgb=r='clip(val*1.012,0,255)':g='clip(val*1.012,0,255)':b='clip(val*1.012,0,255)'"

# Desktop
ffmpeg -i masters/stethoscope-4k-web.mp4 \
  -vf "scale=1920:1080:flags=lanczos,$LIFT,format=yuv420p" \
  -c:v libx264 -crf 20 -g 1 -keyint_min 1 -sc_threshold 0 -preset slow \
  -color_range pc -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -movflags +faststart -an src/assets/videos/stethoscope-1920.mp4

# Mobile
ffmpeg -i masters/stethoscope-4k-web.mp4 \
  -vf "scale=1280:720:flags=lanczos,$LIFT,format=yuv420p" \
  -c:v libx264 -crf 26 -g 1 -keyint_min 1 -sc_threshold 0 -preset slow \
  -color_range pc -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -movflags +faststart -an src/assets/videos/stethoscope-1280.mp4
```

### What each flag is for

`-g 1 -keyint_min 1 -sc_threshold 0`
: Every frame a keyframe. This is the whole reason the scrub feels instant:
  seeking to an arbitrary time needs no backward decode. Verify with
  `ffprobe -select_streams v -show_entries frame=key_frame -of csv=p=0 FILE | grep -c '^1'`
  — it must equal the frame count (241). Drop these flags and the scroll
  animation stutters.

`$LIFT` (multiply RGB by 1.012, clipped)
: The component draws the video onto a `#ffffff` canvas and relies on the
  video's white being the page's white, seamlessly. It was not: compression
  ringing left 8.6% of the frame as faint grey (251-254) around the
  stethoscope, visible as dirt on a white section. The lift pushes that to a
  true 255. Measured effect: halo 8.64% -> 0.31%, while the subject moves by
  a mean of 1.5/255 and nothing new clips to white.

`-color_range pc -colorspace bt709 ...`
: The previous files carried **no** colour metadata, so browsers fell back to
  assuming limited range. Tagging explicitly removes the guess.

`-crf 20` desktop, `-crf 26` mobile
: Mobile renders at roughly half the size, so it can take more compression.
  Counter-intuitively the higher CRF also leaves a *cleaner* white, because
  it smooths the flat areas harder. Desktop 2.9MB, mobile 1.4MB.

`-movflags +faststart`
: Moves the index to the front so playback can begin before the whole file
  arrives. It is lazy-loaded when the section is within two viewports.

### After re-encoding, check

- keyframe count equals frame count (command above)
- `ffprobe` reports `color_range=pc`
- scroll through the section in a browser and confirm the scrub is smooth and
  the white background has no visible seam against the page
