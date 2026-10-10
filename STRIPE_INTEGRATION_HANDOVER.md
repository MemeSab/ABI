# Abigail Stocks Coaching - Project Status & Handover Note

**Date:** 10 October 2026  
**Status:** Live on Production (Vercel & Domain Active)

---

## What Has Been Completed & Is Fully Active:

1. **Domain & Email Infrastructure (100% Verified)**:
   - Domain `abigailstocks.com` verified on **Resend** via 123-reg DNS (DKIM TXT + 2 CNAME records for `send` and `rsend`).
   - Emails send officially from **`Abigail Stocks <hello@abigailstocks.com>`** to all visitors worldwide with 100% deliverability.
   - Abigail is automatically BCC'd on all outbound autoresponders (`abigailstockscoaching@gmail.com` and `hello@abigailstocks.com`).

2. **Bespoke Branded Email Templates**:
   - Features the official **Abigail Stocks Coaching logo** (`assets/abigail-stocks-logo.png`).
   - Brand color palette: Warm Ivory canvas, Deep Sage (`#3F4B3C`) accents, Blush Petal (`#F7ECEB` / `#A5736C`) badges, and green deliverable checkmarks (`✓`).
   - Signature block with Abigail's circular headshot photo (`assets/abigail_actual.jpg`).

3. **Updated 3-Programme Coaching Structure**:
   - **Initial Coaching Call**: £45 (60 minutes · One-off session)
   - **6-Week Coaching Programme**: £250 Package Price (regular £270)
   - **12-Week Coaching Programme**: £495 Package Price (regular £540)
   - On-screen cards display *"Investment discussed on enquiry"* with a clean *"Email to Enquire"* button.

4. **Sleek Pop-up Modal**:
   - Clean, minimalist confirmation box directing clients to check their inbox (postbox emoji removed).

---

## 🎯 The Single Next Step When You Return:

### Connect the 3 Updated Stripe Payment Links into the Emails

Because the programme prices were updated (£45 / £250 / £495), the old Stripe payment links (£75 / £420 / £780) were detached to prevent clients from being charged the old rates.

### Steps to complete:
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/).
2. Under **Payment Links**, create 3 new links (or update existing):
   - **Link 1**: £45 (Initial Coaching Call)
   - **Link 2**: £250 (6-Week Coaching Programme)
   - **Link 3**: £495 (12-Week Coaching Programme)
3. Copy the 3 `https://buy.stripe.com/...` URLs.
4. Plug them into `api/send-email.js` (and optionally `script.js`).

Once added, the automated emails will include the direct, one-click Stripe payment buttons alongside the reply options!
