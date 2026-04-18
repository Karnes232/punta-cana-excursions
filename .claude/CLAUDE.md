# Punta Cana Excursions — Project Instructions

## Project Overview

**puntacana-excursions.com** — A bilingual (EN/ES) excursion booking website for group/public tours in Punta Cana, operated by Grand Bay. Built as a sales-focused booking site that helps tourists discover, compare, and reserve excursions.

A companion site — **puntacanaprivateexcursions.com** — follows identical architecture with separate branding, content, and Sanity project.

---

## Tech Stack

- **Framework:** Next.js 16 App Router
- **CMS:** Sanity v3 (embedded Studio at `/studio`)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` in `globals.css` — NO `tailwind.config.ts`)
- **i18n:** next-intl (locales: `en`, `es`)
- **Fonts:** `next/font/google` (Montserrat for headings/buttons, DM Sans + Inter for body)
- **Deployment:** Vercel

---

## File Structure

```
punta-cana-excursions/
├── messages/                   # next-intl JSON catalogs (en.json, es.json)
├── public/                     # Static assets (logo, OG images)
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind v4 @theme tokens, base styles
│   │   ├── layout.tsx          # Root HTML shell (fonts loaded here)
│   │   ├── (root)/
│   │   │   ├── layout.tsx      # Shared layout (Navbar + Footer)
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx  # NextIntlClientProvider
│   │   │       ├── page.tsx    # Home
│   │   │       ├── excursions/
│   │   │       │   ├── page.tsx          # Browse all excursions
│   │   │       │   └── [slug]/page.tsx   # Individual excursion
│   │   │       ├── diving-snorkeling/
│   │   │       │   ├── page.tsx          # Diving hub
│   │   │       │   └── [slug]/page.tsx   # Individual dive/snorkel
│   │   │       ├── about/page.tsx
│   │   │       ├── blog/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [slug]/page.tsx
│   │   │       ├── contact/page.tsx
│   │   │       ├── faq/page.tsx
│   │   │       ├── how-it-works/page.tsx
│   │   │       ├── privacy-policy/page.tsx
│   │   │       └── terms-of-service/page.tsx
│   │   └── studio/
│   │       └── [[...tool]]/    # Embedded Sanity Studio
│   ├── components/
│   │   ├── HomePage/           # Page-scoped component folders
│   │   │   ├── Hero/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HeroBackground.tsx
│   │   │   │   ├── HeroHeadline.tsx
│   │   │   │   └── index.ts   # Barrel export
│   │   │   ├── BrandIntro/
│   │   │   ├── FeaturedExcursions/
│   │   │   ├── ExcursionCategories/
│   │   │   ├── WhyChooseUs/
│   │   │   ├── HowBookingWorks/
│   │   │   ├── Reviews/
│   │   │   ├── FaqPreview/
│   │   │   └── CtaBanner/
│   │   ├── ExcursionsBrowsePage/
│   │   ├── IndividualExcursionPage/
│   │   ├── DivingSnorkelingPage/
│   │   ├── Layout/
│   │   │   ├── Navbar/
│   │   │   └── Footer/
│   │   ├── BlockContent/
│   │   └── ui/                 # Shared primitives (RevealOnScroll, FilterScrollFade)
│   ├── i18n/
│   │   ├── routing.ts          # defineRouting (locales, default, prefix)
│   │   ├── request.ts          # getRequestConfig
│   │   ├── navigation.ts       # Locale-aware Link, redirect, usePathname
│   │   └── hreflang.ts         # SEO alternate-language helpers
│   ├── sanity/
│   │   ├── env.ts
│   │   ├── structure.ts        # Studio desk structure
│   │   ├── lib/
│   │   │   ├── client.ts       # Sanity client
│   │   │   ├── image.ts        # Image URL builder
│   │   │   └── live.ts
│   │   ├── schemaTypes/
│   │   │   ├── index.ts        # All schema exports
│   │   │   ├── Localized/      # localizedString, localizedText, etc.
│   │   │   ├── GeneralLayout/
│   │   │   ├── HomePage/
│   │   │   ├── ExcursionsBrowsePage/
│   │   │   ├── Excursion/      # Core excursion document type
│   │   │   ├── ExcursionCategory/
│   │   │   └── SEO/
│   │   ├── queries/            # GROQ queries (mirrors schemaTypes)
│   │   └── seed/               # Seed scripts (npx tsx)
│   └── proxy.ts                # next-intl middleware + matcher
├── .claude/
│   ├── CLAUDE.md               # This file
│   └── settings.json           # Claude Code settings
├── next.config.ts
├── sanity.config.ts
├── sanity.cli.ts
└── tsconfig.json
```

---

## Design Tokens & Brand

### Color Palette

| Token        | Hex       | Usage                                           |
| ------------ | --------- | ----------------------------------------------- |
| `ocean`      | `#005F86` | Primary buttons, headings, nav, trust elements   |
| `teal`       | `#0EA5B7` | Secondary accents, cards, hover, section accents |
| `sunset`     | `#F4A11A` | CTAs, badges, callouts, accent lines             |
| `sand`       | `#F7F7F5` | Section backgrounds, soft contrast blocks        |
| `navy`       | `#1F2937` | Body text, footer, overlays                      |
| `slate`      | various   | Supporting grays                                 |
| `whatsapp`   | `#25D366` | WhatsApp CTA buttons                            |
| `warm-yellow`| `#F7C948` | Star ratings, cheerful accents (use sparingly)   |

### Typography

- **Headings/Buttons:** Montserrat (SemiBold 600, Bold 700)
- **Body text:** DM Sans (Regular 400, Medium 500) — primary body font
- **Fallback body:** Inter (used in forms, metadata, small labels)
- **CSS variables:** `--font-montserrat`, `--font-dm-sans`, `--font-inter`
- **IMPORTANT:** Use `next/font/google` exclusively — never CSS `@import` from Google Fonts (causes circular references with Tailwind CSS variable bridging)

### Design Language

- **Section headers:** Centered with tri-part accent divider (teal line — sunset dot — teal line)
- **Animations:** Staggered scroll-triggered entrance via `IntersectionObserver` (RevealOnScroll component)
- **Cards:** Rounded corners (`rounded-2xl`), soft shadow, hover lift on desktop
- **Buttons:** Rounded (`rounded-full` or `rounded-xl`), slight shadow, energetic but not childish
- **Layout rhythm:** Alternate white / sand / image-led / CTA band sections
- **Max width:** `max-w-7xl` container with `px-5 sm:px-8 lg:px-12` padding

---

## Component Architecture

### Composition Pattern

Every page section follows this pattern:

```
PageName/
  SectionName/
    SectionName.tsx      ← Parent Server Component (composes sub-components)
    SectionNameHeader.tsx
    SectionNameContent.tsx
    SectionNameClient.tsx ← Client Component (only if interactivity needed)
    index.ts             ← Barrel export
```

**Rules:**
- Parent components are Server Components by default
- Add `"use client"` ONLY where interactivity or browser APIs are required
- Barrel exports via `index.ts` files for clean imports
- Keep sub-components focused — one responsibility per file

### Shared UI Components

Located in `src/components/ui/`:
- `RevealOnScroll` — IntersectionObserver wrapper for scroll-triggered animations
- `FilterScrollFade` — Horizontal scroll affordance with gradient fade edges (mobile)
- `SectionDivider` — Tri-part teal–sunset–teal accent divider

---

## Sanity CMS Patterns

### Localized Field Types

Defined in `src/sanity/schemaTypes/Localized/localized.ts`, driven by `src/i18n/i18n.ts` config:
- `localizedString` — Short text (title-like)
- `localizedText` — Multi-line text
- `localizedBlockContent` — Portable Text (rich content)
- `localizedStringArray` — Array of localized strings

These are **registered schema types** (via `defineType`), NOT inline helpers.

### Schema Design

- Singleton pages use a dedicated document type (e.g., `homePage`, `excursionsPage`, `generalLayout`)
- Each singleton has `__experimental_actions` to prevent creation/deletion in Studio
- `excursion` and `excursionCategory` are regular document types (multiple entries)
- Always cross-reference existing schemas before building components — avoid hardcoding CMS-managed content

### Query File Pattern

Each query file bundles types, GROQ string, and fetch function in ONE file:

```typescript
// src/sanity/queries/HomePage/homePageQuery.ts
import { client } from "@/sanity/lib/client";

// Types
export interface HomePageData {
  hero: { ... };
  // ...
}

// GROQ Query
export const homePageQuery = `*[_type == "homePage"][0]{
  hero { ... },
  // ...
}`;

// Fetch function
export async function getHomePage(): Promise<HomePageData> {
  return client.fetch(homePageQuery);
}
```

**DO NOT** separate types, queries, and fetch functions into different files.

### Seed Scripts

Pattern: `src/sanity/seed/seed[PageName].ts`

```bash
npx tsx src/sanity/seed/seedHomePage.ts
```

- Uses `createClient` directly with env vars and `dotenv/config`
- NOT Sanity CLI migration scripts
- References to `excursion` and `excursionCategory` documents should remain as empty arrays until those schemas are fully built

---

## i18n (next-intl)

### Routing

- Locales: `en` (default), `es`
- Routes under `src/app/(root)/[locale]/...`
- Middleware in `src/proxy.ts` with matcher excluding `/api`, `/_next`, `/studio`, and file extensions
- `NextIntlClientProvider` wraps content in `[locale]/layout.tsx`

### Message Files

- `messages/en.json` and `messages/es.json`
- UI chrome strings only — CMS content is localized in Sanity via localized field types
- Use `useTranslations('namespace')` in Client Components
- Use `getTranslations('namespace')` in Server Components

---

## Navigation (Main Nav)

- Home
- Excursions
- Diving & Snorkeling
- About Us
- Blog
- FAQ
- Contact
- **CTA:** Book Now / WhatsApp (always visible)
- **Language switcher:** EN / ES toggle

### Navbar Behavior

- Sticky on scroll with frosted glass backdrop (`backdrop-blur`)
- Animated hamburger menu on mobile
- Active link highlighting
- WhatsApp shortcut icon
- Mobile "Book Now" CTA button

---

## Build Workflow

### Sequential Build Order

James follows a section-by-section, approval-based workflow:

1. Each page section is delivered with component files + design explanation
2. James reviews and approves before moving to the next section
3. Sanity schemas and seed data are delivered alongside their components

### Current Progress (puntacana-excursions.com)

**Completed:**
- ✅ Foundation: Tailwind v4 tokens, next-intl, Sanity client, fonts
- ✅ Layout: Navbar, Footer, generalLayout schema + query
- ✅ HomePage: All 9 sections + homePage schema + seed
- ✅ Excursions Browse Page: Hero, Filter Bar, Grid, WhatsApp CTA Strip + schemas + seed
- ✅ Individual Excursion Page: Image Gallery Hero, Title+Summary, Price+Deposit, Highlights, Full Description, What's Included (sections 1-6)

**Next up:**
- Individual Excursion Page sections 7-11
- Wiring up page.tsx files with Sanity data fetching
- Building the `excursion` document schema
- Remaining pages (Diving & Snorkeling, About, Blog, Contact, FAQ, How It Works)

---

## Key Conventions

### Code Style

- TypeScript strict mode
- Prefer named exports over default exports (except page.tsx which requires default)
- Use `interface` over `type` for component props
- Descriptive file names matching component names (PascalCase)

### CSS / Tailwind

- Tailwind v4 CSS-first approach — all tokens in `globals.css` via `@theme`
- Use brand token names in classes: `bg-ocean`, `text-sunset`, `border-teal`
- Font classes: `font-heading` (Montserrat), `font-body` (DM Sans)
- NO `tailwind.config.ts` — everything lives in CSS

### Images

- Use `next/image` with `priority` on hero/above-fold images
- Sanity images: use `image.ts` URL builder with LQIP blur placeholders
- Always set `width`, `height`, or `fill` + `sizes` to prevent CLS

### Performance

- Lazy load below-fold components via `next/dynamic`
- Use `Promise.all()` for parallel Sanity fetches in page.tsx
- Keep Client Components minimal — push interactivity to leaf nodes
- Prefer `transform`/`opacity` animations (GPU-accelerated)

### Accessibility

- Minimum contrast 4.5:1 for text
- All images need descriptive `alt` text
- Touch targets minimum 44×44px
- Respect `prefers-reduced-motion`
- Keyboard navigation support on all interactive elements

---

## Things to AVOID

- ❌ Using `tailwind.config.ts` (we use Tailwind v4 CSS-first)
- ❌ CSS `@import` for Google Fonts (use `next/font/google` only)
- ❌ Hardcoding content that should be CMS-managed
- ❌ Inline component definitions (define components in their own files)
- ❌ Separating GROQ types, queries, and fetch functions into different files
- ❌ Using Sanity CLI migration scripts for seeding (use `npx tsx` + `createClient`)
- ❌ Making everything a Client Component — default to Server Components
- ❌ Emojis as icons (use SVG icons from Lucide or Heroicons)
- ❌ Heavy parallax or dramatic motion (keep animations smooth, modern, light)
- ❌ Overusing sunset orange — let it act as the "sunshine" accent, not the primary