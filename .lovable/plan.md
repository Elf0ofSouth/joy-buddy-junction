# Plan: Full-page Scroll-Snap Experience

Implement a premium, high-frame-rate scroll-snap experience for "Cipher Project". This will turn the homepage and the extension page into a series of immersive, full-screen vertical slides.

## User Review Required

> [!IMPORTANT]
> - Scroll-snap will be disabled on mobile (smaller viewports) to ensure a standard touch-scrolling experience, as full-page snapping can feel restrictive on small screens.
> - Sections taller than the viewport (like long lists or detailed feature grids) will be wrapped in containers that allow internal scrolling within their snapped state.

## Proposed Changes

### Styles
- Add global utility classes for scroll-snap containers and sections in `src/styles.css`.
- Define the `snap-y mandatory` container behavior and `snap-start` child behavior.
- Add smooth-scrolling and scroll-padding-top to account for the sticky navbar.

### Homepage (`src/routes/index.tsx`)
- Wrap the main content in a scroll-snap container.
- Update each section (Hero, Featured, Leaderboard, Why Choose, Featured Embed, Footer) to be full-height (`min-h-screen`) and centered.
- Add `snap-start` to each section.
- Implement a `useScrollSnap` hook or logic to handle JS-enhanced fade transitions between sections based on visibility.

### Extension Page (`src/routes/extensao.tsx`)
- Apply similar scroll-snap logic.
- Evaluate longer sections (like the 4-plan pricing grid or requirements) and ensure they handle overflow gracefully if the screen height is short.

## Technical Details

### CSS Implementation
```css
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
  scroll-behavior: smooth;
}

.snap-section {
  scroll-snap-align: start;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Framer Motion Integration
- Leverage `whileInView` and `AnimatePresence` to trigger the fade-out of the old section and fade-in of the new one.
- Use `framer-motion`'s `useScroll` and `useTransform` to tie opacity to the scroll progress of each section for that "fluid" feel.
