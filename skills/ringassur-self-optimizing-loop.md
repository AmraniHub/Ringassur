# RINGASSUR — Self-Optimizing Learning Loop
## The System That Gets Smarter Every Week

**Purpose:** Track what wins, what dies, why — so every week is faster and cheaper than the last.
**Update:** Every Monday after pulling data. Takes 15 minutes.
**Last updated:** 2026-05-24

---

## LAYER 1 — CREATIVE PATTERN LIBRARY

### Winners — Creative Fingerprints
*(What made each winning creative work — extract the pattern, replicate it)*

| Creative Name | Hook | Format | CTR | CPL | Why It Won | Replicable Pattern |
|--------------|------|--------|-----|-----|-----------|-------------------|
| Best creative (Campagne 6g) | Unknown — recover from Ads Manager | Static | 8.53% | — | Exceptional CTR at CPM 1.80€ | Recover image + copy → clone angle |
| "37£" ad set | Price pain angle | Unknown | — | 1.94€ | Cheapest lead ever. Angle resonates deeply. | Price pain + direct comparison = senior intent |
| "Tous les Metiers" | Professional/worker angle | Unknown | — | 3.06€ | Broader appeal beyond retired | Job identity angle works for 45-65 |

**To recover:** Pull ad previews from Ads Manager for these 3 and document exact hook + image.

### Losers — Death Patterns
*(What killed each creative — never repeat these patterns)*

| Creative Name | Hook | CTR | CPL | Why It Died | Pattern to Avoid |
|--------------|------|-----|-----|-------------|-----------------|
| "Votre santé mérite" | Aspirational | 0.76% | 0 leads | Vague benefit, no pain, no urgency | Aspirational hooks = 0 for this audience |
| "84$" ad set | Unknown | — | 0/11€ | Wrong audience signal OR bad hook | Budget wasted with no data — always check hook first |

---

## LAYER 2 — BAYESIAN BELIEF TABLE
*(Confidence level in each angle. Updates with evidence. Never defend a belief — update it.)*

**Scale: 0-100% confidence that this angle delivers CPL < 15€**

| Angle | Current Confidence | Evidence | Last Updated | Action |
|-------|-------------------|---------|--------------|--------|
| Price pain ("trop cher") | **90%** | Best CTR 8.53%, CPL 1.94€ proven | 2026-05-24 | PRIMARY angle — always run |
| Savings proof ("économisez X€") | **75%** | CPL 3.06€ on "Tous les Metiers" | 2026-05-24 | Run as secondary |
| Objection killer ("gardez votre médecin") | **60%** | No hard data yet | 2026-05-24 | Test — need 2K impressions |
| Professional/worker identity | **70%** | 3.06€ CPL on "Tous les Metiers" | 2026-05-24 | Strong for 45-65 segment |
| Fear/health security | **45%** | No data — theory only | 2026-05-24 | Test cautiously |
| Quiz/curiosity hook | **40%** | No data | 2026-05-24 | Low priority test |
| Aspirational ("mérite le meilleur") | **5%** | 0.76% CTR, 0 leads confirmed | 2026-05-24 | NEVER run again |
| Social proof ("500 Français...") | **50%** | No data | 2026-05-24 | Test as supporting angle |
| Seasonal (price increase Jan) | **80%** | Strong logic, seasonal pattern confirmed | 2026-05-24 | Run Nov-Feb at max budget |
| FAQ / educational | **35%** | No data, likely too slow for cold traffic | 2026-05-24 | Only for retargeting |

**Rule:** When confidence drops below 50% after real data → kill the angle. When it hits 85%+ → scale hard.

---

## LAYER 3 — WEEKLY LEARNING RITUAL
*(Run every Monday. 15 minutes. This is the optimization engine.)*

### Step 1 — Pull Data (5 min)
Via Meta MCP: "Pull last 7 days for act_2028742241382135 at ad level — CTR, CPL, CPM, impressions, spend"

### Step 2 — Update Creative Pattern Library (3 min)
- Any new winners this week? → Add to Winners table with fingerprint
- Any new confirmed losers? → Add to Losers table with death pattern
- Any creative hitting frequency > 2.5? → Flag for refresh next week

### Step 3 — Update Bayesian Table (3 min)
For each angle that got data this week:
- Did it perform above CPL target? → Confidence +10%
- Did it perform below CPL target? → Confidence -15%
- Did it completely fail (0 leads / CTR < 0.5%)? → Confidence drops to 10%
- Did it beat target for 3+ consecutive days? → Confidence +20%

### Step 4 — Generate Next Week's Creatives (4 min)
Based on updated confidence table:
- Take top 2 angles (highest confidence) → generate 3 hook variants each
- Take 1 new untested angle (lowest on table) → generate 1 test creative
- Total: 7 new creatives to add this week

**Claude prompt for hook generation:**
```
Based on these confidence levels: [paste Bayesian table]
Generate 7 Facebook ad hooks for Ringassur (mutuelle santé senior, France).
Top 2 angles: 3 hooks each. 1 new test angle: 1 hook.
Max 8 words each. French. Pain-first. Different from: [paste existing hooks]
```

### Step 5 — Update Error Log (1 min)
Did anything go wrong this week? → Add to `ringassur-error-log.md`
Did any new pattern emerge? → Add rule to `ringassur-mutuelle-skill.md`

---

## LAYER 4 — PRE-LAUNCH DECISION CARD
*(Fill this out before ANY ad goes live. If you can't fill it in 2 minutes, don't launch.)*

```
CREATIVE NAME: ___________________
DATE: ___________________

FEYNMAN TEST — explain in 1 sentence why this specific ad makes a 60-year-old fill a form:
"This ad works because ________________________________"
If you can't complete this clearly → don't launch.

ANGLE: [ ] Price pain  [ ] Savings proof  [ ] Objection killer  [ ] Professional  [ ] Fear  [ ] Other: ___
CONFIDENCE IN THIS ANGLE: ___%  (from Bayesian table above)

KILL CONDITIONS (set before launch):
→ Pause if CPL > ___€ after ___€ spend
→ Pause if CTR < ___% after 2,000 impressions
→ Pause if 0 leads after 3x daily budget

SCALE CONDITIONS:
→ Scale +25% if CPL < ___€ for 3 consecutive days

BUDGET TYPE: [ ] Proven (80% allocation) [ ] Experimental (20% allocation)

SECOND-ORDER RISK:
→ "If this creative works at scale, what breaks next?" ___________________
   (audience saturation? competitor copies it? seasonal drop-off? landing page bottleneck?)

ANDROMEDA CHECK:
[ ] Creative is visually distinct from other active creatives
[ ] Text on image < 20%
[ ] LP headline matches ad hook exactly
[ ] Silent-first — message works without sound
```

---

## LAYER 5 — SCALE DECISION FRAMEWORK
*(Before increasing any budget, answer these)*

**The 5 Questions Before Scaling:**

1. **Has it been 3+ consecutive days below target CPL?**
   If no → don't scale. One good day is noise. Three days is signal.

2. **Is the learning phase complete?**
   If still in learning → don't touch the budget. Scaling resets it.

3. **Are there 10+ active creatives in the ad set?**
   If fewer → add creatives before scaling budget. More creatives = Andromeda finds more audience.

4. **What's the frequency at ad level?**
   If > 2.5 on any creative → add new creatives NOW before scaling budget.

5. **Second-order: if CPL stays at this level with 2x budget, what's the bottleneck?**
   Landing page conversion rate? Lead quality? Broker capacity? Fix bottleneck first.

---

## LAYER 6 — ANGLE EVOLUTION TRACKER
*(What was our best angle last month vs this month vs this week)*

| Period | #1 Angle | Best CPL | Notes |
|--------|----------|---------|-------|
| Pre-2026 (historical) | Price pain | 1.94€ | "37£" ad set — needs recovery |
| 2026-05 (this month) | Price pain | unknown — campaigns paused | Need to relaunch and measure |
| Next month target | Price pain + savings proof | < 10€ | With qualify-lead.js active |

---

## LAYER 7 — CREATIVE FATIGUE SIGNALS
*(Early warning system — catch fatigue before CPL spikes)*

**Watch these in order:**

| Signal | Threshold | Action |
|--------|-----------|--------|
| CTR dropping week-over-week | -15% in 7 days | Add 2 new creatives |
| Frequency at ad level rising | > 2.0 | Prepare 3 new variants |
| CPM rising with same targeting | +20% in 7 days | Check if new competitor entered auction |
| Frequency > 2.5 | Any creative | Active fatigue — launch new NOW |
| CTR dropped AND frequency > 3 | Both true | Creative is dead — pause immediately |

---

## LEARNING LOG — What Changed Each Week

### Week of 2026-05-24 (Session 1)
**What we learned:**
- Ringassur has 13 confirmed errors in the account (documented in error log)
- Best CPL ever: 1.94€ — "37£" ad set currently paused
- CAPI had 4 tracking bugs — all fixed 2026-05-23
- Social pages: 0 followers, 0 posts — 10 posts created and exported
- Global Meta healthcare CPL benchmark: $41.60 — we're 20x better

**Belief updates:**
- Price pain angle: confirmed excellent → confidence raised to 90%
- Aspirational hooks: confirmed dead → confidence dropped to 5%

**Next week's priorities:**
- Reactivate "37£" and "Tous les Metiers"
- Add 5 new price-pain hook creatives
- Check CAPI EMQ in Events Manager
- Deploy qualify-lead.js

**Open hypotheses to test:**
- Does Native Lead Form beat sante3 landing page for CPL?
- Does 55-70 age bracket explicit targeting beat full broad?
- Does video testimonial beat static image for this audience?

---

*This loop compounds. Week 1 you have 2 data points. Week 8 you have 56. Week 52 you have 365. The advertiser with the most documented learnings wins.*
