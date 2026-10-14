# "Built Piece by Piece": Exploded Turbo Image Prompts

This replaces the SVG drawing. The scroll animation stays the same: an assembled turbo
breaks apart into 5 parts as you scroll. I need real renders for it.

## How I will use your images (so you know what matters)

- **Black background is fine. Do NOT worry about transparency.**
  Generate everything on a **pure black (#000000) background**. I remove the black
  and blend each part into the dark page, so lit metal glows naturally.
- **No text, labels, arrows, numbers, logos or watermarks** in any image. Labels are HTML.
- I cut parts out and align them myself. You only need clean, well-lit, well-separated parts.

## Two ways to do it. Pick ONE

| | Option A (recommended) | Option B (fallback) |
|---|---|---|
| What you generate | **1 wide image** with all 5 parts already spaced in a row, plus 1 assembled turbo | 5 separate part images plus 1 assembled turbo |
| Why | The AI draws all parts in the **same style, lighting, angle and scale** in one go | Easier if your generator can't draw 5 distinct parts in one image |
| Risk | The generator may merge or skip a part (just regenerate) | Parts come out at different sizes and angles. I can fix scale but not angle |
| Total images | 2 | 6 |

**Start with Option A.** If after 3–4 tries it keeps merging or missing parts, switch to Option B.

## Save as

```
public/images/exploded/assembled.jpg          <- always needed
public/images/exploded/exploded-row.jpg       <- Option A
public/images/exploded/part-1-compressor-housing.jpg   <- Option B (all five)
public/images/exploded/part-2-compressor-wheel.jpg
public/images/exploded/part-3-center-cartridge.jpg
public/images/exploded/part-4-turbine-wheel.jpg
public/images/exploded/part-5-turbine-housing.jpg
```

## STYLE (paste at the end of every prompt)

```
STYLE: ultra-realistic premium automotive product photography, studio render, isolated on a pure solid black background (#000000), no floor, no reflection surface, no props, dramatic rim lighting with soft white key light and subtle red (#E10600) accent glow on the edges, brushed and machined metal with fine detail, sharp focus on every part, high contrast, 8k, no text, no labels, no numbers, no arrows, no logos, no watermark
```

Replace `[STYLE]` below with that block.

---

## 1. Assembled turbo (needed for both options)

**Size:** 2400×1600 or larger · **AR** 3:2
```
A complete performance turbocharger fully assembled, shown in side profile with a slight three-quarter angle, compressor (cold side) on the left with its air inlet facing left, turbine housing (hot side) on the right with a heat-tinted cast housing, center bearing housing in the middle with oil and coolant fittings, centered in frame with generous black space around it. [STYLE]
```
> Tip: your existing `products/turbo.jpg` has a floor and fog. Regenerate it with this prompt so the background is clean black.

---

## 2. OPTION A: all 5 parts in one wide image

**Size:** 3840×1646 or larger · **AR** 21:9 (use 16:9 if 21:9 isn't offered)
```
An exploded view of a performance turbocharger. Five separate parts floating in a single horizontal row along one straight center axis, evenly spaced with clear black gaps between them so no part touches or overlaps another, all at the same scale, all seen from the same side profile angle with a slight three-quarter tilt, all lit identically. From left to right: (1) a cast aluminium compressor housing with a round air inlet opening on the left, (2) a milled billet aluminium compressor wheel with swept curved blades, (3) a center bearing housing cartridge with oil feed and coolant ports and machined flanges, (4) a dark inconel turbine wheel with fine blades on a short shaft, (5) a cast iron turbine housing with a heat-tinted blue-bronze patina and a flange on the right. Each part complete and fully visible, centered vertically on the same horizontal line, wide black margins left and right. [STYLE]
```

**If a part is missing or merged, add this to the end and regenerate:**
```
Exactly five separate objects, each clearly isolated with at least a hand's width of empty black space between neighbours.
```

---

## 3. OPTION B: five separate part images

For consistency: **generate part 1 first, then use it as an image reference for the others**
(Midjourney: `--sref <image>`; ChatGPT/Gemini: upload it and say "match this exact style, lighting and camera angle").
Keep **all five in the same angle**: side profile, slight three-quarter tilt, inlet/outlet facing the same way.

**Size:** 2000×2000 · **AR** 1:1 for each, part centered with plenty of black margin.

### Part 1: `part-1-compressor-housing.jpg`
```
A single cast aluminium turbocharger compressor housing (cold side volute), round air inlet opening facing left, side profile with a slight three-quarter tilt, centered with generous black margin around it. [STYLE]
```
### Part 2: `part-2-compressor-wheel.jpg`
```
A single milled billet aluminium turbocharger compressor wheel with swept curved blades, side profile with a slight three-quarter tilt, shaft end pointing right, centered with generous black margin around it. [STYLE]
```
### Part 3: `part-3-center-cartridge.jpg`
```
A single turbocharger center bearing housing cartridge (CHRA) with oil feed port, coolant ports and machined flanges on both ends, side profile with a slight three-quarter tilt, centered with generous black margin around it. [STYLE]
```
### Part 4: `part-4-turbine-wheel.jpg`
```
A single dark inconel turbocharger turbine wheel with fine curved blades on a short shaft, side profile with a slight three-quarter tilt, shaft end pointing left, centered with generous black margin around it. [STYLE]
```
### Part 5: `part-5-turbine-housing.jpg`
```
A single cast iron turbocharger turbine housing (hot side volute) with a heat-tinted blue-bronze patina, exhaust outlet flange facing right, side profile with a slight three-quarter tilt, centered with generous black margin around it. [STYLE]
```

---

## Quality checklist (check before sending)

- [ ] Background is **solid black**, with no floor, gradient, fog, or glow filling the frame
- [ ] **No text, numbers or logos** anywhere
- [ ] Parts are **fully visible**, with nothing cropped at the edges
- [ ] (Option A) five objects, in the order above, **not touching**
- [ ] (Option B) same angle and lighting across all five
- [ ] Assembled turbo faces the **same direction** (inlet on the left)

## What happens after you send them

1. I slice/cut the parts out of the black, align them on one axis and match their scale.
2. The page shows the **assembled turbo**, then as you scroll it **separates into the five parts**,
   with labels fading in underneath. Same scroll experience as now, with photo-real parts.
3. On phones I show the same animation scaled down, with the parts list underneath.
4. I remove the SVG drawing from the page.

**Send me:** `assembled.jpg` and either `exploded-row.jpg` (A) or the five part files (B).
Drop them in `public/images/exploded/` and tell me which option you used.
