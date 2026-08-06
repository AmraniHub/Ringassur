# RINGASSUR — Debug Protocol
## When Something Breaks: Exact Diagnosis Steps

**Use this file when:** Performance drops, ads stop delivering, leads disappear, account flagged, tracking broken.
**Rule:** Work through the protocol in ORDER. Don't skip steps.

---

## SCENARIO 1 — CPL Suddenly Spikes

**Symptom:** CPL was €8 yesterday. Now it's €25+. Nothing changed.

**Check in this exact order:**

**Step 1 — Creative Fatigue (most common cause)**
- Check: Frequency at ad level (not campaign level). Is it above 3.0?
- Check: CTR trend — is it dropping week-over-week?
- If yes → creative is fatigued. Launch 3+ new creatives immediately.
- Ringassur history: this happened with "Votre santé mérite" hook.

**Step 2 — CPM Spike**
- Check: CPM in the last 7 days vs previous 7 days.
- CPM up = auction got more competitive OR audience saturated.
- If CPM > 35€ → audience too narrow. Remove any remaining interest targeting.
- Seasonal: Nov-Jan CPM spikes across all competitors (résiliation season).

**Step 3 — Landing Page Speed**
- Go to: web.dev/measure → test ringassur.com/mutuelle-sante3
- If score drops below 70 → check Vercel deployment, check image sizes
- Slow page = lower Quality Score = Meta charges you more per click.

**Step 4 — CAPI Event Match Quality**
- Go to: Events Manager → Data Sources → Pixel 1011230188058686 → Overview
- If EMQ dropped below 6 → check token, check CAPI endpoint logs on Vercel
- Low EMQ = Meta has less signal = estimated action rates drop = CPL rises

**Step 5 — Budget Change**
- Did anyone touch the campaign budget in the last 48h?
- Any change >30% resets the learning phase → CPL spikes while re-learning
- Fix: don't touch it. Let it re-stabilize over 3-5 days.

**Step 6 — Competitor Activity**
- Check: ads_insights_auction_ranking_benchmarks via Meta MCP
- If industry CPM rose → external pressure, not your fault
- Strategy: test new hooks, wait it out, or reduce budget temporarily.

---

## SCENARIO 2 — Ads Not Delivering (0 or Very Low Spend)

**Symptom:** Campaign is active but spending €0 or almost nothing.

**Step 1 — Billing**
- Check: Ads Manager → Billing → Is payment method valid?
- Check: Has account hit spending limit?
- Fix: Update card or increase account spending limit.

**Step 2 — Policy Flag**
- Check: Ads Manager → any ads showing "Rejected" or "In Review"?
- Check: Account Quality page (facebook.com/accountquality)
- If rejected → see Scenario 4 (Account Flagged) below.

**Step 3 — Learning Phase Stuck**
- Check: Is ad set showing "Learning" for more than 7 days?
- Cause: Not enough conversions (need 50/week to exit)
- Fix: Increase budget OR consolidate ad sets OR lower optimization event (Lead → LPV)

**Step 4 — Audience Too Small**
- Check: Potential reach in ad set — should be 1M+
- If under 500K → remove restrictions (age, interests, locations)
- For France mutuelle senior: Broad FR + Advantage+ always gives 10M+ reach.

**Step 5 — Bid Too Low**
- If using Cost Cap or Bid Cap: is the cap too tight?
- Switch to Highest Volume temporarily to restore delivery.
- Rule: start with Highest Volume always. Add cost control only after 2+ weeks of data.

**Step 6 — Account Disabled**
- Go to: facebook.com/accountquality
- If disabled → see Scenario 4 below.

---

## SCENARIO 3 — CAPI Events Not Firing / Missing in Events Manager

**Symptom:** Events Manager shows leads dropping. CAPI events not appearing. EMQ declining.

**Step 1 — Check Vercel Function Logs**
- Go to: vercel.com → ringassur project → Functions tab → api/capi.js → View Logs
- Look for errors: 500 responses, token errors, JSON parse fails.

**Step 2 — Token Expired?**
- The System User token (EAANhgmvr97k...) never expires — but verify in Events Manager.
- Go to: graph.facebook.com/debug_token?input_token=EAANhgmvr97k...
- Check: `is_valid: true`. If false → get new token from Meta Business Manager → System Users.

**Step 3 — CAPI Endpoint Responding?**
- Test manually:
```bash
curl -X POST https://ringassur.com/api/capi \
  -H "Content-Type: application/json" \
  -d '{"eventName":"PageView","pixelId":"1011230188058686","sourceUrl":"https://ringassur.com/test"}'
```
- Expected: `{"status":"ok","eventName":"PageView"}`
- If 500 or timeout → check Vercel deployment, redeploy.

**Step 4 — Pixel Fires in Browser?**
- Open ringassur.com/mutuelle-sante3 in Chrome
- Open DevTools → Network tab → filter "events"
- Submit form. Should see 2 requests to graph.facebook.com: one from pixel (browser) + one from CAPI (server).
- If only 1 → CAPI not firing. Check capi.js fetch call in landing page HTML.

**Step 5 — Deduplication Working?**
- In Events Manager → check if any events show as "Deduplicated"
- High dedup rate (>50%) = eventIds not being passed correctly
- Check: each event has a unique eventId in both pixel and CAPI calls.

**Step 6 — Wrong Pixel ID?**
- Confirm: all 3 pages send `pixelId: '1011230188058686'` to CAPI
- Old pixel (944605845074489) should receive NO events.
- Search all HTML files for "944605845074489" — should only appear in capi.js as fallback default.

---

## SCENARIO 4 — Account Flagged or Ad Rejected

**Symptom:** Ad rejected, account restricted, campaigns paused by Meta.

**Step 1 — Identify the Exact Violation**
- Go to: Ads Manager → find rejected ad → click "See details"
- Note the exact policy that was cited. Screenshot it.
- Common for mutuelle: "financial products claims", "misleading health claims"

**Step 2 — Check the Specific Element**
- Was it the image? (before/after, shocking image, too much text)
- Was it the copy? ("guaranteed savings", "best price in France")
- Was it the landing page? (countdown timer, fake testimonials)
- Was it the targeting? (age/gender restrictions without Special Ad Category)

**Step 3 — Fix and Re-Request Review**
- Fix the specific element cited.
- Re-submit the ad for review.
- Do NOT create a duplicate ad with the same content — Meta flags duplicate violations harder.

**Step 4 — If Account Restricted**
- Go to: facebook.com/accountquality
- Click "Request Review" on the restriction.
- Write a specific appeal: "My ad promotes a free insurance comparison service. No guaranteed returns or medical claims are made. Ringassur is an ORIAS-certified broker."
- Do NOT use generic appeals. Specific + professional = higher success rate.
- Appeal window: 30 days. After 30 days the restriction is often permanent.

**Step 5 — Prevention**
- Never use: "best", "guaranteed", "100% free forever", "cure", "lose weight"
- Always use: "compare", "may save up to", "no commitment", "free comparison"
- ORIAS number visible on LP = credibility signal for Meta reviewers.

---

## SCENARIO 5 — Leads Coming In But Broker Rejects Them

**Symptom:** CPL looks fine. Leads arriving. Broker says quality is bad (wrong phone, wrong age, not interested).

**Step 1 — Check Form Fields**
- Is age bracket field prominent and required?
- Are you asking for the right information to pre-qualify?
- Add: "Votre mutuelle actuelle ?" or "Votre situation ?" to filter intent.

**Step 2 — Check Ad-to-Page Angle Match**
- Which landing page is getting traffic? (check URL breakdown in Ads Manager → Breakdown → URL)
- sante1 vs sante2 vs sante3 — do they attract different quality leads?
- Mismatch between ad promise and LP = confused users who fill form without intent.

**Step 3 — Check Audience Age**
- Are leads coming from people outside the target age?
- Even with Broad targeting, check demographic breakdown in Ads Manager.
- If 40% of leads are under 50 → add age-based copy in the ad itself ("Pour les 55 ans et plus") to self-filter.

**Step 4 — Activate Lead Quality Loop**
- This is why qualify-lead.js exists.
- Broker confirms a lead → POST to /api/qualify-lead with phone/email.
- Meta gets a Purchase signal → starts finding more people like the good leads.
- If not yet live: deploy qualify-lead.js and give broker the endpoint + QUALIFY_SECRET.

**Step 5 — Test Native Lead Form**
- Native Lead Forms on Meta pre-fill from Facebook profile.
- "Higher Intent" lead form: add a qualifying question before submission.
- This naturally filters people who aren't serious — they drop off at the question.

---

## QUICK REFERENCE — What Causes What

| Symptom | Most Likely Cause | First Check |
|---------|------------------|-------------|
| CPL spikes suddenly | Creative fatigue | Frequency at ad level |
| CPL always high | Wrong hook / audience | CTR < 1%? Kill creative |
| 0 leads, CPM normal | Landing page problem | Page speed + form UX |
| 0 spend | Billing / policy flag | Account Quality page |
| Learning never exits | Budget too low | Need 50 events/week |
| CPM > 35€ | Audience too narrow | Remove all restrictions |
| CAPI events missing | Token expired / Vercel down | Check function logs |
| Low EMQ | Missing PII fields | Add phone + name hash |
| Leads but bad quality | Wrong angle / no pre-qualify | Check URL breakdown |
| Account flagged | Policy violation in creative | See rejected ad details |

---

## POST-MORTEM TEMPLATE
*(Use this every time something goes wrong)*

```
DATE:
WHAT BROKE:
WHEN IT STARTED:
WHAT WE CHECKED (in order):
ROOT CAUSE:
FIX APPLIED:
TIME TO FIX:
ADDED TO ERROR LOG: yes/no
RULE ADDED TO SKILL FILE: yes/no
```
