# Plan: Hero Redesign for Extensão Cipher Page

Redesign the hero section of the Extensão Cipher page with a centered layout, 3D stacked panel effect for the browser mockup, and specific typography updates.

## User Review Required

> [!IMPORTANT]
> The headline will now use the **Orbitron** font, a futuristic geometric display font. The browser mockup will be moved below the text and converted into a 3D-stacked fanned card layout.

## Proposed Changes

### Typography & Global Styles
- Update Google Fonts import in `src/routes/__root.tsx` to include `Orbitron` with weights 700/800.
- Update `.font-display` utility in `src/styles.css` to use `Orbitron` specifically for the hero headline.

### Extensão Cipher Hero Redesign (`src/routes/extensao.tsx`)
- **Text Layout**: 
    - Change the hero section container to a single-column flex layout (`flex-col items-center text-center`).
    - Remove the two-column grid structure.
    - Ensure all text elements (badges, headline, subtitle, pills, CTA) are horizontally centered.
- **Browser Mockup Layout**:
    - Move the mockup container below the text section.
    - Implement a 3D stacked fanned-card layout with three layers:
        - **Back Layer**: Offset up-and-left, dim, blurred, low-opacity.
        - **Middle Layer**: Offset slightly less, semi-visible, blurred UI.
        - **Front Layer**: Full interactive animation as currently implemented.
    - Add stagger animations for the layers entrance on scroll.
    - Add a subtle floating animation to the back and middle layers.
- **Mockup Component Refactoring**:
    - Extract the browser window content into a reusable sub-component or helper to maintain identical animation logic across the front and middle layers (middle layer with reduced opacity/blur).

## Technical Details

- **Framer Motion**: Use `variants` for staggered entry of the three layers. Use `animate` for the continuous floating effect on background layers.
- **Layout**: Use Tailwind's `max-w` containers and `mx-auto` for centering. The 3D effect will be achieved using relative/absolute positioning with `translate-x/y` and `rotate` transforms.
- **Font**: Apply `font-family: 'Orbitron'` via a specific Tailwind class or the `font-display` utility updated for this route.

## Detailed Steps

1. **Update Fonts**: Add `Orbitron` to `src/routes/__root.tsx`.
2. **Update CSS**: Set `font-display` to `Orbitron` in `src/styles.css`.
3. **Refactor Mockup Content**: Create a `BrowserMockupContent` component in `src/routes/extensao.tsx` to house the credits counter, progress bar, status, and input animation.
4. **Restructure Hero Grid**: Modify the `ExtensionPage` component to center text and place the mockup below.
5. **Implement 3D Stack**:
    - Build the `BackLayer` (plain glass panel).
    - Build the `MiddleLayer` (blurry `BrowserMockupContent`).
    - Build the `FrontLayer` (interactive `BrowserMockupContent`).
6. **Add Animations**: Stagger entrance and floating loops.
7. **Verify**: Check centering on mobile/desktop and ensure animations are smooth.
