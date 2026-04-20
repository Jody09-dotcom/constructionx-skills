---
name: cis-verification
description: Walk a UK contractor through Construction Industry Scheme (CIS) subcontractor verification and calculate the correct deduction. Use when the user asks about "CIS", "CIS verification", "subcontractor deduction", "CIS rate", or is paying a subbie and needs to work out tax. Covers HMRC verification steps, 0/20/30% rate logic, materials exemption, CIS300 monthly return reminder.
---

# CIS Verification

This skill walks a UK main contractor through the Construction Industry Scheme (CIS) subcontractor verification process and calculates the correct CIS deduction from a payment. Not tax advice. Verify all rates and deductions with a qualified accountant before making payments.

The skill generates the text the user pastes into the HMRC CIS online portal. It does NOT call HMRC APIs and does NOT submit anything on the user's behalf.

## When to Use

- Onboarding a new subbie before first payment
- Pre-payment check on an existing subbie (verification expires after 2 tax years of inactivity)
- Working out the deduction on an invoice that includes labour and materials
- Preparing the monthly CIS300 return
- Explaining CIS to a subbie or subcontractor firm

## Workflow

**Phase 1, gather inputs.**

Ask the user for the following:

- Subcontractor legal name (company name or sole trader name)
- Trading name if different
- Unique Taxpayer Reference (UTR), 10 digits
- For sole traders: National Insurance number (NI)
- For companies: company registration number (CRN)
- For partnerships: partnership UTR plus any partner names/UTRs
- Payment amount on the invoice (gross, inclusive of VAT if applicable)
- Materials portion of the invoice (direct cost of materials supplied)
- VAT amount on the invoice (if VAT-registered subbie)
- CITB levy (if shown separately)

**Phase 2, guide through HMRC online verification.**

Produce a short paste-ready text block the user copies into the HMRC CIS online portal (https://www.tax.service.gov.uk/gg/sign-in?continue=/construction-industry-scheme-online). Include:

- Subbie name
- UTR
- NI or CRN (as applicable)

Instruct the user that HMRC will return a verification number and a rate (0%, 20%, or 30%). The user enters the verification number back into the skill to continue.

**Phase 3, apply rate logic.**

Refer to `references/hmrc-cis-rules.md` for the rate decision tree.

- **0% (Gross Payment Status)**: Subbie holds Gross Payment Status with HMRC. No deduction. Still verify; HMRC may return a different rate than expected if the subbie's status has changed.
- **20% (Standard Rate)**: Subbie is verified and registered for CIS. Deduct 20% from the labour portion.
- **30% (Higher Rate)**: Subbie is not verified, or not registered for CIS, or HMRC cannot confirm the details. Deduct 30% from the labour portion.

**Phase 4, calculate the deduction.**

CIS deduction applies to the **labour portion only**. Exclude:

- Materials supplied directly by the subbie (at cost, must be reasonable)
- VAT
- CITB levy (where shown separately on the invoice)

Formula: `Labour = Invoice gross - VAT - Materials - CITB levy. Deduction = Labour x Rate.`

Produce a worked example in the output.

**Phase 5, CIS300 reminder.**

Remind the user that:

- CIS300 monthly return is due by the **19th of the following month**
- The return covers all payments made in the tax month (6th to 5th)
- Even if no subbies were paid in the month, a nil return may still be required
- Records must be kept for **at least 3 years after the end of the tax year they relate to** (many firms keep 6 years to align with Corporation Tax)
- Penalty regime: automatic penalties for late or inaccurate returns

## Output Template

```markdown
# CIS Verification and Deduction

**Date:** {YYYY-MM-DD}
**Contractor:** {your firm}
**Subcontractor:** {subbie name}

## Subcontractor Details

| Field | Value |
|-------|-------|
| Legal name | {name} |
| Trading name | {if different, else same} |
| UTR | {10 digits} |
| NI / CRN | {value} |
| Verification number | {from HMRC portal} |
| Rate applied | {0% / 20% / 30%} |
| Verification date | {YYYY-MM-DD} |
| Verification expires | {2 tax years from last payment, date} |

## Deduction Calculation

| Line | Amount (GBP) |
|------|--------------|
| Invoice gross (inc VAT) | {x} |
| Less VAT | ({x}) |
| Less Materials (at cost) | ({x}) |
| Less CITB levy (if applicable) | ({x}) |
| **Labour subject to CIS** | **{x}** |
| CIS rate | {0% / 20% / 30%} |
| **CIS deduction** | **{x}** |
| **Net payment to subbie** | **{x}** |

## Worked Example

Subbie invoice: 2,400 gross, including 400 VAT and 500 materials.

- Invoice gross: 2,400
- Less VAT 400: 2,000
- Less materials 500: 1,500
- Labour subject to CIS: **1,500**
- Rate (standard): **20%**
- CIS deduction: **300**
- Net payment to subbie: 2,400 - 300 = **2,100**
- Subbie receives a CIS payment and deduction statement for the 300 withheld

## Reminders

- CIS300 monthly return due by the **19th of the following month** for payments made 6th to 5th of the current tax month.
- Issue the subcontractor a **payment and deduction statement** within 14 days of the end of the tax month.
- Keep records for at least 3 years after the end of the tax year, practical recommendation 6 years.
- Re-verify if the subbie has been inactive for 2 tax years.
- A subbie with Gross Payment Status can be moved to 20% or 30% without warning if HMRC changes their status. Always verify current rate before each payment.
```

## References

- `references/hmrc-cis-rules.md`, rate decision tree, materials exemption wording, CIS300 deadline, HMRC pointers

## Disclaimer

This is not tax advice. Verify all rates and deductions with a qualified accountant. HMRC rules can change; official guidance is at https://www.gov.uk/what-you-must-do-as-a-cis-contractor and https://www.gov.uk/government/publications/construction-industry-scheme-cis-340. The skill does not submit returns or statements to HMRC. The contractor is legally responsible for correct verification, correct deduction, CIS300 filing, and payment of the withheld amount to HMRC.
