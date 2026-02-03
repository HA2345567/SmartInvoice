# SmartInvoice AI Features Implementation Plan

Based on the Product Requirements Document (Version 1.0), here is the roadmap for implementing the 4 key AI features with an "Ultra Luxury" aesthetic.

## 🎨 Design Philosophy: "Quiet Luxury"
- **Glassmorphism:** Heavy use of backdrop-blur, semi-transparent borders (green/gold hints), and noise textures.
- **Motion:** Smooth, physics-based transitions (framer-motion).
- **Typography:** Inter/Geist Mono for technical data, crisp headers.
- **Lighting:** Green/Emerald glows (`green-500/20`) to match existing branding but elevated.

---

## 🚀 Phase 1: Conversational Invoice Assistant (Chatbot)
**Goal:** A simplified, floating natural language interface for mobile & desktop.
**Why First?** It provides a persistent "AI" presence across the entire app immediately.

- [ ] **UI Component:** `AiChatbot` floating action button (FAB) that expands into a glassmorphic panel.
- [ ] **Animations:** "Breathing" glow effect when idle. Typing indicators.
- [ ] **Tech:**
  - Floating panel with `AnimatePresence`.
  - Integration with `AIAgentService` (mocked initially, then connected to API).
  - Quick actions (Create Invoice, Check Status).

## ⚡ Phase 2: AI Invoice Assistant (Auto-Complete)
**Goal:** Reduce invoice creation time by 80%.

- [ ] **Smart Client Input:** Enhanced `Combobox` with fuzzy search and "confidence" badges.
- [ ] **Line Item Suggestions:** "Magic" button next to line items that auto-fills based on selected client.
- [ ] **Description Enhancer:** A "Sparkle" button in text areas to rewrite text (Formal/Friendly tones).

## 🔮 Phase 3: Smart Payment Predictor
**Goal:** Cash flow visibility.

- [ ] **Dashboard Widget:** "Cash Flow Forecast" graph using `recharts` with a confidence interval area.
- [ ] **Invoice List Columns:** Add "Predicted Payment Date" column with color-coded risk indicators (Green/Yellow/Red dots).

## 🧾 Phase 4: AI Expense Categorization
**Goal:** Automated bookkeeping.

- [ ] **Dropzone UI:** "Luxury" file upload area with scanning animations.
- [ ] **Review Interface:** Card-based review flow where users confirm AI suggestions with a single swipe/click.

---

## Immediate Next Steps
1.  Scaffold the **AI Chatbot** component in `components/ai/`.
2.  Integrate it into the Dashboard Layout.
3.  Style it to match the "Green/Black/Glass" luxury theme.
