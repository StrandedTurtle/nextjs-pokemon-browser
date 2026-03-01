# AGENTS.md - Pokémon Browser

This document provides essential information for AI coding agents working on this project.

## Project Overview

Pokémon Browser is a Next.js web application that provides a clean, interactive Pokédex interface. It uses the [PokéAPI](https://pokeapi.co/) (via `pokenode-ts`) to fetch Pokémon data and displays it with a modern UI built on [shadcn/ui](https://ui.shadcn.com/) components.

**Key Features:**
- Browse Pokémon with pagination (20 items per page)
- Real-time search filtering across all Pokémon
- Detailed Pokémon pages with stats, types, abilities, and descriptions
- Responsive grid layout
- Loading states for better UX

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (New York style) |
| API Client | pokenode-ts + axios (with caching) |
| Icons | lucide-react |
| Package Manager | npm / pnpm |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── details/           # Pokémon detail page
│   │   ├── loading.tsx    # Loading UI for details
│   │   └── page.tsx       # Server-side detail page
│   ├── fonts/             # Custom fonts (Geist)
│   ├── globals.css        # Global styles + Tailwind
│   ├── layout.tsx         # Root layout with Inter font
│   ├── loading.tsx        # Loading UI for home
│   └── page.tsx           # Main listing page (client-side)
├── components/ui/         # UI components
│   ├── PokemonCard.tsx    # Custom Pokémon card component
│   └── [shadcn components]# Button, Card, Badge, etc.
├── lib/                   # Utilities and API
│   ├── pokeapi.ts         # PokéAPI client instance
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Tailwind cn() utility
├── static/                # Static assets (images)
└── [config files]         # next.config.mjs, etc.
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Architecture Details

### Rendering Strategy
- **Home Page (`app/page.tsx`)**: Client Component (`"use client"`) - uses React hooks for state management (search, pagination)
- **Details Page (`app/details/page.tsx`)**: Server Component (async) - fetches data server-side using `searchParams`
- **Loading States**: Dedicated `loading.tsx` files provide instant feedback during navigation

### Data Flow
1. Home page fetches all Pokémon names/URLs on mount (cached)
2. Search filters the local list (debounced 300ms)
3. Pagination slices the filtered list
4. Detailed data fetched for visible items only (20 per page)
5. Detail page fetches full Pokémon + species data server-side

### API Integration
```typescript
// lib/pokeapi.ts
import { PokemonClient } from "pokenode-ts";
export const api = new PokemonClient();
```

Uses `pokenode-ts` for type-safe PokéAPI access with built-in caching via `axios-cache-interceptor`.

## Styling Conventions

### Color System
The project uses a custom color scheme prefixed with `forloop-`:

| Token | Value | Usage |
|-------|-------|-------|
| `forloop-text-primary` | `#181A1B` | Primary headings |
| `forloop-text-muted-foreground` | `#71717A` | Secondary text |
| `forloop-text-foreground` | `#09090B` | Body text |
| `forloop-border` | `#E4E4E7` | Borders, dividers |
| `forloop-bg-primary` | `#18181B33` | Hero backgrounds |
| `forloop-bg-secondary` | `#F4F4F5` | Card headers |

### Typography Scale
Custom heading styles defined in `globals.css`:
- `h1`: 60px/78px, font-semibold
- `h2`: 30px/36px, font-semibold
- `h3`: 24px/32px, font-semibold
- `h4`: 16px/20px, font-semibold
- `p`: 20px/28px, font-normal

### Tailwind CSS Guidelines
- Use `@apply` for common patterns in CSS
- Custom utility classes for image rendering: `.rendering-pixelated`
- Component variants use `cva` (class-variance-authority)
- Prefer semantic color tokens over hardcoded values

## Component Patterns

### shadcn/ui Components
Components follow the shadcn/ui pattern:
- Use `cn()` utility for class merging
- Forward refs for composition
- Support `asChild` prop for polymorphism
- Variants defined with `cva`

Example:
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Adding New Components
When adding shadcn/ui components, use the shadcn CLI or copy the pattern from existing components in `components/ui/`.

## ESLint Configuration

The project uses a modern flat ESLint config (`eslint.config.mjs`):

- **TypeScript**: `typescript-eslint` recommended rules
- **React**: Recommended + JSX runtime (no import needed)
- **React Hooks**: Rules of hooks + exhaustive deps
- **Next.js**: Recommended + Core Web Vitals
- **Tailwind**: Canonical classes plugin (warns on arbitrary values)

Key rules:
- `react/react-in-jsx-scope: off` (Next.js handles this)
- `react/prop-types: off` (using TypeScript)

## Image Handling

Pokémon sprites are loaded from `raw.githubusercontent.com/PokeAPI/sprites/`. 

**Configuration in `next.config.mjs`:**
```javascript
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'raw.githubusercontent.com',
    pathname: '/PokeAPI/sprites/master/sprites/pokemon/**',
  }],
}
```

**Rendering:**
- Use `next/image` with `fill` and `object-contain`
- Apply `rendering-pixelated` class for crisp pixel art

## Testing Strategy

Currently, this project does not have automated tests. When adding tests:

- Use Vitest or Jest for unit tests
- Use React Testing Library for component tests
- Use Playwright for E2E tests (if needed)

## Common Tasks

### Adding a New Page
1. Create directory under `app/`
2. Add `page.tsx` (server or client component)
3. Add `loading.tsx` for loading state
4. Update navigation links in existing pages

### Fetching Pokémon Data
```typescript
import { api } from "@/lib/pokeapi";

// Get by ID
const pokemon = await api.getPokemonById(id);

// Get by name
const pokemon = await api.getPokemonByName(name);

// Get species data
const species = await api.getPokemonSpeciesById(id);

// List all (paginated)
const list = await api.listPokemons(offset, limit);
```

### Adding New UI Components
1. Place in `components/ui/`
2. Use `cn()` from `@/lib/utils` for class merging
3. Forward refs for composability
4. Export from index if creating barrel exports

## Environment Requirements

- **Node.js**: Latest LTS recommended
- **Package Manager**: npm (lockfile present) or pnpm (pnpm-lock.yaml present)

## Notes for AI Agents

1. **Type Safety**: The project uses strict TypeScript. Avoid `any` types.
2. **Client vs Server**: Check for `"use client"` directive before adding hooks.
3. **Styling**: Prefer Tailwind classes over inline styles. Use the `forloop-*` color tokens.
4. **Images**: Always use `next/image` for external images with proper config.
5. **Icons**: Use `lucide-react` for icons.
6. **State Management**: Simple React hooks are sufficient; no need for external state libraries.
