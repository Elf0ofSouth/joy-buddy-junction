---
name: Hero Redesign for Extensão Cipher
description: Swap columns, add 3D depth, update typography, and improve layout.
type: design
---

## Goals
- Swap text content to the RIGHT and animated browser mockup to the LEFT.
- Update headline typography to a futuristic/cyberpunk display font.
- Reduce headline font size by 15-20%.
- Add 3D perspective, tilt, and parallax to the browser mockup.
- Add layered depth elements (floating glow, background cards) behind the mockup.

## Technical Details
- Use `framer-motion` for 3D tilt and parallax effects.
- Implement `mouseMove` listeners to drive perspective rotation.
- Update CSS to include a futuristic font-family for headlines.
- Adjust grid layout in `src/routes/extensao.tsx`.
