# Phase 1 Implementation Plan
## SmartInvoice Complete Template Library - Month 1

**Goal:** Build 28 core templates (7 invoice types × 4 design styles)  
**Timeline:** 4 weeks  
**Current Status:** 4/28 templates complete (Sales Invoice across 4 styles)

---

## Week 1: Invoice Type Infrastructure

### Tasks:
1. **Update InvoiceData Interface** ✅ DONE
   - Add `invoiceType` field
   - Add type-specific fields

2. **Create Invoice Type System**
   - Type definitions with metadata
   - Validation rules per type
   - Required fields per type

3. **Update UI - Invoice Type Selector**
   - Dropdown/radio for selecting invoice type
   - Show type-specific fields dynamically
   - Type descriptions/tooltips

4. **Update PDF Generator**
   - Type-aware rendering
   - Type-specific labels (e.g., "PROFORMA INVOICE")
   - Type-specific sections (e.g., validity period for proforma)

---

## Week 2: Build Remaining 6 Invoice Types

### Types to implement:

#### 1. **Proforma Invoice** ⏳ TODO
**New fields needed:**
- `validityPeriod` (string, e.g., "30 days")
- `estimatedDelivery` (date)
- `notForPaymentNote` (boolean, default true)

**Template changes:**
- Header: "PROFORMA INVOICE" (bold, larger)
- Add "NOT FOR PAYMENT" watermark
- Show validity period prominently
- Estimated delivery date

---

#### 2. **Interim Invoice** (Progress Invoice) ⏳ TODO
**New fields needed:**
- `projectName` (string)
- `projectId` (string)
- `milestoneDescription` (string)
- `percentComplete` (number, 0-100)
- `totalProjectValue` (number)
- `previouslyInvoiced` (number)
- `remainingBalance` (number)
- `workPeriod` (string, e.g., "Jan 1 - Jan 31, 2026")

**Template changes:**
- Project summary section
- Progress bar/percentage
- Previous payments table
- Remaining balance calculation

---

#### 3. **Final Invoice** ⏳ TODO
**New fields needed:**
- `projectName` (string)
- `projectId` (string)
- `projectStartDate` (date)
- `projectEndDate` (date)
- `allInterimPayments` (array of payment objects)
- `finalDeliverables` (string[])

**Template changes:**
- "FINAL INVOICE" header
- Complete project timeline
- All interim payments listed
- Final deliverables checklist
- Grand total with all payments

---

#### 4. **Recurring Invoice** ⏳ TODO
**New fields needed:**
- `subscriptionPeriod` (string, e.g., "Monthly", "Quarterly")
- `billingCycle` (string, e.g., "1st of each month")
- `nextBillingDate` (date)
- `subscriptionDetails` (string)
- `autoRenewal` (boolean)
- `cancellationPolicy` (string)

**Template changes:**
- "RECURRING INVOICE" label
- Subscription period highlighted
- Next billing date
- Cancellation instructions

---

#### 5. **Credit Note** ⏳ TODO
**New fields needed:**
- `originalInvoiceNumber` (string)
- `originalInvoiceDate` (date)
- `creditReason` (string)
- `creditItems` (array - items being credited)
- `remainingBalance` (number)

**Template changes:**
- "CREDIT NOTE" header (red or negative color)
- Original invoice reference prominent
- Reason for credit
- Negative amounts highlighted
- New balance after credit

---

#### 6. **Past Due Invoice** ⏳ TODO
**New fields needed:**
- `originalInvoiceNumber` (string)
- `originalDueDate` (date)
- `daysOverdue` (number)
- `lateFeeAmount` (number, optional)
- `lateFeePercentage` (number, optional)
- `urgentNote` (string)

**Template changes:**
- "PAST DUE" or "OVERDUE" label (red, bold)
- Days overdue prominently displayed
- Late fees section
- Urgent payment instructions
- Contact information for payment issues

---

## Week 3: Ensure All Types Work with All Styles

### Testing Matrix:

| Invoice Type | Apple Minimal | Microsoft | Amazon | Financial | Status |
|-------------|---------------|-----------|---------|-----------|---------|
| Sales | ✅ | ✅ | ✅ | ✅ | DONE |
| Proforma | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Interim | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Final | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Recurring | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Credit Note | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Past Due | ⏳ | ⏳ | ⏳ | ⏳ | TODO |

### Tasks:
1. For each invoice type, implement type-specific rendering in each style
2. Ensure type-specific fields display correctly
3. Maintain style consistency (colors, fonts, layout)
4. Test PDF generation for all 28 combinations

---

## Week 4: UI/UX Polish & AI Recommendations (Basic)

### 1. **Invoice Type Selector UI**
- Visual cards with icons for each type
- Descriptions and "Best for" recommendations
- Search/filter by industry or use case

### 2. **Type-Specific Form Fields**
- Dynamic form that shows/hides fields based on type
- Smart defaults for each type
- Validation rules per type

### 3. **Basic AI Recommendations (v1)**
Simple rule-based system:
```javascript
function recommendInvoiceType(businessInfo) {
  if (businessInfo.industry === 'Construction') return 'interim';
  if (businessInfo.industry === 'Law Firm') return 'retainer'; // (coming in Phase 2)
  if (businessInfo.billingFrequency === 'monthly') return 'recurring';
  if (businessInfo.international === true) return 'commercial'; // (coming in Phase 2)
  return 'sales'; // default
}
```

### 4. **Template Preview Gallery**
- Grid view of all 28 templates
- Quick preview modal
- Filter by type and style
- "Use this template" button

---

## Technical Implementation Details

### 1. Update `InvoiceData` Interface

```typescript
interface InvoiceData {
  // Existing fields...
  
  // New: Invoice Type
  invoiceType: 'sales' | 'proforma' | 'interim' | 'final' | 'recurring' | 'credit-note' | 'past-due';
  
  // Type-specific fields (all optional, used based on type)
  
  // Proforma specific
  validityPeriod?: string;
  estimatedDelivery?: string;
  notForPaymentNote?: boolean;
  
  // Interim/Final specific
  projectName?: string;
  projectId?: string;
  milestoneDescription?: string;
  percentComplete?: number;
  totalProjectValue?: number;
  previouslyInvoiced?: number;
  remainingBalance?: number;
  workPeriod?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  allInterimPayments?: Array<{
    invoiceNumber: string;
    date: string;
    amount: number;
  }>;
  finalDeliverables?: string[];
  
  // Recurring specific
  subscriptionPeriod?: string;
  billingCycle?: string;
  nextBillingDate?: string;
  subscriptionDetails?: string;
  autoRenewal?: boolean;
  cancellationPolicy?: string;
  
  // Credit Note specific
  originalInvoiceNumber?: string;
  originalInvoiceDate?: string;
  creditReason?: string;
  creditItems?: InvoiceItem[];
  
  // Past Due specific
  originalDueDate?: string;
  daysOverdue?: number;
  lateFeeAmount?: number;
  lateFeePercentage?: number;
  urgentNote?: string;
}
```

### 2. PDF Generator Updates

Each rendering function (Apple, Microsoft, Amazon, Financial) needs to:
1. Check `invoiceData.invoiceType`
2. Render type-specific header/labels
3. Show/hide type-specific sections
4. Apply type-specific styling (e.g., red for Past Due)

Example structure:
```typescript
private renderAppleMinimalLayout(data: InvoiceData) {
  // Common header
  this.renderHeader(data);
  
  // Type-specific header label
  this.renderTypeLabel(data.invoiceType); // "INVOICE", "PROFORMA INVOICE", etc.
  
  // Type-specific sections
  if (data.invoiceType === 'interim') {
    this.renderProjectProgress(data);
  } else if (data.invoiceType === 'credit-note') {
    this.renderCreditReason(data);
  }
  
  // Common sections
  this.renderItems(data);
  this.renderTotals(data);
  this.renderFooter(data);
}
```

### 3. UI Component Structure

```tsx
// Invoice Type Selector
<InvoiceTypeSelector 
  selected={invoiceData.invoiceType}
  onChange={(type) => setInvoiceData({...invoiceData, invoiceType: type})}
/>

// Dynamic Form Fields
{invoiceData.invoiceType === 'proforma' && (
  <ProformaFields data={invoiceData} onChange={setInvoiceData} />
)}

{invoiceData.invoiceType === 'interim' && (
  <InterimFields data={invoiceData} onChange={setInvoiceData} />
)}
```

---

## Success Criteria for Phase 1

✅ **7 invoice types implemented**  
✅ **All 4 design styles support all 7 types**  
✅ **28 working PDF templates**  
✅ **Type selector UI with descriptions**  
✅ **Dynamic form fields per type**  
✅ **Basic AI recommendation (rule-based)**  
✅ **Template preview gallery**  
✅ **All templates tested and generating correctly**

---

## Deliverables

- [ ] Updated `InvoiceData` interface with all type-specific fields
- [ ] 6 new invoice type renderers (Proforma, Interim, Final, Recurring, Credit Note, Past Due)
- [ ] Type-specific rendering logic in all 4 styles (24 new renderer variations)
- [ ] Invoice Type Selector UI component
- [ ] Dynamic form fields for each type
- [ ] Template preview gallery
- [ ] Basic AI recommendation function
- [ ] Updated documentation
- [ ] Test suite for all 28 templates

---

## Next: Phase 2 Preview (Month 2)

In Phase 2, we'll add:
- **5 new invoice types:** Commercial, Tax, Timesheet, Retainer, Expense Report
- **2 new design styles:** Professional Services, Creative Agency
- **Total:** 58 templates (7 types × 6 styles + 5 types × 6 styles)
- **Advanced AI:** Machine learning-based recommendations
- **Industry templates:** Pre-filled templates for specific industries

---

**Let's start building! 🚀**
