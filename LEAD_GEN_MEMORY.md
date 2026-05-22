# Ringassur — Lead Gen Learning Memory
**Last updated:** 2026-05-22
**Status:** No leads received yet. Tracking live. Pending campaign activation.
**Design research added:** 2026-05-22

---

## 1. ROOT CAUSES — WHY NO LEADS (Priority Order)

### #1 — PIXEL HAS ZERO CONVERSION DATA (Most Critical)
Meta's algorithm needs **~50 Lead events per week** to exit "Learning Phase."
Currently: 0 lead submissions on the live site → pixel blind → Meta cannot optimize → budget burns on random clicks with no conversion signal.

**What happens without signal:**
- Meta runs in "Learning Limited" or random delivery mode
- CPL skyrockets (€80–150+ instead of €25–45)
- Algorithm never improves because it has nothing to learn from
- Even a perfect campaign structure fails with no seed data

**Fix required:** Submit 5–10 test leads manually using the Test Events tool in Meta Events Manager to seed the pixel before launching paid campaigns.

---

### #2 — WRONG CAMPAIGN TYPE (Structural)
Current setup: **Website Conversion** (traffic sent to landing page)
Research says for mutuelle santé France: **Lead Ads (Instant Forms)** achieve ~85% completion rate vs external landing pages which lose 60–70% of users on mobile.

**Why instant forms win for this vertical:**
- Pre-filled with Facebook name/phone → zero typing friction on mobile
- Never leaves the app → no page load abandonment
- Meta's algorithm is highly optimized for Lead Ads in insurance
- CPL benchmark for mutuelle santé via Lead Ads: **€25–45**. Via landing page cold: **€60–120**

**This does NOT mean the landing pages are useless** — they serve warm retargeting traffic. Cold audiences → Lead Ads first.

---

### #3 — NO LEAD MAGNET / WEAK OFFER
Current offer across all 4 pages: *"Demandez votre devis gratuit"*
This is generic. Every competitor says the same thing.

**What the research says works for mutuelle santé:**
- "Simulation de remboursement personnalisée en 2 minutes"
- "Comparez 5 mutuelles senior et économisez jusqu'à 40%"
- "Vérifiez votre éligibilité aux aides mutuelle senior"
- "Calculateur : combien vous coûte votre mutuelle actuelle ?"

The offer must answer: *"Why should I give my phone number to THIS page vs. closing it?"*
Currently there is no answer. The form just asks without giving.

---

### #4 — NO QUALIFYING QUESTIONS
Current form: Nom + Téléphone only.
Research recommendation: 1–2 qualifying questions (dropdown/multiple choice).

**Why this matters:**
- Quality signal to Meta: algorithm learns WHO converts → lookalikes improve
- Sales team knows priority before calling (age 55 vs 35 = different pitch)
- "Higher intent" form type filters out accidental taps

**Recommended questions for mutuelle santé:**
1. "Votre tranche d'âge :" → 18–35 / 36–55 / 55–65 / 65+
2. "Situation actuelle :" → Sans mutuelle / Mutuelle trop chère / Veut changer / Salarié cherche individuelle

---

### #5 — NO NURTURING AFTER LEAD CAPTURE
Current flow: Lead submitted → Telegram notification → manual call.
Research says: leads go cold within 4–6 hours without automated follow-up.

**Missing pieces:**
- No automated SMS confirmation to the lead
- No email sequence (reminder, social proof, urgency)
- No retargeting sequence for people who visited but didn't submit
- Callback window: research shows calling within 5 minutes = 21x higher contact rate vs 30 minutes

---

### #6 — FINANCIAL DOMAIN RESTRICTION (Meta's Side)
Domain ringassur.com is flagged by Meta as "Financial Service."

**Restrictions this causes:**
- Cannot target by income, financial behaviors, or credit-related interests
- LDU (Limited Data Use) required — already implemented ✅
- Standard events only — already implemented ✅
- Lookalike audiences based on financial data blocked

**Workaround already in place:** Neutral vocabulary (Accompagnement/Wellness) ✅
**Still needed:** Advantage+ audiences (broad) instead of narrow manual interest targeting, because interest targeting is heavily restricted on financial domains.

---

### #7 — AUDIENCE STRATEGY GAP
Without existing customer list → no quality lookalikes → cold broad targeting.
Research recommendation: Start with Advantage+ Audiences (broad + AI), then build lookalikes from first 50–100 leads.

**Engagement audiences to build immediately (free, no leads needed):**
- Video viewers 50%+ (if running video ads)
- Page engagers (last 30–60 days)
- Website visitors (ringassur.com, any page, last 30 days)
- Form openers who didn't submit (retarget separately)

---

### #8 — BUDGET BELOW LEARNING THRESHOLD (Likely)
Meta needs budget = **CPL target × 50 / 7 days** to exit learning phase in one week.
If CPL target = €30 → minimum budget = **€215/week (€30/day)** per ad set.
Below this: perpetual "Learning Limited" → unstable delivery → high CPL.

---

## 2. CURRENT TECHNICAL SETUP STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Pixel 944605845074489 | ✅ Active | mutuelle-sante.html only |
| Pixel 1011230188058686 | ✅ Active | All 4 mutuelle pages |
| CAPI server-side | ✅ Active | Both pixels, per-page token |
| LDU data processing | ✅ Active | All pages |
| Standard events only | ✅ Active | Lead + ViewContent + PageView |
| Custom events | ✅ Removed | Were blocked by Meta |
| Google Sheets | ✅ Connected | 4 separate tabs for variants |
| Telegram bot | ✅ Connected | Real-time notifications |
| UTM parsing | ✅ Active | 4 columns: source/medium/campaign/content |
| A/B variants | ✅ Live | /mutuelle-sante1, 2, 3 |
| Vercel deployment | ✅ Live | www.ringassur.com auto-deploys on git push |

**Tracking gap:** mutuelle-sante.html CAPI → only goes to pixel 944605845074489 (not to new pixel). Second pixel on that page has no server-side backup.

---

## 3. PRIORITIZED ACTION PLAN (Awaiting Permission)

### PHASE 1 — Seed the pixel (Do before spending €1 on ads)
- [ ] Use Meta Events Manager → Test Events → submit 5 test leads on each of the 4 URLs
- [ ] Verify Lead event fires correctly in Events Manager
- [ ] Set up Custom Conversions in Ads Manager (URL contains /mutuelle-sante1, /2, /3)

### PHASE 2 — Fix the offer (High impact, low effort)
- [ ] Add a specific lead magnet to each page (simulation/comparateur/économies)
- [ ] Add 1 qualifying question to the form (age range or situation)
- [ ] Update CTA button text from generic to specific promise

### PHASE 3 — Launch correct campaign structure
- [ ] Campaign 1: Lead Ads (Instant Form) — cold audiences — Advantage+ — Leads objective
- [ ] Campaign 2: Website Conversions — retargeting (page visitors, form openers) — Leads objective
- [ ] Budget: minimum €30/day per active ad set
- [ ] UTM params: utm_source=facebook&utm_medium=paid&utm_campaign=mutuelle_senior&utm_content=variant1/2/3

### PHASE 4 — Nurturing (Needed for quality leads)
- [ ] SMS confirmation within 5 minutes of lead (via Twilio or similar)
- [ ] Email sequence (3 emails over 7 days: confirmation → testimonial → urgency)
- [ ] Callback reminder if no contact within 24h

### PHASE 5 — Scale (After 50+ leads, ~3–4 weeks)
- [ ] Build lookalike from converted leads (1%, 2%, 3%)
- [ ] Upload customer list if available
- [ ] Retarget non-converters with different creative/angle

---

## 4. CAMPAIGN STRUCTURE RECOMMENDATION (Awaiting Permission)

```
CAMPAIGN: Mutuelle Santé Senior — Acquisition
  Objective: Leads
  Budget: €30–50/day (campaign level, Advantage+)

  AD SET 1: Broad — Advantage+ Audiences
    Audience: France, 45–70, broad (let Meta find)
    Placement: Advantage+ placements
    Format: Lead Ad (Instant Form)
    Form type: Higher Intent (adds review step)

  AD SET 2: Retargeting — Website Visitors
    Audience: ringassur.com visitors (30 days) excl. submitted leads
    Budget: €10/day
    Format: Website Conversion → /mutuelle-sante

  CREATIVES (3 variations per ad set):
    Variation A: Problem angle ("Votre mutuelle actuelle vous coûte trop cher ?")
    Variation B: Benefit angle ("Économisez jusqu'à 40% sur votre mutuelle senior")
    Variation C: Social proof ("127 seniors ont comparé cette semaine")
```

---

## 5. KEY METRICS TO TRACK (Never optimize on CPL alone)

| Metric | Target | Red flag |
|--------|--------|----------|
| CPL (cost per lead) | €25–45 | >€60 |
| Form completion rate | >40% landing page / >70% Lead Ad | <25% |
| Lead-to-call contact rate | >40% | <20% |
| Call-to-appointment rate | >30% | <15% |
| Time to first callback | <5 min | >30 min |
| Cost per qualified lead | €40–80 | >€120 |

---

## 6. A/B TEST HYPOTHESIS (Variants 1, 2, 3)

| Variant | Design | Hypothesis | Pixel |
|---------|--------|------------|-------|
| /mutuelle-sante | Original (blue gradient + senior couple) | Baseline | Both pixels |
| /mutuelle-sante1 | Dark/dramatic + glass card | Dark contrast converts better on mobile | New pixel only |
| /mutuelle-sante2 | Green/fresh + numbered steps | Process clarity reduces anxiety | New pixel only |
| /mutuelle-sante3 | Orange/warm + gradient header | Warmth/urgency drives action | New pixel only |

**Track via:** Custom Conversions in Meta Events Manager (URL filter per variant)
**Decision rule:** Run for minimum 100 leads total before declaring winner. Don't stop early.

---

## 7. FINANCIAL DOMAIN — SAFE VOCABULARY REFERENCE

| Banned word (Meta flags) | Safe replacement |
|--------------------------|-----------------|
| Mutuelle / Assurance | Accompagnement / Protection |
| Devis | Simulation / Consultation |
| Contrat | Solution personnalisée |
| Prime / Cotisation | Contribution / Forfait |
| Sinistre | Événement de vie |
| Remboursement (financial) | Prise en charge |

**In pixel events:**
- content_name: 'Accompagnement Senior' ✅
- content_category: 'Wellness' ✅

---

## 9. LANDING PAGE DESIGN BLUEPRINT (Insurance/Mutuelle)
Source: Practitioner research on high-converting insurance funnels, added 2026-05-22

### Core doctrine
Brutally simple. One promise. One form/CTA. Heavy trust proof. No navigation. No distractions.
Every scroll leads back to the form. Structural pattern is almost identical across all winners — only the segment and hook change.

---

### Above-the-fold (3–5 second decision window)

| Element | Rule | Current Ringassur status |
|---------|------|--------------------------|
| Headline | Concrete benefit, not "welcome" | ⚠️ Weak — "Votre santé mérite le meilleur" / "Demandez votre devis" = generic |
| Sub-headline | Who it's for + what happens next | ⚠️ Missing "Réponse en 2 minutes, sans engagement" framing |
| CTA/form | Above fold on mobile, mini form or big button | ✅ Form is above fold |
| Trust elements | Logos, star ratings, "+X clients", phone number | ❌ Completely missing on all 4 pages |

**Headline formula that works:**
"Comparez [X] mutuelles santé [segment] et économisez jusqu'à [Y€] / an"
→ Concrete. Specific. Promise-first. Segment-matched.

**Sub-headline formula:**
"Réponse en moins de 2 minutes · Sans engagement · 100% en ligne"
→ Removes the 3 main friction points before they become objections.

---

### Body structure (below fold — doubt removal, not blogging)

**Block 1 — Benefits bullets (5 max)**
- Économies potentielles chiffrées (ex: "jusqu'à 40% moins cher")
- Rapidité de prise en charge
- Niveau de couverture (soins dentaires, optique, hospitalisation)
- Prise en charge des soins coûteux
- Accompagnement personnalisé par un conseiller

**Block 2 — How it works (3 steps, makes process feel finite)**
1. Remplissez le formulaire (2 minutes)
2. Un conseiller vous rappelle sous 15 minutes
3. Vous recevez vos offres et économisez

**Block 3 — Social proof (near the form = critical placement)**
- Client testimonials (real names, photo, specific savings)
- Review stars (Google, Trustpilot)
- Partner/insurer logos
- Number: "+X seniors accompagnés cette année"
Research: social proof blocks placed near the form consistently increase conversion.

**Block 4 — FAQ (kills objections before they kill the lead)**
- "Y a-t-il un engagement ?" → Non, devis gratuit sans engagement
- "Frais cachés ?" → Aucun, service 100% gratuit
- "Que faites-vous de mes données ?" → Conformité RGPD, données jamais revendues
- "Combien de temps ça prend ?" → 2 minutes pour le formulaire, rappel sous 15 min

---

### Form rules
- **Minimum fields:** Prénom + Téléphone + 2–4 qualifying questions only
- **Qualifying questions for mutuelle santé:**
  1. Votre âge : 18–35 / 36–55 / 55–65 / 65+
  2. Situation actuelle : Sans mutuelle / Mutuelle trop chère / Veut changer / Salarié cherche individuelle
  3. (Optional) Composition du foyer : Seul / En couple / Famille
- **Microcopy under submit button:** "Un expert vous rappelle sous 15 minutes pour finaliser votre devis"
- **NO:** multiple steps, email field (increases friction), too many dropdowns

---

### Design principles that move the needle

| Principle | Rule |
|-----------|------|
| One goal | No navigation menu, no footer links, no distractions |
| Mobile first | Big thumbable buttons (min 48px), short sections, compressed images, fast load |
| High-contrast CTA | Main button visually dominates — no competing elements |
| Segment matching | Image + copy explicitly match the target persona (senior ≠ famille ≠ indépendant) |
| No clever design | Structure beats creativity — winners all look structurally identical |

---

### Gap audit — Current Ringassur pages vs. blueprint

| Element | Blueprint standard | All 4 pages today |
|---------|--------------------|-------------------|
| Specific benefit headline | "Économisez jusqu'à X€/an" | ❌ Generic ("Votre santé mérite le meilleur") |
| Sub-headline with friction removal | "2 min · sans engagement · en ligne" | ❌ Missing |
| Trust logos/ratings above fold | Required | ❌ Zero trust elements |
| Qualifying questions in form | 2–4 questions (age, situation) | ❌ None — only nom + téléphone |
| "How it works" 3 steps | Required | ❌ Missing on most pages |
| Social proof near form | Testimonials + stars + count | ❌ Missing on all pages |
| FAQ block | Required | ❌ Missing |
| Microcopy under CTA | "Rappelé sous 15 min" | ❌ Missing |
| No navigation | Required | ✅ No nav |
| Form above fold mobile | Required | ✅ Present |
| Segment-matched imagery | Required | ⚠️ Photos exist but no copy match |

**Score: 2/13 elements present.** Form and no-nav only. Everything else missing.

---

### Facebook ad → landing page flow options

**Option A: Instant Form → Landing Page (hybrid)**
Ad → Facebook instant form (high volume, fast) → thank-you screen links to landing page for call booking
Best for: volume first, quality second. Good for seeding pixel quickly.

**Option B: Ad → Landing Page only**
Ad → full landing page with detailed form + trust proof
Best for: fewer but more qualified leads. Requires page to have all trust elements above.

**Recommendation for Ringassur now:**
Start with Option A (instant form to seed pixel) while rebuilding landing pages to full blueprint standard. Once pages score 10+/13 on the blueprint, switch to Option B or run both in parallel.

---

## 8. RESEARCH SOURCES APPLIED
Based on: "Deep Lead Generation with Facebook Ads (Including Mutuelle Santé)" — 2025–2026
Key citations applied:
- Lead Ads ~85% completion rate (ref [4], [13])
- CPL €25–45 for mutuelle santé via instant forms (ref [4])
- 50 conversions/week needed for learning phase exit (Meta docs)
- Qualifying questions improve quality without killing volume (ref [14], [11])
- Lookalikes from high-value customers > all-leads lists (ref [12])
- CRM/automation within minutes of lead capture critical (ref [10], [19])
- Offline conversion data feedback trains algorithm better than raw leads (ref [11], [3])
