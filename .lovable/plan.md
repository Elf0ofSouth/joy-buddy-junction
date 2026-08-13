# Cipher Project Implementation Plan

Building a modern, dark-themed e-commerce platform for Discord server perks with a "cyber-syndicate" aesthetic.

## User Review Required

> [!IMPORTANT]
> - Do you have the Cipher Project logo files, or should I generate a placeholder SVG matching the description?
> - Should we implement the PIX payment flow as a manual confirmation (user sends proof) or use a gateway?

## Proposed Changes

### 1. Visual Foundation & Theme
- Update `src/styles.css` with the "Cipher Project" palette using OKLCH.
- Add custom utility classes for circuit-board backgrounds and glassmorphism.
- Set up global fonts (futuristic sans and monospace).

### 2. Layout & Components
- **Navbar**: Sticky glassmorphism bar with the logo and "Login with Discord".
- **Hero**: High-impact centerpiece with glowing logo and primary CTAs.
- **Product Grid**: Custom faceted cards with hover glow effects.
- **Footer**: Discord-centric footer with techy dividers.

### 3. Features & Logic
- **Authentication**: Discord OAuth via Supabase (Lovable Cloud).
- **Storefront**: Dynamic product loading from the backend.
- **Cart**: Simple local/session cart state with checkout flow.
- **Admin**: Protected dashboard to manage the inventory.

### 4. Database (Lovable Cloud)
- Create `products`, `orders`, and `user_profiles` tables.
- Enable RLS with Discord-based security.

## Technical Details
- **Palette**: `background: oklch(0% 0 0)` (Pure Black), `primary: oklch(65% 0.25 290)` (Vibrant Purple).
- **Icons**: Using Lucide-react for tech/server icons.
- **Animations**: Framer Motion for pulse and glow transitions.
- **Auth**: `@supabase/auth-helpers-react` for session management.
- **Payments**: PIX QR code generation for checkout.
