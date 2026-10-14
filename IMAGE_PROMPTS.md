# APEX AUTO PARTS: Image Asset Prompts

Paste each prompt into your AI image generator (Midjourney v7, Ideogram, Flux, DALL·E, etc.).
Save each result with the **exact filename** shown, into the folder shown.
I will wire them into the page. Anything missing will use a placeholder until you add it.

## Rules (important)

- **No text, logos or UI in any image.** All text is built in HTML. Every prompt ends with `no text, no watermark, no logo`.
- **Keep the style consistent.** Always keep the "STYLE" line (below) in every prompt.
- **Formats:** `.jpg` for photos and backgrounds, `.png` (transparent background) for cut-out products. If your tool can't do transparency, generate on a pure black background (#000) and tell me. I'll blend it in.
- **Resolution:** at least the size given. Bigger is fine.
- **Aspect ratios:** use the `AR` given (Midjourney: `--ar 16:9`; elsewhere pick the closest option).

## STYLE (appended to every prompt)

```
STYLE: premium dark automotive product photography, graphite black background (#0B0C0E), cinematic studio lighting, red (#E10600) rim light accents, brushed machined metal, subtle haze, high contrast, shallow depth of field, ultra-detailed, 8k, high-end Brembo/Porsche aesthetic, no text, no watermark, no logo
```

Replace `[STYLE]` below with the block above.

---

## A. HERO

### A1. Hero product: `public/images/hero/hero-brake.png`
**Size:** 2400×2400 · **AR** 1:1 · **Transparent PNG**
```
A single ventilated performance brake disc with a red brake caliper, tilted at a dynamic three-quarter angle, floating in mid-air, strong red rim light from behind, soft white highlights on the machined metal edge, tiny glowing sparks and metal particles around it, isolated on a pure black background. [STYLE]
```

### A2. Hero background: `public/images/hero/hero-bg.jpg`
**Size:** 2560×1440 · **AR** 16:9
```
An empty dark high-end performance garage workshop at night, polished concrete floor with reflections, out-of-focus tool wall and a car silhouette on a lift in the far background, a single red neon strip light glowing on the left, atmospheric haze, large negative space in the center and left for text, very dark overall. [STYLE]
```

---

## B. CATEGORIES (6 cards)

Product shots, dark gradient background, subject centered with space around it.
**Size:** 1200×1200 · **AR** 1:1 · save in `public/images/categories/`

### B1. `engine.jpg`
```
A chrome high-performance engine piston with connecting rod and rings, standing upright, dramatic side lighting with red rim light, dark background. [STYLE]
```
### B2. `brakes.jpg`
```
A drilled and slotted brake rotor with a red caliper, front three-quarter view, red rim light, dark background. [STYLE]
```
### B3. `suspension.jpg`
```
A performance coilover shock absorber with a red coil spring and polished body, upright, dramatic lighting, dark background. [STYLE]
```
### B4. `electrical.jpg`
```
A set of iridium spark plugs and an ignition coil arranged elegantly, close-up macro, tiny blue-white electric glow, red rim light, dark background. [STYLE]
```
### B5. `filters.jpg`
```
A premium oil filter and a performance air filter side by side, clean modern design, red rim light, dark background. [STYLE]
```
### B6. `body.jpg`
```
A modern LED sports car headlight assembly, angled view, lit up with glowing light signature, dark background, red accent reflections. [STYLE]
```

---

## C. FEATURED PRODUCTS (4 cards)

Clean cut-out product shots on a soft dark gradient.
**Size:** 1000×1000 · **AR** 1:1 · save in `public/images/products/`

### C1. `turbo.jpg`
```
A polished performance turbocharger, three-quarter view, studio lit, soft reflection on the floor, dark gradient background. [STYLE]
```
### C2. `pads.jpg`
```
A set of ceramic brake pads with metal backing plates, neatly stacked, macro detail on the friction material, dark gradient background. [STYLE]
```
### C3. `exhaust.jpg`
```
A stainless steel performance cat-back exhaust tip with burnt-titanium blue gradient, close three-quarter view, dark gradient background. [STYLE]
```
### C4. `battery.jpg`
```
A modern high-performance AGM car battery with red terminals, front three-quarter view, dark gradient background. [STYLE]
```

---

## D. SIGNATURE SECTION: EXPLODED TURBO

I'll animate these on scroll, so they must be **separate transparent PNGs**, same camera angle, same scale, centered, so they line up when stacked.
**Size:** 1600×1600 · **AR** 1:1 · **Transparent PNG** · save in `public/images/exploded/`

Generate #D0 first for reference, then the parts using the same seed or reference image.

### D0. `reference-assembled.png`
```
A complete turbocharger assembled, front three-quarter view, isolated on pure black, studio lit. [STYLE]
```
### D1. `compressor-housing.png`
```
Only the turbocharger compressor housing (cold side), same camera angle and lighting as the assembled turbo, isolated on pure black. [STYLE]
```
### D2. `compressor-wheel.png`
```
Only the turbocharger compressor wheel, with finely machined aluminum blades, same camera angle and lighting, isolated on pure black. [STYLE]
```
### D3. `center-cartridge.png`
```
Only the turbocharger center bearing housing (CHRA core), same camera angle and lighting, isolated on pure black. [STYLE]
```
### D4. `turbine-wheel.png`
```
Only the turbocharger turbine wheel (inconel hot side), same camera angle and lighting, isolated on pure black. [STYLE]
```
### D5. `turbine-housing.png`
```
Only the turbocharger turbine housing (hot side), with a slight heat-tint on the metal, same camera angle and lighting, isolated on pure black. [STYLE]
```

> If the separate parts won't align, skip D1–D5. I'll animate D0 with a stylised SVG exploded diagram instead.

---

## E. SECTION BACKGROUNDS

### E1. How it works texture: `public/images/bg/blueprint.jpg`
**Size:** 2560×1440 · **AR** 16:9
```
A dark technical engineering blueprint pattern with thin faint red and gray line drawings of engine parts, gears and dimension lines on a graphite black background, subtle grid, low contrast so text can sit on top, no readable text. [STYLE]
```

### E2. Wholesale banner: `public/images/bg/wholesale.jpg`
**Size:** 2560×1440 · **AR** 16:9
```
A professional automotive workshop interior, mechanics' tool cabinets and car lifts, deep depth of field blur, dark moody lighting with warm red accent lights, very dark overall with the right half clear for a form overlay. [STYLE]
```

### E3. Final CTA: `public/images/bg/cta.jpg`
**Size:** 2560×1440 · **AR** 16:9
```
A sports car's glowing red tail lights in the dark, extreme low angle, wet road reflections, motion blur streaks, very dark, space for text in the center. [STYLE]
```

---

## F. TESTIMONIAL AVATARS (3)

Natural, friendly, professional.
**Size:** 600×600 · **AR** 1:1 · save in `public/images/avatars/`

### F1. `avatar-1.jpg`
```
Portrait of a confident male mechanic in his 40s wearing a dark work shirt, slight smile, workshop background blurred, natural light, dark moody tone, photorealistic headshot.
```
### F2. `avatar-2.jpg`
```
Portrait of a young female car enthusiast in her late 20s, casual jacket, friendly smile, garage background blurred, photorealistic headshot, dark moody tone.
```
### F3. `avatar-3.jpg`
```
Portrait of a middle-aged male workshop owner with a short beard, work apron, serious yet warm expression, photorealistic headshot, dark moody tone.
```
*(If you'd rather avoid people photos, skip F. I'll use initials avatars instead.)*

---

## G. OPTIONAL (nice to have)

### G1. Open Graph / social preview: `public/images/og-image.jpg`
**Size:** 1200×630 · **AR** 1.91:1
```
A dramatic ventilated brake disc with a red caliper on the right, large empty dark area on the left, red rim light and sparks, graphite black background. [STYLE]
```

### G2. Brand logos strip
I will draw these as clean SVG wordmarks. If you want real brands (Bosch, Brembo, NGK…), send me the logo files, since I can't generate real logos.

---

## Checklist (tell me when done)

| Group | Files | Required? |
|---|---|---|
| A. Hero | A1, A2 | **Yes** |
| B. Categories | B1–B6 | Yes |
| C. Products | C1–C4 | Yes |
| D. Exploded | D0–D5 | Optional (fallback SVG) |
| E. Backgrounds | E1–E3 | Yes |
| F. Avatars | F1–F3 | Optional |
| G. OG image | G1 | Optional |

**Where to drop the files:** create the folders above inside
`C:\Users\Lenovo\Downloads\coding\animejs\autoparts\first\`
(or just dump them all in one folder and tell me. I'll sort them and rename.)

**Start with A1 and A2.** Once the hero images exist, I can build and show you the hero before you generate the rest.
