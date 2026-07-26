# Scroll-Stacking Cards — Reusable Component

**Date:** 2026-07-26
**Status:** Approved
**Scope:** Homepage `Modules` section + a new reusable `StackingCards` / `StackingCard` component.

## Goal

On the homepage Modules section, when the user scrolls down, each successive card should pin to the top of the section and the next card should slide up to cover it (Framer-Motion "cover/stack" effect). Scrolling back up reverses the unstacking cleanly. The mechanism must be a generic, reusable component pair that can be applied to any list of cards (e.g. the `/modules` page later) — not bespoke to the modules data.

## Non-Goals

- Changing the modules data, copy, or images.
- Removing the existing left/right alternating image layout of modules cards.
- 3D / shrink-deck aesthetics (we chose the flat cover/stack).
- Reskinning other sections.

## Approach

**Framer Motion's `useScroll` + `useTransform`, paired with `position: sticky`.**

Why: `framer-motion` (and `motion`) is already a project dependency. The `useScroll({ target, offset: ["start start", "end end"] })` + per-card `useTransform` pattern is the canonical implementation of the "stacked cards" recipe, plays nicely with native scroll and the existing `lenis` smooth-scroll, and keeps the component generic — it doesn't know anything about modules, only that its children are cards.

Rejected alternatives:
- **GSAP ScrollTrigger pinning** — heavier wiring, ScrollTrigger/Lenis interop concerns, harder to genericize.
- **CSS-only `position: sticky` overlap** — works visually for stacking, but can't animate the cover transition and produces a harsh reverse. Too limiting.

## Components

### `app/components/StackingCards.tsx` (new, `"use client"`)

A pair of components, exported from one file:

```
<StackingCards className?: string>
  <StackingCard>…</StackingCard>
  <StackingCard>…</StackingCard>
  …
</StackingCards>
```

**`StackingCards`**
- Outer container with a `ref` passed to `useScroll({ target, offset: ["start start", "end end"] })`.
- Reads the number of children via `Children.count`. Sets the container's height to a runway: `calc(N * (cardHeight + gap) + viewportHeadroom)` so there's room to scroll/pin. In practice: render an outer scroll-track `<div>` whose height is driven by the card count, and an inner sticky stage `<div>` that holds the pinned cards.
- Exposes `gap` (px or rem) and `pinTop` (offset from container top) as optional props, with sensible defaults.
- Respects `prefers-reduced-motion`: when set (or below the `sm` breakpoint via a `useMediaQuery`), renders as a plain `flex flex-col gap-…` column with no transforms.

**`StackingCard`**
- `position: sticky; top: pinTop`.
- Each card gets its own slice of the container's `scrollYProgress`: `[(i-1)/n, i/n]` for the "covering" phase.
- `useTransform` produces a negative `y` that pulls the previously-pinned card up under the incoming card (translateY value scaled to roughly card height — pulled from a measure of the card via a ref). Optional subtle `scale`/`opacity` attenuation; kept minimal per "cover/stack" decision.
- When scrollYProgress is below a card's window, transforms return to identity → card sits in its natural pinned-top position. Above its window, the previous card rests stacked.
- Reverse (scroll up) is automatic — `useTransform` is a pure function of scroll progress, no imperative handlers.

## Wiring into `Modules.tsx`

Replace:
```tsx
<div className="mt-16 flex flex-col gap-8">
  {moduleGroups.map((group) => (
    <div key={group.id} className={…}>…</div>
  ))}
</div>
```
with:
```tsx
<StackingCards className="mt-16">
  {moduleGroups.map((group) => (
    <StackingCard key={group.id}>
      <div className={…existing card classes…}>…existing children…</div>
    </StackingCard>
  ))}
</StackingCards>
```

The `${group.id % 2 === 0 ? 'flex-row-reverse' : ''}` alternation, image, copy, and `Button variant="outline"` all remain unchanged. `SectionWrapper` stays.

## Data Flow

Pure scroll math — **no added state**.

```
useScroll(container) → scrollYProgress (0..1 over runway)
  per card i of n:
    useTransform(scrollYProgress, [start_i, end_i], [y_rest, y_stacked])
      | y_rest   = 0            (card sits at pinned top in its natural slot)
      | y_stacked = -<cardHeight> (swept up under the next card)
    motion.div style={{ y, scale, opacity }}
```

`ResizeObserver` is not strictly required (Framer Motion's `useScroll` re-measures on scroll/resize), but we'll use a `ref`-measured card height so the sweep distance matches real layout. Falls back to a fixed rem value if measurement yields 0 (SSR/initial).

## Constraints & Edge Cases

- **Mobile (< `sm`)**: skip the runway/sticky — render stacked cards as a plain column. Avoids a too-tall section on phones.
- **`prefers-reduced-motion`**: plain column, no transforms.
- **Resize**: `useScroll` re-measures; card heights come from ref so they update with layout.
- **SSR**: initial card height measurement is 0 → use a safe default sweep distance until mounted.
- **TypeScript strict**: typed props; no `any`. Children typed via `ReactNode`.
- **Tailwind v4 + `cn()`**: all classes via `cn(...)`; no inline styles for layout (only the Framer-driven `y`/`scale`/`opacity` inline styles).
- **`"use client"`** only on `StackingCards.tsx`; `Modules.tsx` already has the directive.
- Does **not** depend on `lenis` — works under native or smooth scroll.

## Verification

- `npm run lint`
- `npm run build`
- Manual: scroll down through the homepage Modules section — each card pins at the top and the next covers it; scroll back up — each card returns to its top-pinned position; no jank, no residue. Resize the window and re-test.
