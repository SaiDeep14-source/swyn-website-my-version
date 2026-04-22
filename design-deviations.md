# SWYN Website — Design Deviations

Intentional deviations from the design document, documented for review.

---

## 1. Typography — Serif Substitute

**Design doc spec:** Freight Display, Domaine Display, Canela, or Editorial New (premium serifs).
**Implemented:** Playfair Display (Google Fonts, free).
**Rationale:** The specified fonts are commercial typefaces requiring paid licenses. Playfair Display is the closest free alternative with the editorial, high-contrast serif character the design demands. It reads as premium and confident, not old-fashioned. When the brand invests in a type license, swapping the `--font-display` CSS variable to the chosen commercial font is a one-line change.

---

## 2. Hero Image — AI-Generated

**Design doc spec:** Sourced, non-stock photography (B&W city skyline, glass building at night, atmospheric).
**Implemented:** AI-generated cinematic cityscape, black and white, atmospheric haze, shot from a high vantage point.
**Rationale:** No suitable non-stock image was available. The generated image matches the brief closely — no identifiable faces, monochrome, atmospheric blur, cinematic mood. Should be replaced with professional photography when sourced.

---

## 3. Form Backend — Client-side only

**Design doc spec:** Form fills a brief; SWYN reads it and handpicks a match.
**Implemented:** Client-side forms with `e.preventDefault()` and a "thank you" confirmation state. Form action set to a Formspree placeholder URL.
**Rationale:** No backend exists yet. The form markup and submission flow are production-ready — swapping in a real endpoint (Formspree, Netlify Forms, or custom API) requires only changing the `action` attribute and removing the `preventDefault()`.

---

## 4. Section Background Rhythm — Slight Simplification

**Design doc spec:** dark / white / off-white / white / dark / off-white / dark (7-section alternation example).
**Implemented:** dark (hero) → white (problem) → warm (how it works) → white (functions) → dark (why SWYN) → warm (bench) → dark (dual CTA + footer). This is the exact spec applied to the 9 actual sections.
**Rationale:** No deviation — documenting for clarity that the rhythm matches.

---

## 5. Animation Scope

**Design doc spec:** "No animations beyond subtle scroll-triggered fade-ins."
**Implemented:** IntersectionObserver-driven `opacity` + `translateY` fade-ins, plus staggered reveal for grid/stats items (120ms delay per item). No parallax, no counters, no gimmicks.
**Rationale:** Staggered reveal is a micro-refinement of the allowed fade-in pattern — it adds polish without violating the restraint principle.

---

## 6. Nav CTA Label

**Design doc spec:** Nav right button is "Hire an expert" (bordered).
**Implemented:** Matches exactly. The hero primary CTA is "Tell us what you need" and the hero secondary is "Join as an expert" — also matching.
**Rationale:** No deviation.

---

## 7. No Accent Colour

**Design doc spec:** No brand accent colour. Contrast between cream and near-black IS the accent.
**Implemented:** Zero accent colours used anywhere. Hover states are subtle brightness shifts only.
**Rationale:** Matches spec exactly. Documenting to confirm this was intentional, not an oversight.
