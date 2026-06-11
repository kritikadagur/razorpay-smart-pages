# Razorpay Smart Pages — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-06-11  
**Owner:** Kritika Dagur, Razorpay AI  
**Status:** Active

---

## 1. Executive Summary

Razorpay Smart Pages transforms the current Razorpay Payment Pages product from a basic payment collection form into an **AI-generated, conversion-optimized landing page + checkout** — generated in under 2 minutes, requiring zero design, copywriting, or marketing skills from the merchant.

Think: **Lovable × Shopify Landing Pages × Stripe Checkout × Razorpay Payment Pages**.

---

## 2. Problem Statement

Current Razorpay Payment Pages are payment collection forms — not conversion pages.

Merchants lose revenue because:
- Pages look generic, reducing buyer trust
- No brand consistency
- No social proof, testimonials, or trust signals
- No copywriting optimization
- No urgency or benefits messaging
- Requires manual effort to look good

Competitors like Stripe, Shopify, and Gumroad have begun offering higher-quality payment experiences. Razorpay must close this gap.

---

## 3. Goals

| Goal | Metric |
|------|--------|
| Merchant generates page in < 2 min | Time to first publish |
| Page looks indistinguishable from a pro landing page | Qualitative demo rating |
| Auto-import from merchant website | % of brands correctly extracted |
| Conversion uplift vs current payment pages | A/B test vs baseline |

---

## 4. User Stories

### Merchant (Creator)
- As a merchant, I want to paste my website URL and have my brand extracted automatically
- As a merchant, I want to answer 5 plain-English questions and get a ready-to-publish page
- As a merchant, I want to switch between beautiful templates
- As a merchant, I want my payment widget embedded seamlessly in the page
- As a merchant, I want AI-written copy that sounds professional

### Buyer (Consumer)
- As a buyer, I want to land on a page that looks trustworthy and professional
- As a buyer, I want to see clear benefits and social proof before paying
- As a buyer, I want a smooth, branded checkout experience

---

## 5. Core Features (MVP)

### 5.1 Website Auto-Import (Flagship)
- Merchant pastes their website URL
- System extracts: logo, brand colors, hero images, product images, description, testimonials, FAQs, collections
- Merchant sees a pre-filled form with extracted data
- "Wow" moment: page is 80% built before merchant types anything

### 5.2 AI Page Generation
- Claude generates: headline, subheadline, benefits, features, FAQ, trust signals, testimonials, CTA copy, urgency messaging
- Output is a structured JSON schema
- Frontend renders schema into a polished page

### 5.3 Template System
- 5 templates: Minimal, Modern, Premium, Event, D2C
- Schema-driven — same JSON renders differently per template
- Template switching is instant (no re-generation needed)

### 5.4 Section Types (intelligent by page type)
| Page Type | Sections Auto-generated |
|-----------|------------------------|
| Event/Workshop | Hero, Agenda, Speakers, Schedule, Venue, FAQ, CTA |
| Product/D2C | Hero, Product Showcase, Reviews, Pricing, FAQ, CTA |
| Course | Hero, Curriculum, Instructor, Testimonials, FAQ, CTA |
| Service/Consultation | Hero, Benefits, About, Process, FAQ, CTA |
| SaaS/Subscription | Hero, Features, Pricing, Customer logos, Testimonials, CTA |

### 5.5 Razorpay Payment Widget
- Embedded payment form (existing Razorpay widget)
- Styled to match the page theme
- Positioned optimally per template

---

## 6. UX Flow

```
[Merchant lands on Smart Pages] 
    → [Paste website URL] 
        → [Auto-extract brand + content] (10-15 seconds)
            → [Review extracted data / fill gaps] (Simple form)
                → [AI generates page JSON] (5-10 seconds)
                    → [Preview page with template] 
                        → [Switch template if desired]
                            → [Publish]
                                → [Share /p/[slug] link]
```

---

## 7. Non-Goals (MVP)

- Drag-drop visual editor (deferred to v2)
- A/B testing dashboard (deferred)
- Custom domain support (deferred)
- Multi-language support (deferred)
- Analytics dashboard (deferred to v2)
- GrapesJS integration (too heavy for MVP)

---

## 8. Success Criteria

- Demo to Razorpay leadership impresses (qualitative)
- Page generated end-to-end in < 2 minutes
- At least 3 templates working
- Auto-import working for 80%+ of standard websites
- Payment widget embedded and functional

---

## 9. Technical Constraints

- Must use Razorpay's existing payment infrastructure
- Must be deployable to Vercel in < 30 minutes
- Frontend must be Next.js 15
- Must work on mobile

---

## 10. Open Questions

- Which Razorpay API endpoints to use for payment widget embedding?
- What data does Razorpay store about merchant pages today?
- Is there a merchant auth system to integrate with, or do we use our own?
