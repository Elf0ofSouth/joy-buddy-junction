# Admin Dashboard Implementation Plan

Create a secure, futuristic admin dashboard for "Cipher Project" at `/admin`, matching the existing purple/black/chrome glassmorphism aesthetic.

## Database & Security

- **User Roles & RLS**:
    - Update `user_profiles` table to include `is_admin` boolean (default: false).
    - Implement a `public.has_role(auth.uid(), 'admin')` security definer function.
    - Create new tables: `banners`, `stock_items`, `abandoned_carts`.
    - Apply RLS policies to all admin-related tables (products, orders, user_profiles, banners, etc.) allowing full access only to admins.
    - Ensure all public tables have appropriate `GRANT` statements.

## Layout & Navigation

- **Admin Layout (`/admin/route.tsx`)**:
    - Sidebar navigation: Visão Geral, Produtos, Estoque, Banners, Pedidos, Carrinhos Abandonados, Usuários.
    - Top bar: Admin Discord profile + "Voltar ao site" link.
    - Responsive design: Collapsible sidebar on mobile.
- **Route Protection**:
    - Root layout guard for `/admin`: Redirect non-admins to `/` and logged-out users to Discord login.

## Dashboard Sections

1. **Visão Geral (`/admin/index.tsx`)**:
    - Stat cards (Revenue, Orders today, Pending orders, Active products, Total users).
    - Recent activity list (Last 5 orders).
2. **Produtos (`/admin/produtos.tsx`)**:
    - Grid/Table view with search and category filters.
    - "Adicionar/Editar Produto" side panel with image upload, description, price, and stock toggle (limited vs unlimited).
    - Delete confirmation dialog.
3. **Estoque (`/admin/estoque.tsx`)**:
    - Management for license keys/credentials.
    - Bulk-add items (paste multiple lines).
    - Low-stock warning badges (< 5 units).
4. **Banners (`/admin/banners.tsx`)**:
    - Table of promotional banners with reordering functionality.
    - Form for image, title, link, and display duration.
5. **Pedidos (`/admin/pedidos.tsx`)**:
    - Filterable table of all orders.
    - Detail view for individual orders with manual "Mark as delivered" action.
    - Export to CSV functionality.
6. **Carrinhos Abandonados (`/admin/carrinhos-abandonados.tsx`)**:
    - View of pending orders/incomplete sessions for visibility.
7. **Usuários (`/admin/usuarios.tsx`)**:
    - List of registered users with total spent and order count.
    - Ability to toggle `is_admin` for other users (with confirmation).

## Technical Details

- **Framework**: TanStack Start v1 (React 19).
- **Styling**: Tailwind CSS v4 + Framer Motion for glassmorphism and glow effects.
- **Data**: Direct Supabase integration via `supabase` client.
- **Components**: Use Radix UI primitives (via shadcn) for Dialogs, Tabs, and Forms.
- **State Management**: Zustand for global state, TanStack Query for data fetching.
