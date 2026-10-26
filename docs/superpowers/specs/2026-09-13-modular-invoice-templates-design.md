# Modular Invoice Templates Architecture Specification

**Date:** 2026-09-13  
**Status:** Approved for Implementation  
**Topic:** Modular Invoice Templates Architecture (`minimal`, `apple`, `stripe`, `amazon`, `microsoft`, `google`, `shopify`, `custom`)

---

## 1. Overview & Goals

Transform SmartInvoice's monolithic PDF generation and theme system into a modular, enterprise-grade template architecture with 8 dedicated template definitions:
```
lib/templates/
├── types.ts          # Core template interfaces, context, and color models
├── base.ts           # Shared layout primitives, tables, logo scaling, watermarks
├── minimal.ts        # Pure typography, high-contrast monochrome design
├── apple.ts          # Ultra-luxury Cupertino aesthetic, refined spacing
├── stripe.ts         # Modern fintech aesthetic, subtle indigo accents & badges
├── amazon.ts         # High-density structured enterprise layout, amber accents
├── microsoft.ts      # Fluent design, Microsoft blue accent bar, boxed meta
├── google.ts         # Material design, Google blue & 4-color accents
├── shopify.ts        # Modern merchant receipt aesthetic, emerald accents
├── custom.ts         # Dynamic user-customizable color engine
└── index.ts          # Central registry & dispatcher (getTemplate, ALL_TEMPLATES)
```

### Key Requirements:
1. **Zero Text Collisions & Top-Right Logo Alignment**: Every template natively guarantees proportional aspect-ratio logo placement in the top-right corner without overlapping titles, invoice numbers, or headers.
2. **Dedicated Modular Files**: Each template lives in its own `.ts` file with its own styling rules, colors, geometry, and layout hooks.
3. **End-to-End Integration**:
   - **UI**: `ThemeSelector.tsx` and `app/dashboard/create/page.tsx` display all 8 templates with real-time color dots and interactive color pickers for `custom`.
   - **PDF Engine**: `lib/pdf-generator.ts` and `/api/invoices/preview`, `/api/invoices/[id]/pdf` seamlessly dispatch to the modular registry.
   - **Web Preview**: `components/invoices/templates/InvoiceRenderer.tsx` cleanly supports all 8 themes in real-time.

---

## 2. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Create Invoice Page                       │
│    ThemeSelector.tsx: 8 Cards (Minimal, Apple, Stripe, ...)  │
│    Dynamic Color Pickers (Enabled for "Custom" theme)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 lib/templates/index.ts                      │
│        Registry: getTemplate(id) -> InvoiceTemplate         │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐        ┌──────────────┐
│  apple.ts    │       │  stripe.ts   │        │  custom.ts   │  ... (all 8)
└──────┬───────┘       └──────┬───────┘        └──────┬───────┘
       │                      │                       │
       └──────────────────────┼───────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   lib/templates/base.ts                     │
│  - drawLogo (aspect-ratio preservation, top-right align)    │
│  - drawWatermark (proforma, past-due, draft)                │
│  - renderItemsTable (headers, rows, borders, zebra-stripes) │
│  - renderTotalsBlock (subtotal, tax, discount, grand total) │
│  - renderFooter & specialized type fields                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Premium PDF Generator Pro                   │
│          ArrayBuffer / Blob / Download / Email              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Template Specifications

### 1. `apple.ts` (Cupertino Ultra-Luxury)
- **Primary / Accent**: `#1D1D1F` (Dark Charcoal), `#86868B` (Apple Silver), `#0071E3` (Apple Blue).
- **Layout**: Generous 20mm margins, 28pt bold title, logo top right (`y = 18`), elegant thin hairline dividers (`#D2D2D7`), dual-column client/due-date blocks.

### 2. `minimal.ts` (Pure Typography)
- **Primary / Accent**: `#000000` (Pitch Black), `#71717A` (Muted Zinc), `#E4E4E7` (Border).
- **Layout**: Clean monochrome layout, zero distracting backgrounds, crisp font hierarchy, logo top right (`y = 16`), thin line separating metadata and items.

### 3. `stripe.ts` (Modern Fintech)
- **Primary / Accent**: `#635BFF` (Stripe Indigo), `#0A2540` (Navy Black), `#00D4B2` (Teal).
- **Layout**: Sleek 4mm top gradient accent bar, modern invoice badge, logo top right (`y = 22`), clean light slate table header (`#F8FAFC`), crisp currency alignment.

### 4. `amazon.ts` (High-Density Structured)
- **Primary / Accent**: `#FF9900` (Amazon Amber), `#111111` (Off-black), `#146EB4` (Amazon Blue).
- **Layout**: Signature amber line divider, logo top right (`y = 14`), boxed Bill To and Invoice Details panels, compact high-density item rows.

### 5. `microsoft.ts` (Fluent Corporate)
- **Primary / Accent**: `#0078D4` (Microsoft Blue), `#323130` (Neutral Dark), `#F3F2F1` (Surface Gray).
- **Layout**: 5mm blue header bar at `y = 20`, logo top right at `y = 28`, right-aligned type label and dates shifted below logo without collisions, light gray `#F3F2F1` Bill To card.

### 6. `google.ts` (Material Clean)
- **Primary / Accent**: `#1A73E8` (Google Blue), `#34A853` (Green), `#FBBC05` (Yellow), `#EA4335` (Red).
- **Layout**: Clean white background, Material pill badge header, signature Google 4-color micro accent strip, logo top right (`y = 18`), rounded table and total cards.

### 7. `shopify.ts` (Merchant Commerce)
- **Primary / Accent**: `#008060` (Shopify Emerald), `#202223` (Charcoal), `#F1F2F4` (Surface).
- **Layout**: Emerald brand header bar, Order Tag pill, logo top right (`y = 16`), clear payment terms and merchant highlight cards.

### 8. `custom.ts` (Dynamic Engine)
- **Primary / Accent**: Dynamically driven by `invoiceData.customColors` (Primary, Secondary, Accent, Background).
- **Layout**: Flexible corporate letterhead with full color synchronization, top-right logo, custom-tinted table headers and summary box.

---

## 4. UI Updates (`ThemeSelector.tsx` & `create/page.tsx`)

1. **`themeSchemes` Object**:
   Define exact color tokens for all 8 templates:
   - `minimal`
   - `apple`
   - `stripe`
   - `amazon`
   - `microsoft`
   - `google`
   - `shopify`
   - `custom`
2. **`ThemeSelector.tsx`**:
   - Update grid to 8 items (4 cols on desktop or 2x4 grid).
   - Display each template's primary and secondary color dots.
   - For `custom`, keep the 4 interactive color pickers visible and reactive.

---

## 5. Web Preview & PDF Generator Integration

1. **`InvoiceRenderer.tsx`**:
   - Map all 8 themes (`apple`, `minimal`, `stripe`, `amazon`, `microsoft`, `google`, `shopify`, `custom`, plus legacy aliases like `ultra-luxury`) to their respective style classes.
2. **`lib/pdf-generator.ts`**:
   - Update `generatePDF(invoiceData)` to dispatch through `lib/templates/index.ts`.
   - Maintain backward compatibility for legacy theme names (`ultra-luxury` -> `apple`, `financial` -> `stripe`).

---

## 6. Verification Plan
- `npx tsc --noEmit` to verify type safety.
- Test PDF generation across all 8 templates with logo uploads and custom color variations.
- Validate web preview dialog for all 8 templates.
