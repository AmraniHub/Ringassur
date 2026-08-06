# RINGASSUR — META ADS STRATEGY 2026

**Rebuilt:** 2026-08-06 from live Graph API data (act_2028742241382135)
**Supersedes:** the 2026-05-24 version, whose numbers were wrong (see Appendix A)
**Status:** Master playbook. Every claim below is traceable to account data or French law.

---

## PART 0 — THE DECISION: DO NOT STOP THE CAMPAIGN

**Keep `Mutuelle 2026/08/05` (120252972617540471). Restructure inside it.**

The campaign object is correctly built: `OUTCOME_LEADS`, `AUCTION`, no Special Ad
Category (correct for mutuelle santé). Nothing at campaign level is broken.

Everything broken is at **ad set** level. Deleting the campaign to rebuild would throw away:

- The best landing-page conversion rate you have ever recorded (15.5% LPV→lead)
- 1,123 post engagements, 7 likes and a save accumulated on the ad posts — social proof
  that carries forward only if you reuse the same post IDs
- Two creatives with proven lead production

**Do this instead:** pause all seven ad sets, build one new ad set inside the same
campaign, and attach the winning creatives as *existing posts* so the social proof survives.

---

## PART 1 — WHAT THE ACCOUNT ACTUALLY SAYS

### Lifetime, all seven campaigns

| Campaign | Spend | CPM | CTR | Leads | CPL | LPV→Lead |
|---|---:|---:|---:|---:|---:|---:|
| Leads génération 11 | $72.09 | $10.47 | 1.50% | 8 | **$9.01** | 14.8% |
| LEADS NUMBER 2 15/05 | $8.81 | $16.85 | 2.49% | 1 | $8.81 | 16.7% |
| Compaigne leads 6g | $28.97 | $5.19 | 3.74% | 1 | $28.97 | **1.0%** |
| Compaigne niche 1. | $13.77 | $39.46 | 0.86% | 1 | $13.77 | 50.0%¹ |
| Votre santé mérite | $9.27 | $23.35 | 0.76% | 0 | — | 0% |
| Compaigne leads | $38.87 | $21.11 | 1.52% | 0 | — | 0% |
| **Mutuelle 2026/08/05** | **$170.61** | **$37.97** | 2.34% | **9** | **$18.96** | **15.5%** |
| **TOTAL** | **$342.39** | | | **20** | **$17.12** | |

¹ 2 landing page views — statistically meaningless.

### The single most important reading

Your current campaign has the **best conversion rate you have ever achieved (15.5%)**
while paying the **second-most-expensive media in account history ($37.97 CPM, 3.6× the
$10.47 of your best campaign)**.

That is a precise diagnosis: **the creative and the landing page are working. The media
buying is not.** Do not touch the funnel. Fix the delivery.

Two forces drive the CPM gap, and only one is fixable:

- **Format (not fixable, and you should not want to).** Video costs more than link ads.
  Your image ad sets ran at $17–19 CPM but produced **zero leads on $12.78**. Cheap
  impressions that never convert are the `Compaigne leads 6g` trap: 3.74% CTR, $0.14 CPC,
  97 landing page views, **1 lead**. Cheap traffic is not the goal.
- **Fragmentation (fixable, and it is most of the gap).** Five active ad sets each sit
  permanently in Learning Limited, so Meta bids inefficiently on every one of them.

### Why nothing can exit the learning phase today

Meta needs **50 conversions per ad set per week**. Your own May memo recorded this rule;
the live account violates it five ways.

| | Today | After consolidation |
|---|---:|---:|
| Active ad sets | 5 | 1 |
| Combined daily budget | $107 | $107 |
| Conversions/week per ad set | ~8–11 | **~60** |
| Learning phase | Never exits | Exits in week 1 |

**The budget is already sufficient. It is only mis-split.** Consolidation costs nothing
and is the highest-leverage change available.

### Ad-level truth: which creative actually earns

| Creative | CTA | Spend | Leads | CPL |
|---|---|---:|---:|---:|
| **Mutuelle Senior jusqu'à -20 %** `1029548829896358` | ORDER_NOW | $50.10 | **4** | **$12.53** |
| **Trouvez une mutuelle senior moins chère** `1366108138230750` | ORDER_NOW | $36.65 | **3** | **$12.22** |
| La mutuelle senior au meilleur prix… | LEARN_MORE / SEE_DETAILS | ~$48 | 2 | ~$24 |
| All image / link_data ads | mixed | $12.78 | **0** | — |

The pattern is unambiguous and directly matches the research: **a specific number plus
ORDER_NOW beats a vague superlative plus LEARN_MORE.** "jusqu'à -20 %" and "moins chère"
convert at roughly half the cost of "au meilleur prix".

Note the trap: `Ad 2` in `New 3 videos` posted the **highest CTR in the account (5.06%)**
and produced **zero leads**. Never optimise on CTR.

---

## PART 2 — THE STRUCTURE THAT WORKS

```
CAMPAIGN  Mutuelle 2026/08/05          ← KEEP, do not recreate
  Objective          OUTCOME_LEADS
  Special Ad Category NONE             ← correct for mutuelle santé
  Budget             CBO $107/day      ← consolidate the five ad-set budgets

  └── AD SET  "FR • Senior 50-65+ • Broad"        [CREATE NEW]
        Optimisation     OFFSITE_CONVERSIONS → Lead
        Attribution      7-day click / 1-day view
        Geo              France
        Age              50 → 65+       ← NO UPPER CAP (see below)
        Gender           All
        Detailed target  NONE — broad, Advantage audience ON
        Placements       Advantage+ (keep current)

        ├── Ad A  "Mutuelle Senior jusqu'à -20 %"        post 1058268114043864_122122260597316508
        ├── Ad B  "Trouvez une mutuelle senior moins chère" post 1058268114043864_122122263045316508
        └── Ad C  new variant on the -20 % hook

  ⨯ PAUSE all seven existing ad sets
  ⨯ NO retargeting ad set yet — see "Do not build this" below
```

### The age fix — the most expensive single error in the account

Five of seven ad sets run `age_min: 18, age_max: 65`. The product is **senior** mutuelle.
Your landing page offers a "65 ans et plus" qualification chip.

So the ads **cannot reach anyone over 65** — the segment the research identifies as
highest premium (1,700 €/yr vs 850 €) and longest retention (4.2 years) — while paying to
show senior insurance to 18-year-olds.

Meta's top bracket is `65+` and is open-ended. `age_max: 65` is a hard exclusion of your
best buyer. **Set 50 → 65+ with no cap.**

### Drop detailed targeting entirely

The two interest-targeted ad sets use three interests, one of which is
**"Quality assurance" (`6002997779244`)** — the industrial/software QA interest. Someone
searched "assurance" and picked the wrong result. It has been spending money.

Beyond that bug: interest targeting on French 55+ shrinks an already-small pool, and under
Andromeda the creative *is* the targeting. Go broad and let the copy filter.

### Do not build this yet

A retargeting ad set. Lifetime reach is 2,443 with roughly 250 landing page views. There
is no audience to retarget, and a second ad set re-creates the fragmentation you are
fixing. **Revisit at ~10,000 reach.**

### Budget scaling — only after learning exits

| Phase | Daily | Advance when | Action |
|---|---:|---|---|
| Consolidate | $107 | Learning exited, CPL < $20 for 3 days | Hold |
| Ramp | $140 | CPL < $15, 3 consecutive days | +30% |
| Scale | $180 | CPL < $12 stable | +30% |
| Horizontal | $250+ | CPL < $12 at $180 | Duplicate ad set |

**Never raise budget more than 30% in 48h** — it resets learning and undoes the work.

---

## PART 3 — THE QUALITY LOOP (biggest untapped lever)

`api/qualify-lead.js` is deployed and fires a CAPI `Purchase` when a broker confirms a
lead. **No `Purchase` events exist in the account.** It has never been called.

Until it is, Meta optimises for *people who fill forms*, which is a different person from
*people who buy mutuelle*. Every CPL number above measures form-fills.

### Wiring

XLead24 (or the courtier) POSTs on every qualified lead:

```
POST https://ringassur.com/api/qualify-lead
X-Secret: $QUALIFY_SECRET
{ "phone": "0612345678", "email": "...", "value": 20,
  "sourceUrl": "https://www.ringassur.com/mutuelle-sante" }
```

### Sequence — do not skip a step

1. **Now:** wire the call. Keep the ad set optimising for `Lead`.
2. **Accumulate.** At ~20% qualification, 50 `Purchase` events needs ~250 leads ≈ 4 weeks.
3. **Then** switch ad-set optimisation to `Purchase`, or enable value optimisation.
4. **Then** build lookalikes from qualified buyers only — never from all leads.

Switching to `Purchase` before step 2 completes will starve delivery.

---

## PART 4 — COMPLIANCE: 11 AUGUST 2026

The loi du 30 juin 2025 opt-in regime applies **11 August 2026**. Bloctel is abolished;
consent must be prior, explicit, specific and provable, and **the burden of proof is
yours**. DGCCRF exposure: up to 375,000 € per infraction for a legal person.

### Fixed today

| Defect | Status |
|---|---|
| All 10 lead pages archived the CRM library's **generic default** consent text instead of the wording shown on screen | **FIXED** — each page now passes its exact on-screen string |
| `assurance-emprunteur.html` filed leads as `vertical: 'rc_decennale'` — wrong courtier queue | **FIXED** |
| `mutuelle-sante.html` collected email but never sent it to the CRM | **FIXED** |
| `qualify-lead.js` hardcoded every vertical's Purchase to `/mutuelle-sante3` | **FIXED** |

### BLOCKING — requires your decision before these pages run ads

**1. `assurance-emprunteur.html` has no consent checkbox at all.**
It relies on "En cliquant, j'accepte…" — implied consent by button click, which is
**void** under the new regime. This is also the credit/financial vertical, the most
scrutinised. A real unticked checkbox is mandatory before this page sees a euro of spend.

**2. The same page states "Vos données ne seront pas cédées à des tiers."**
The lead is routed through XLead24 to paying courtiers — third parties. That is an
affirmative false statement to the data subject. It must be corrected, not merely archived.

**3. Third-party disclosure mismatch across the portfolio.**
`indemnite-journaliere`, `rc-decennale` and `rappel` say "un conseiller **Ringassur**",
implying first-party contact. Leads are sold to partner courtiers. Recommended wording,
for your approval — I have not applied it, because this is legal-facing copy and your call:

> J'accepte d'être contacté par téléphone par Ringassur **et ses courtiers partenaires**
> au sujet de ma demande. Consentement révocable à tout moment.

**4. `energie.html` phrases consent as a question** — "Acceptez-vous d'être contacté par
un conseiller ?" A question is not a declaration of consent. Reword to "J'accepte…".

**5. PII in query strings.** Every page sends name, phone and email to Google Apps Script
as **URL parameters** over `GET` with `mode:'no-cors'`. Personal data in a URL is written
to Google's server logs, browser history and referrer headers, and `no-cors` means you
never learn whether the write succeeded. Convert to `POST` with a JSON body.

### Still to verify (I could not confirm from the client side)

XLead24 must archive, per lead: **timestamp, IP, exact page URL, and privacy-policy
version**. `landing_page` and `consent_text` now arrive correctly; timestamp and IP are
presumably server-stamped on receipt; **policy version is captured nowhere**. Confirm with
XLead24 before Tuesday.

---

## PART 5 — PORTFOLIO SEQUENCING

All seven landing pages exist. They do **not** carry equal risk.

| Niche | Meta category | Launch risk |
|---|---|---|
| Mutuelle Santé | None | Live. Correct as configured. |
| Énergie | None | **Low — launch second.** Cold calling illegal since 2020, so digital is the only channel. Reword consent first. |
| RC Décennale | None (B2B) | Low. Different motion: SIRET, CA, sinistralité. |
| Indemnité Journalière | None (B2B) | Low. Fix third-party wording. |
| Assurance Auto | None, but **personal-attributes minefield** | High. "Résilié pour alcoolémie ?" = instant ban. Copy must stay solution-positive. |
| Assurance Emprunteur | **SAC: Credit / Financial** | **Blocked** — no consent checkbox + false third-party claim. |
| Estimation Immobilière | **SAC: Housing** | Declare SAC or risk the account. |

### The portfolio risk that could cost you everything

Launching an **undeclared Special Ad Category** campaign on `act_2028742241382135` can
restrict the entire ad account — taking down the mutuelle campaign that is currently your
only earner.

You hold 25 ad accounts. **Isolate `assurance-emprunteur` and `estimation-immobiliere`
onto a separate account** with the correct SAC declared. Never let an experiment sit on
the same account as your revenue.

Under SAC you also lose: precise postal-code targeting (15-mile / ~24 km radius minimum),
age and gender targeting, and standard lookalikes. Plan for creative-as-filter from day one.

---

## PART 6 — CREATIVE DOCTRINE

**Winning formula, evidenced by your own data:**

```
[Segment] + [specific number] + [zero-risk qualifier]  →  ORDER_NOW
"Mutuelle Senior jusqu'à -20 %"  ·  "100 % Gratuit • Sans engagement"
```

Rules that follow from the account, not from theory:

1. **Video only.** Images: $12.78, zero leads. Stop rebuilding them.
2. **ORDER_NOW over LEARN_MORE.** Roughly half the CPL, same creative family.
3. **A number in the title.** "-20 %", "moins chère" beat "au meilleur prix".
4. **Never judge on CTR.** Your 5.06% CTR ad produced nothing.
5. **Kill on spend, not impressions:** no lead after 2× target CPL in spend → pause.

**Next three variants to produce — all off the -20 % hook:**

- Same offer, opened by a 55–70 face in the first frame (segment matching)
- Same offer, price-anchored: "70 € → 56 €/mois"
- Same offer, résiliation-deadline framing for the autumn peak

### Seasonal calendar — France, mutuelle santé

| Period | Action |
|---|---|
| **Aug (now)** | Consolidate, fix targeting, wire the quality loop. Low CPM — cheap month to learn. |
| Sep–Oct | Ramp budget. Hook: "Préparez votre résiliation avant décembre." |
| **Nov (PEAK)** | Max budget, winning creatives only. Résiliation deadline. |
| Jan–Feb | Second peak: "Votre mutuelle a augmenté — comparez." |

---

## PART 7 — EXECUTION ORDER

**Before Tuesday 11 August**
1. Deploy today's code fixes (consent_text, vertical, email, sourceUrl)
2. Confirm XLead24 archives timestamp + IP + URL + policy version
3. Decide the third-party consent wording; apply across all pages
4. Add a real consent checkbox to `assurance-emprunteur.html`, correct the false claim
5. Reword `energie.html` consent from question to declaration

**This week — media**
6. Pause all 7 ad sets
7. Create one ad set: FR, 50–65+, broad, no interests, $107/day CBO
8. Attach the two winning creatives as **existing posts**, plus one new variant
9. Confirm attribution is 7-day click / 1-day view

**Next 30 days**
10. Wire `/api/qualify-lead`; let Purchase volume accumulate
11. Convert Apps Script calls from GET-with-PII to POST
12. Hold budget until learning exits — then scale by 30% steps
13. At ~50 Purchase events: switch optimisation, build buyer lookalikes

**After mutuelle is stable**
14. Launch Énergie on the same account
15. Launch Estimation Immobilière on a **separate** account with Housing SAC

---

## PART 8 — DECISION RULES

| Metric | Target | Red flag |
|---|---|---|
| CPL (form-fill) | $12–18 | > $25 |
| LPV → Lead | > 12% | < 8% |
| CPM | < $30 | > $45 |
| Cost per **qualified** lead | to be established | — |
| Learning phase | Exited within 7 days | Still limited at day 10 |
| Time to first callback | < 5 min | > 30 min |

**Never optimise on CPC or CTR.** Both have already misled this account:
`Compaigne leads 6g` had the cheapest clicks in account history and a 1.0% conversion rate.

---

## APPENDIX A — Corrections to the 2026-05-24 version

The previous playbook was built on a false premise and its revenue model should be discarded.

| Claim | Reality |
|---|---|
| "Your best CPL so far: **1.94 €**" | No campaign has ever achieved this. Best lifetime CPL is **$9.01** (Leads génération 11). |
| "20× better than market" | Derived from the 1.94 € figure. False. |
| "100 leads/day at 5 € CPL → 45–60 k€/month" | Fantasy compounding off a wrong CPL. |
| "Static image 4:5 — **your #1 format**" | Contradicted by data: images have produced **zero** leads on $12.78. Video is the only format that converts. |
| "Instant Forms over landing pages" | **Now backwards.** Under the 11 Aug regime, landing pages let you own and export consent proof; Meta's Instant Form consent is harder to evidence. Your website-conversion setup is correct — keep it. |
| "Domain flagged financial, interest targeting restricted" | Stale. Interest targeting ran fine in August. |

Realistic model at $107/day and $12.50 CPL: ~8.5 leads/day, ~255/month. At a 20 € sell
price that is ~5,100 €/month revenue against ~3,200 €/month spend. Sound economics — and
they improve substantially once the quality loop drops CPL. That is the business to build.
