# HMRC CIS Rules, Summary

Reference for the cis-verification skill. Not tax advice. Authoritative source is HMRC's CIS340 "Construction Industry Scheme, guide for contractors and subcontractors" and the gov.uk CIS pages.

## Who Is in CIS

**Contractor**: A business that pays subcontractors for construction work, or a non-construction business that spends over 3 million GBP on construction in a rolling 12-month period ("deemed contractor").

**Subcontractor**: Any business (sole trader, partnership, or company) that does construction work for a contractor and is paid for it.

Construction work covered: site preparation, alterations, dismantling, construction, repairs, decorating, demolition. Excluded: professional services such as architects, surveyors, consultants (by discipline, with exceptions for certain composite arrangements).

## CIS Rate Decision Tree

Before making a payment, the contractor must verify the subcontractor with HMRC. HMRC returns one of three rates:

```
+--- Is the subcontractor registered for CIS?
|
+-- NO: 30% (Higher Rate)
|
+-- YES: Does the subcontractor hold Gross Payment Status?
     |
     +-- YES: 0% (Gross Payment)
     |
     +-- NO: 20% (Standard Rate)
```

HMRC can reassign rates. Always re-verify when:

- The subcontractor is new
- The subcontractor has been inactive for 2 tax years
- You have reason to suspect the subcontractor's status has changed

## Verification Process

1. Sign in to HMRC CIS online at https://www.tax.service.gov.uk/gg/sign-in
2. Go to "Verify subcontractor"
3. Enter subcontractor details: name, UTR, NI number (sole traders) or CRN (companies), partnership UTR and partner details (partnerships)
4. HMRC returns a **verification number** and a **rate** (0%, 20%, or 30%)
5. Record the verification number and date

Verification is valid while the subcontractor continues to work for you. If the subcontractor is inactive for 2 tax years, re-verify before the next payment.

## Materials Exemption

CIS deductions apply to the **labour portion only**. The following are excluded from the labour calculation:

- Materials supplied at cost (must be a reasonable amount; HMRC scrutinises inflated materials claims)
- Consumable stores used directly in the work
- Manufacturing or prefabricated materials supplied at cost
- Plant hire at cost, where hired in by the subcontractor
- VAT (where the subcontractor is VAT-registered and VAT is shown separately)
- CITB Construction Skills Levy (shown separately on the invoice)

Materials supplied on the invoice at a mark-up: only the cost portion is excluded; the mark-up forms part of labour.

CIS340 chapter 3 sets out the full exemption wording.

## CIS300 Monthly Return

- Covers all payments made to subcontractors in the tax month (6th to 5th)
- Due **by the 19th of the following month**
- Filed via HMRC CIS online
- A **nil return** may still be required where no subbie payments were made, depending on HMRC's prompt

**Payment and Deduction Statement**: The contractor must issue each subcontractor a statement within **14 days of the end of the tax month**, showing labour, materials, deduction, and rate.

**Late filing penalty**: starts at 100 GBP for being 1 day late, with increasing penalties for further lateness.

**Record keeping**: at least 3 years after the end of the tax year the records relate to. 6 years is the practical recommendation to align with Corporation Tax retention.

## Paying HMRC

CIS deductions withheld are payable to HMRC by:

- 22nd of the following month (electronic payment), or
- 19th of the following month (by cheque, rarely used)

The CIS deductions are effectively a prepayment of the subcontractor's own tax. When the subcontractor files their own tax return or CT return, they claim credit for the CIS suffered.

## Gross Payment Status

A subcontractor holding Gross Payment Status is paid without deduction. To qualify, the subcontractor must pass HMRC tests:

- **Turnover test**: minimum net construction turnover (adjusted regularly, check gov.uk)
- **Business test**: running a genuine business (bank account, records, premises as relevant)
- **Compliance test**: up-to-date on tax affairs, no recent late filings, no unpaid liabilities above de minimis

HMRC reviews gross status periodically. Subcontractors can lose gross status if compliance slips. Contractors should not assume a previously-gross subbie is still gross; verify each new payment.

## Sources

- gov.uk, "What you must do as a Construction Industry Scheme contractor": https://www.gov.uk/what-you-must-do-as-a-cis-contractor
- gov.uk, "Construction Industry Scheme: CIS 340" (definitive HMRC guide): https://www.gov.uk/government/publications/construction-industry-scheme-cis-340
- HMRC CIS online portal: https://www.tax.service.gov.uk/gg/sign-in
- CITB Levy (where applicable): https://www.citb.co.uk/levy-grants-and-funding/

## Common Pitfalls

- Treating self-employed labour-only subbies as "employees", which triggers PAYE/NIC liability. CIS is separate from employment status.
- Accepting inflated materials portions to reduce deduction; HMRC does enquire.
- Forgetting to issue the payment and deduction statement within 14 days.
- Forgetting the nil return where HMRC has prompted.
- Paying the deducted amount to HMRC late; interest and penalties accrue.
- Not re-verifying after 2 tax years of inactivity.
