# Enterprise Invoice Templates - Product Requirements Document

**Version:** 1.0  
**Date:** February 1, 2026  
**Owner:** Product Team  

---

## Executive Summary

Build SmartInvoice's competitive advantage by offering **enterprise-grade invoice templates** modeled after Fortune 500 companies (Apple, Microsoft, Amazon, BlackRock) - completely free for all users.

### The Problem
**Your current invoice looks amateur.**
- Basic table layout that screams "cheap tool"
- No visual hierarchy or branding
- Clients receiving these invoices question your professionalism
- Competitors charge $39-99/month for similar quality templates

### The Solution
**Give everyone access to billion-dollar invoice designs.**
- Clean, minimal, corporate templates based on real invoices from Apple, Microsoft, Amazon, BlackRock
- Professional typography and spacing that commands respect
- Zero learning curve - just select and use
- 100% free for all users (including Free tier)

### Success Metrics
- 90% of users switch from current template within first week
- 60% increase in "professional appearance" satisfaction scores
- 40% reduction in "design/template" support tickets
- 50% increase in social shares ("Look how professional my invoices look!")

---

## Design Philosophy

### Core Principles

**1. Minimalism Over Decoration**
- Clean layouts with generous whitespace
- Limited color palette (mostly grayscale + 1 brand color)
- Professional typography only (no fancy fonts)
- Zero decorative elements (no borders, shadows, gradients)

**2. Information Hierarchy**
- Company name dominates (largest element)
- Invoice number and dates clearly visible
- Line items easy to scan
- Total amount unmissable

**3. Print-First Design**
- Optimized for A4 and US Letter
- Black & white printing looks perfect
- Clear readable fonts at standard print sizes
- Proper margins for standard printers

**4. Universal Acceptance**
- Works for any industry (tech, finance, consulting, retail)
- Suitable for $100 or $100,000 invoices
- Professional enough for Fortune 500 clients
- Simple enough for small businesses

---

## Template Specifications

## Template 1: Apple Minimal

**Visual Identity:**
- Ultra-clean with maximum whitespace
- San Francisco font (system font fallback for web)
- Thin line separators only
- No background colors or boxes

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                              │
│  COMPANY NAME (huge, thin weight)           │
│  Address                                     │
│  City, State                                 │
│                                              │
│  Invoice                                     │
│  INV-123456                                  │
│                                              │
│  ──────────────────────────────────────     │
│                                              │
│  Bill To          Invoice Date               │
│  Client Name      Feb 01, 2026              │
│  Address          Due: Mar 03, 2026         │
│                                              │
│  ──────────────────────────────────────     │
│                                              │
│  Description     Qty    Rate     Amount     │
│  ───────────────────────────────────────    │
│  Item 1           1    $100.00   $100.00    │
│  Item 2          10     $10.00   $100.00    │
│                                              │
│                        Subtotal   $200.00    │
│                        Total      $200.00    │
│                                              │
│  ──────────────────────────────────────     │
│                                              │
│  email@company.com                          │
│                                              │
└─────────────────────────────────────────────┘
```

**Typography:**
- Company Name: 48pt, Light weight
- Headers: 10pt, uppercase, gray
- Body: 11pt, Regular weight
- Total: 24pt, Medium weight

**Colors:**
- Text: #1D1D1F (near black)
- Secondary: #86868B (gray)
- Lines: #D2D2D7 (light gray)
- Accent: None (monochrome only)

**Spacing:**
- Page margins: 60px all sides
- Section spacing: 40px
- Line height: 1.5

---

## Template 2: Microsoft Corporate

**Visual Identity:**
- Structured and organized
- Blue accent bar (Microsoft blue: #0078D4)
- Segoe UI font (Verdana fallback)
- Section backgrounds for emphasis

**Layout:**
```
┌─────────────────────────────────────────────┐
│ █████████████████████████████████████████   │ Blue bar
│                                              │
│  COMPANY NAME                    INVOICE     │
│  Address                         INV-123456  │
│  City, State                                 │
│  Email                           Date: ...   │
│                                  Due: ...    │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ Bill To                              │   │
│  │ Client Name                          │   │
│  │ Address                              │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │Description  Qty  Unit Price  Amount  │   │
│  ├──────────────────────────────────────┤   │
│  │ Item 1       1    $100.00   $100.00  │   │
│  │ Item 2      10     $10.00   $100.00  │   │
│  └──────────────────────────────────────┘   │
│                                              │
│                    Subtotal:      $200.00    │
│                    ══════════               │
│                    Total Due:     $200.00    │
│                                              │
│  ─────────────────────────────────────      │
│  Payment Terms: Net 30 days                 │
│                                              │
└─────────────────────────────────────────────┘
```

**Typography:**
- Company Name: 36pt, Semibold
- Section Headers: 9pt, Bold, uppercase
- Body: 10pt, Regular
- Total: 24pt, Semibold

**Colors:**
- Blue accent: #0078D4 (Microsoft blue)
- Text: #323130 (dark gray)
- Headers: #605E5C (medium gray)
- Backgrounds: #F3F2F1 (light gray)

**Key Features:**
- Blue top bar (1px height)
- Gray box for "Bill To" section
- Bordered table for line items
- Blue underline for total

---

## Template 3: Amazon Efficient

**Visual Identity:**
- Dense, data-focused layout
- Orange accent (#FF9900)
- Arial font (web-safe)
- Bordered sections for clarity

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                              │
│  COMPANY NAME ══════════════ Invoice Number │
│  Address, City                   INV-123456 │
│  Email                                       │
│                                              │
│  ┌─────────────────┬─────────────────────┐  │
│  │ Bill To:        │ Invoice Details:    │  │
│  │ Client Name     │ Date: Feb 01, 2026  │  │
│  │ Address         │ Due:  Mar 03, 2026  │  │
│  └─────────────────┴─────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ DESCRIPTION  QTY  RATE     AMOUNT    │   │
│  ├──────────────────────────────────────┤   │
│  │ Item 1        1   $100.00  $100.00   │   │
│  │ Item 2       10    $10.00  $100.00   │   │
│  └──────────────────────────────────────┘   │
│                                              │
│              ┌──────────────────┐            │
│              │ Subtotal $200.00 │            │
│              │ ════════════════ │            │
│              │ Total    $200.00 │            │
│              └──────────────────┘            │
│                                              │
│  Payment Instructions: Net 30 days          │
│  Questions: email@company.com               │
│                                              │
└─────────────────────────────────────────────┘
```

**Typography:**
- Company Name: 32pt, Bold
- Section Headers: 9pt, Bold, uppercase
- Body: 10pt, Regular
- Total: 20pt, Bold

**Colors:**
- Orange accent: #FF9900 (Amazon orange)
- Text: #111111 (black)
- Borders: #DDD (light gray)
- Backgrounds: #F5F5F5 (very light gray)

**Key Features:**
- Orange separator line under header
- Bordered boxes for all sections
- Dense, efficient layout
- Bold totals in box

---

## Template 4: Financial/Corporate (BlackRock, Goldman Sachs, McKinsey)

**Visual Identity:**
- Ultra-formal, traditional
- Black borders and headers
- Serif fonts (Times New Roman)
- Centered header

**Layout:**
```
┌═════════════════════════════════════════════┐
║                                             ║
║            COMPANY NAME                     ║
║        Address • City, State                ║
║                                             ║
║ ─────────────────────────────────────────   ║
║                                             ║
║              INVOICE                        ║
║            INV-123456                       ║
║                                             ║
║  Billed To:          Invoice Information:  ║
║  Client Name         Date: Feb 01, 2026    ║
║  Address             Due:  Mar 03, 2026    ║
║                                             ║
║ ┌─────────────────────────────────────┐    ║
║ │ Description    Qty  Rate    Amount  │    ║
║ ├─────────────────────────────────────┤    ║
║ │ Item 1          1   $100.00 $100.00 │    ║
║ │ Item 2         10    $10.00 $100.00 │    ║
║ └─────────────────────────────────────┘    ║
║                                             ║
║                  ┌─────────────────┐        ║
║                  │ Subtotal $200.00│        ║
║                  ├─────────────────┤        ║
║                  │ TOTAL    $200.00│        ║
║                  └─────────────────┘        ║
║                                             ║
║ ═════════════════════════════════════════   ║
║ PAYMENT TERMS: Net 30 days                 ║
║ REMITTANCE: Reference invoice number       ║
║                                             ║
└═════════════════════════════════════════════┘
```

**Typography:**
- Company Name: 42pt, Bold, centered
- "INVOICE": 24pt, Bold, centered
- Section Headers: 9pt, Bold, uppercase
- Body: 11pt, Regular
- Total: 24pt, Bold

**Colors:**
- All black and white
- Heavy borders: #000000 (black)
- Text: #1A1A1A (near black)
- Table header background: #000000 with white text

**Key Features:**
- Double border around entire invoice
- Centered formal header
- Traditional serif typography
- Black table headers
- All-caps emphasis on key terms

---

## Implementation Requirements

### Technical Stack

**Frontend:**
- React components for each template
- Tailwind CSS for styling
- Print CSS media queries
- PDF generation: react-pdf or Puppeteer

**Backend:**
- Template storage: JSON configuration
- User preferences: PostgreSQL
- PDF generation service: Separate microservice
- Template versioning: Git-based

### Performance Targets
- Template switch: < 100ms
- PDF generation: < 2 seconds
- Template preview: < 50ms
- Print preview: Instant

### Browser Support
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Android)

---

## User Experience

### Template Selection Flow

**First-Time Users:**
1. User creates account, starts first invoice
2. System shows: "Choose your invoice style"
3. Display 4 templates side-by-side with real preview
4. User clicks template → Applied instantly
5. Saved as default for future invoices

**Returning Users:**
1. Click "New Invoice" → Uses saved default template
2. Can change template anytime via dropdown in invoice editor
3. "Switch Template" button always visible in toolbar

### Customization Options

**What Users CAN Customize:**
- Company name, address, contact info
- Logo upload (auto-positioned based on template)
- Primary color (only for templates with accents)
- Line items and amounts
- Payment terms text

**What Users CANNOT Customize:**
- Layout structure (maintains template integrity)
- Fonts (ensures professional consistency)
- Spacing and margins (optimized for print)
- Template-specific design elements

### Print Optimization

**Print Settings:**
- Auto-detect paper size (A4 vs US Letter)
- Margins: 0.5" all sides
- Page break handling for multi-page invoices
- Footer on every page (page X of Y)

**Print Preview:**
- Live preview in browser
- "Print" button generates PDF preview
- Option to download PDF before printing
- Ensure black & white printing looks professional

---

## Free vs Paid Features

### Free Tier (100% Access to Templates)
✅ All 4 enterprise templates
✅ Template switching unlimited
✅ Company logo upload
✅ PDF export
✅ Print optimization
✅ Basic color customization

### Pro Tier ($299/month)
✅ Everything in Free
✅ Remove "Powered by SmartInvoice" footer
✅ Advanced color customization (any color)
✅ Custom fonts (upload your own)
✅ White-label templates
✅ Priority PDF rendering

### Business Tier ($999/month)
✅ Everything in Pro
✅ Custom template design service (1 per year)
✅ Team template library
✅ Enforce team template standards
✅ API access for template generation

---

## Development Roadmap

### Phase 1: Core Templates (Weeks 1-2)
**Goal:** Launch with 4 production-ready templates

**Tasks:**
- [ ] Build React components for all 4 templates
- [ ] Implement template switching system
- [ ] Create template preview system
- [ ] Add PDF export functionality
- [ ] Cross-browser testing

**Deliverables:**
- 4 templates (Apple, Microsoft, Amazon, Corporate)
- Template selector UI
- PDF export working

### Phase 2: Customization (Weeks 3-4)
**Goal:** Enable logo and basic customization

**Tasks:**
- [ ] Logo upload and positioning
- [ ] Color picker for accent colors
- [ ] Payment terms editor
- [ ] Template defaults/favorites system
- [ ] Mobile responsive design

**Deliverables:**
- Logo integration
- Color customization
- Mobile-optimized templates

### Phase 3: Polish & Launch (Week 5)
**Goal:** Production release

**Tasks:**
- [ ] Print optimization for all templates
- [ ] Performance optimization
- [ ] A/B test template names/descriptions
- [ ] User onboarding flow
- [ ] Marketing materials (screenshots, demos)

**Deliverables:**
- Production-ready system
- User documentation
- Marketing launch

### Phase 4: Advanced Features (Weeks 6-8)
**Goal:** Pro/Business tier features

**Tasks:**
- [ ] White-label templates
- [ ] Custom template designer
- [ ] Team template library
- [ ] Analytics (which templates are most popular)

**Deliverables:**
- Pro tier features live
- Analytics dashboard

---

## Success Criteria

### Pre-Launch Checklist
- [ ] All 4 templates render perfectly in Chrome, Safari, Firefox
- [ ] PDF export matches screen preview 100%
- [ ] Print preview looks professional on A4 and US Letter
- [ ] Mobile preview works on iOS and Android
- [ ] Template switching is instant (<100ms)
- [ ] Logo upload works for PNG, JPG, SVG
- [ ] Black & white printing looks good for all templates

### Post-Launch (30 Days)
- [ ] 80% of users switch from default template
- [ ] Template satisfaction score >4.5/5
- [ ] <2% support tickets about templates
- [ ] 50%+ users share invoice screenshots on social
- [ ] 30% conversion from Free to Pro for white-label

### Quality Metrics
- PDF generation: <2 seconds, 99.5% success rate
- Template switching: <100ms, zero errors
- Print quality: 100% match to preview
- Mobile responsiveness: Perfect on all devices
- Accessibility: WCAG AA compliance

---

## Competitive Analysis

| Feature | SmartInvoice | Bonsai | FreshBooks | Wave | QuickBooks |
|---------|-------------|--------|------------|------|------------|
| **Template Quality** | Fortune 500 grade | Good | Basic | Basic | Dated |
| **Template Count** | 4 (all premium) | 8 (1 good) | 6 (basic) | 3 | 5 |
| **Free Access** | ✅ All templates | ❌ $39/mo | ❌ $30/mo | ✅ Limited | ❌ $50/mo |
| **Print Quality** | Perfect | Good | Fair | Poor | Good |
| **Mobile Support** | ✅ Full | Partial | ✅ Full | ❌ None | Partial |
| **Customization** | Logo + Colors | Full | Limited | None | Limited |

**Key Advantages:**
1. **Quality over Quantity**: 4 perfect templates > 20 mediocre ones
2. **100% Free Access**: Competitors charge $30-50/month for similar quality
3. **Real Enterprise Designs**: Based on actual Fortune 500 invoices
4. **Print-First**: Perfect for professional printing, not just screen

---

## Marketing Strategy

### Positioning
**"Professional invoices used by Apple, Microsoft, Amazon - now free for everyone"**

### Key Messages
- "Invoice like a Fortune 500 company"
- "Your invoices command respect"
- "Professional templates, zero design skills needed"
- "What the big companies use, free for you"

### Launch Campaign

**Week 1: Teaser**
- Social media: "Coming soon: Invoice templates from the world's most valuable companies"
- Email existing users: "Big announcement next week"

**Week 2: Launch**
- Blog post: "How We Reverse-Engineered Apple's Invoice Design (And Made It Free)"
- Product Hunt launch
- Email blast: "New: Enterprise invoice templates"
- Social: Before/After comparisons

**Week 3-4: Social Proof**
- User testimonials: "My clients take me more seriously now"
- Share invoice screenshots (with permission)
- Case study: "How better invoices led to 40% faster payments"

### Viral Mechanics
- "Share your invoice" button → Auto-posts to social with link to SmartInvoice
- Referral program: "Get Pro free for 1 month for every 3 referrals"
- Template of the month contest

---

## Risk Mitigation

### Technical Risks

**Risk:** PDF doesn't match screen preview
- **Mitigation:** Use headless Chrome for PDF generation (guarantees match)
- **Fallback:** Server-side rendering with identical CSS

**Risk:** Templates don't print well
- **Mitigation:** Extensive print testing on multiple printers
- **Fallback:** Print-specific CSS with fallback fonts

**Risk:** Logo upload breaks layout
- **Mitigation:** Auto-resize and position logos, max file size 2MB
- **Fallback:** Crop and resize server-side

### Business Risks

**Risk:** Users overwhelmed by "only" 4 templates
- **Mitigation:** Emphasize quality over quantity, show comparisons
- **Messaging:** "4 perfect templates > 20 mediocre ones"

**Risk:** Free tier cannibalization of paid tiers
- **Mitigation:** Keep white-label and custom fonts in Pro/Business
- **Data:** 80% of users never customize beyond logo anyway

### Legal Risks

**Risk:** Copyright claims from Apple/Microsoft
- **Mitigation:** These are style inspirations, not copies. Common design patterns.
- **Legal review:** Clear all templates with legal team before launch

---

## Metrics Dashboard

### Track Daily:
- Template usage by type (which is most popular?)
- Template switches (are users exploring?)
- PDF exports per template
- Logo upload success rate

### Track Weekly:
- User satisfaction scores by template
- Support tickets related to templates
- Print quality feedback
- Mobile usage patterns

### Track Monthly:
- Conversion from Free to Pro (attributed to templates)
- Social shares of invoices
- NPS score specifically for templates
- Template feature requests

---

## Conclusion

By offering **enterprise-grade invoice templates for free**, SmartInvoice will:

1. **Differentiate** in a crowded market (no competitor offers this quality free)
2. **Drive growth** through viral sharing of professional invoices
3. **Build trust** by associating with Fortune 500 quality
4. **Increase conversions** as users want advanced features like white-label

**The Bold Promise:**
*"Every user, regardless of tier, gets invoices that look like they came from Apple, Microsoft, or Amazon."*

This isn't just a feature - it's SmartInvoice's new positioning:
**"The only invoicing tool that makes everyone look like a Fortune 500 company."**

---

**Next Steps:**
1. Design team creates high-fidelity mockups of all 4 templates
2. Engineering builds template system
3. User research validates templates with 50 beta users
4. Marketing prepares launch campaign
5. Ship to production

---

*For questions: product@smartinvoice.com*
