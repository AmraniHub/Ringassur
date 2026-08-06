# RINGASSUR — FULL GROWTH STRATEGY 2026
## Meta Ads + AI Automation + Revenue Scaling

**Compiled:** 2026-05-24  
**Status:** Master playbook — reference for all decisions

---

## PART 1 — THE REAL BUSINESS OPPORTUNITY

### Why This Business Prints Money (The Math)

Your best CPL so far: **1.94€** (ad set "37£")  
Market lead sell price: **15–30€ per exclusive lead**  
Your margin at worst: **13€/lead** | At best: **28€/lead**

| Scenario | Budget/day | Leads/day | CPL | Revenue/day | Margin/day |
|----------|-----------|-----------|-----|------------|------------|
| Conservative | 50€ | 5 leads | 10€ | 100€ | 50€ |
| Target | 150€ | 15 leads | 10€ | 300€ | 150€ |
| Scaled | 500€ | 50 leads | 10€ | 1,000€ | 500€ |
| AI-optimized | 500€ | 100 leads | 5€ | 2,000€ | 1,500€ |

**Monthly revenue at scale (50 leads/day):** ~15,000–30,000€/month  
**With AI optimization (100 leads/day at 5€ CPL):** ~45,000–60,000€/month

### Why Your CPL Is Exceptional

Global healthcare CPL benchmark on Meta: **$41.60 average**  
Your best CPL: **1.94€** — that's **20x better than market**

This means the angles work. The traffic is real. The opportunity is in:
1. Scaling budget (exit learning phase)
2. Automating optimization (stop letting money sleep)
3. Building a proper AI pipeline to close the loop between ad performance and lead quality

---

## PART 2 — META ADS STRATEGY (What to Do Now)

### Campaign Architecture (Single Campaign Rule)

```
CAMPAIGN: Ringassur Mutuelle Senior FR — Lead Gen [CBO]
Budget: 150€/day minimum → scale to 500€/day
Objective: LEADS
Pixel: 1011230188058686
Attribution: 7-day click, 1-day view

├── AD SET A: Pain/Price — sante3 [60% budget = 90€]
│   Audience: FR, Broad 45-75, Advantage+
│   Ads: 6 creatives (price pain angle)
│   Landing: /mutuelle-sante3 (strongest hook)
│
├── AD SET B: Savings Proof — sante1 [25% budget = 37.50€]
│   Audience: FR, Broad 55-75, Advantage+
│   Ads: 4 creatives (testimonial/savings angle)
│   Landing: /mutuelle-sante1
│
└── AD SET C: Objection Killer — sante2 [15% budget = 22.50€]
    Audience: FR, Broad 60+, Advantage+
    Ads: 3 creatives (reassurance angle)
    Landing: /mutuelle-sante2
```

**Golden Rule:** Never split into multiple campaigns for the same objective. You did this before (7 campaigns competing) — it inflates CPM and fights your own auction.

### Creative Velocity (The #1 Lever)

Under Andromeda, creative IS targeting. Meta uses computer vision to find the right users for each ad. More diverse creatives = better audience coverage.

**Current state:** Likely 3-5 stale creatives  
**Target state:** 15-25 active creatives rotating

**Weekly creative cadence:**
- Monday: Pull performance data → kill CTR < 0.5% after 2K impressions
- Tuesday: Write 5 new hook variations (30 sec each with Claude — see Part 3)
- Wednesday: Export 3 new static images from posts.html template
- Friday: Review new creative performance → identify winner pattern

**Creative format priority for French seniors (60+):**
1. Static image 4:5 — desktop/mobile, fast load — **your #1 format**
2. UGC-style video 15s — testimonial format, silent-first
3. Carousel — before/after price comparison
4. Native Lead Form — test vs landing page (potentially 30-50% lower CPL)

### Budget Scaling Protocol

| Phase | Daily Budget | Condition to Advance | Action |
|-------|-------------|---------------------|--------|
| Launch | 50€/day | CPL < 20€ for 3 days | Advance |
| Test | 150€/day | CPL < 15€, 3 consecutive days | +25% budget |
| Scale | 300€/day | CPL < 12€ stable | Duplicate winning ad set |
| Aggressive | 500€/day | CPL < 10€ | New campaign horizontal scale |

**Never increase budget more than 30% in 48h** — it resets the learning phase.

### Seasonal Calendar (France — Mutuelle Santé)

| Period | Action | Hook |
|--------|--------|------|
| **NOW (May-Jun)** | Launch & test | Evergreen pain hooks |
| Jul-Aug | Test new creatives | Lower CPM (vacances = less competition) |
| Sep-Oct | Ramp up budget | "Préparez votre résiliation avant décembre" |
| **Nov (PEAK)** | Max budget, best creatives only | Résiliation deadline hooks |
| Jan-Feb | Second peak | "Votre mutuelle a augmenté — comparez" |

---

## PART 3 — AI INTEGRATION (Claude + Meta MCP)

### Step 1: Connect Meta Official MCP to Claude (Free, 10 min)

Meta launched its official MCP server on **April 29, 2026**. It's free, no tokens needed.

**Setup:**
1. Open Claude Desktop → Settings → Features → MCP Servers
2. Add remote server URL: `https://mcp.facebook.com/ads`
3. Click Authorize → Login with your Meta Business account
4. Select act_2028742241382135 (Ringassur ad account)
5. Test: type "Show me my Meta ad accounts"

**29 tools you unlock:**
- `ads_insights_performance_trend` — pull any campaign's performance history
- `ads_insights_anomaly_signal` — auto-detects CPL spikes, CTR drops
- `ads_insights_auction_ranking_benchmarks` — compare your CPM vs industry
- `ads_get_dataset_quality` — CAPI Event Match Quality score (instant)
- `ads_update_entity` — pause/activate campaigns directly from Claude
- `ads_create_ad` — create new ads from Claude without touching Ads Manager
- `ads_insights_industry_benchmark` — compare to competitors in insurance niche

**Result:** What takes you 2-3 hours of manual Ads Manager work takes 60 seconds in Claude.

### Step 2: Automated Daily Monitoring Loop

Once MCP is connected, set a daily 8am scheduled task (via `/schedule` skill):

```
Every morning at 8:00 pull last 24h Meta data for act_2028742241382135.
Report:
- Total spend | Total leads | Blended CPL
- Per ad set: CTR / CPM / CPL → SCALE / HOLD / KILL signal
- Top 3 ads by CTR
- Any anomaly signals triggered
- CAPI Event Match Quality score
Apply kill rules: pause any ad set with CPL > 30€ after 50€ spend.
Apply scale rules: flag any ad set with CPL < 8€ for 3 days.
```

**Time saved:** 15 hours/week → 0 hours. Claude runs it automatically.

### Step 3: AI Creative Factory (30 Seconds Per Ad)

Use Claude to generate 10 hook variations in under 60 seconds:

**Prompt template to use every week:**
```
Generate 10 Facebook ad hooks for Ringassur (mutuelle santé senior, France).
Target: French seniors 55-70 who pay too much for their mutuelle.
Angle this week: [PRICE PAIN / SAVINGS PROOF / OBJECTION KILLER]
Format: First line only (stop the scroll) — max 8 words — French — urgent tone.
Reference best performer: "Votre mutuelle santé vous coûte trop cher. 🔴"
```

**Then batch-create ads via MCP:** Claude writes the copy AND creates the ad in Ads Manager in one conversation.

### Step 4: Lead Quality Signal Loop (The Secret Weapon)

This is the single biggest lever most advertisers miss.

**The concept:** When a lead converts into a REAL customer (broker confirms it), send that signal back to Meta via CAPI. Meta then finds more people like your best customers — not just anyone who fills a form.

**The result (documented):** CPL rises 83% initially, then **cost-per-qualified-lead drops 54%** as Meta narrows to better prospects.

**How to build it for Ringassur:**

```
CURRENT FLOW:
Form submit → CAPI Lead event → Meta optimizes for "anyone who submits a form"

TARGET FLOW:
Form submit → CAPI Lead event
     ↓
Broker calls lead → Qualified? 
     ↓ YES
API call → CAPI "Purchase" event with lead value (20€)
     → Meta now optimizes for "people who become real customers"
```

**Implementation:**
1. Create a simple webhook endpoint in `/api/qualify-lead.js`
2. Broker confirms lead → hits your endpoint with lead phone/email
3. Endpoint fires CAPI "Purchase" event with value=20 (lead sell price)
4. After 2-4 weeks: Meta starts delivering higher-quality leads at lower CPL

### Step 5: Anthropic API — Automated Intelligence Layer

Build a lightweight Python/Node.js script using the Claude API that runs weekly:

```python
# Weekly intelligence report — runs every Monday 7am

import anthropic
import requests

client = anthropic.Anthropic(api_key="YOUR_KEY")

# 1. Pull last 7 days of Meta data via Graph API
meta_data = pull_meta_insights(account_id, date_range="last_7d")

# 2. Pull lead quality data from your CRM/broker feedback
lead_quality = pull_broker_feedback()

# 3. Ask Claude to analyze everything
message = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=2000,
    messages=[{
        "role": "user",
        "content": f"""
        Analyze this week's Ringassur Meta Ads performance:
        
        Campaign data: {meta_data}
        Lead quality feedback: {lead_quality}
        
        Output:
        1. Kill list (ad sets/ads to pause immediately with reason)
        2. Scale list (ad sets to increase budget with %)
        3. Top 3 winning creative angles this week
        4. 5 new hook variations to test next week
        5. Revenue estimate if we scale winning ad sets by 2x
        """
    }]
)

# 4. Send report to Telegram
send_telegram(message.content[0].text)
```

**Cost:** ~$0.10–0.50 per weekly report. Saves 10+ hours of manual analysis.

---

## PART 4 — FULL AI PIPELINE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                  RINGASSUR AI PIPELINE                   │
└─────────────────────────────────────────────────────────┘

LAYER 1 — DATA COLLECTION (Real-time)
├── Meta CAPI → fires on: PageView, ViewContent, Lead, Purchase
├── Pixel → fires in browser (redundant, deduped via eventId)
└── Telegram Bot → new lead notification with name + phone + age

LAYER 2 — DAILY AUTOMATION (8am every day)
├── Meta MCP → pull 24h performance data
├── Claude analysis → kill/scale signals
├── Auto-pause underperforming ads (via MCP write access)
└── Daily report → Telegram

LAYER 3 — WEEKLY INTELLIGENCE (Monday 7am)
├── Claude API → 7-day performance analysis
├── Creative fatigue detection (frequency > 3x = flag)
├── New hook generation (10 variants per angle)
├── Budget reallocation recommendations
└── Revenue projection → update weekly targets

LAYER 4 — LEAD QUALITY LOOP (Async, triggered by broker)
├── Broker confirms lead → hits /api/qualify-lead
├── CAPI fires "Purchase" event (value = 20€)
├── Meta updates algorithm → better lead quality
└── CPL decreases over 4-8 weeks

LAYER 5 — CREATIVE FACTORY (On-demand)
├── Claude generates hooks (30 sec)
├── HTML template → Chrome headless → PNG images
├── Batch upload to Meta via API
└── A/B test starts automatically

LAYER 6 — MONTHLY STRATEGY REVIEW
├── Claude API → full 30-day analysis
├── Update skill file with new learnings
├── Seasonal hook update (calendar-driven)
└── Revenue report → broker pricing negotiation data
```

---

## PART 5 — REVENUE SCALING ROADMAP

### Phase 1: Prove (Now → Month 1)
**Goal:** CPL < 15€ consistently, 10 leads/day

**Actions:**
- [ ] Reactivate "Leads génération 11" → 150€/day CBO
- [ ] Reactivate "37£" ad set (1.94€ CPL)
- [ ] Connect Meta MCP to Claude (10 min setup)
- [ ] Set up daily 8am monitoring schedule
- [ ] Launch Page Like campaign (5€/day, 14 days)
- [ ] Post 10 Instagram posts over 10 days

**Revenue:** ~5,000–8,000€/month selling leads at 15-20€ each

### Phase 2: Scale (Month 2-3)
**Goal:** 30+ leads/day, CPL < 10€

**Actions:**
- [ ] Implement lead quality signal loop (CAPI Purchase event)
- [ ] Build Claude API weekly analysis script
- [ ] Test Native Lead Form vs landing page (potentially -30% CPL)
- [ ] Add 15+ creatives per ad set
- [ ] Scale winning ad set to 500€/day
- [ ] Negotiate exclusive lead deals with 2-3 brokers at 25-30€/lead

**Revenue:** ~20,000–30,000€/month

### Phase 3: Automate (Month 4-6)
**Goal:** System runs itself, minimal manual work

**Actions:**
- [ ] Full AI pipeline live (daily auto-reports, auto-pause/scale)
- [ ] Claude generates new creatives weekly automatically
- [ ] Lead quality loop running → CPL dropping
- [ ] Expand to second niche (assurance-emprunteur or RC décennale)
- [ ] Build broker dashboard (they see leads in real-time, you track quality)

**Revenue:** ~50,000–80,000€/month

### Phase 4: Business (Month 6-12)
**Goal:** Lead brokerage agency with multiple niches

**Actions:**
- [ ] Hire 1 person to manage broker relationships
- [ ] Run Ringassur as a lead gen machine on 5+ niches
- [ ] Sell leads at exclusivity premium (25-40€/lead for senior mutuelle)
- [ ] Use Claude to build monthly broker performance reports automatically
- [ ] Potential: white-label the AI pipeline to other lead gen agencies

**Revenue:** 100,000-200,000€/month (agency model)

---

## PART 6 — IMMEDIATE NEXT ACTIONS (This Week)

### Priority 1 — Connect Meta MCP (10 minutes)
Go to Claude Desktop → Settings → Features → MCP → add `https://mcp.facebook.com/ads`
This unlocks the entire AI automation stack.

### Priority 2 — Reactivate Best Ad Sets (30 min in Ads Manager)
- Reactivate "37£" (1.94€ CPL) and "Tous les Metiers" (3.06€ CPL)
- Set 150€/day CBO on "Leads génération 11"
- Pause "84$" (0 leads) and "Compaigne leads 6g" (28.97€ CPL)

### Priority 3 — Deploy Tracking Fixes to Vercel (20 min)
The CAPI fixes we made (PageView + Lead timing) are on local files. Push to Vercel:
```bash
cd C:\Users\Elamr\Music\APPS\Ringassur
vercel deploy --prod
```

### Priority 4 — Build Lead Quality Loop (2-3 hours, one-time)
Add `/api/qualify-lead.js` endpoint → fired by broker when lead is confirmed
→ fires CAPI Purchase event with value=20€ → trains Meta on best leads

### Priority 5 — Test Native Lead Form (This week)
Create 1 ad set identical to "37£" but with Facebook Native Lead Form instead of landing page.
Run parallel for 7 days. Compare CPL + lead quality.

---

## PART 7 — KEY NUMBERS TO TRACK

| KPI | Kill | Hold | Good | Target |
|-----|------|------|------|--------|
| Blended CPL | >25€ | 15-25€ | 8-15€ | <5€ |
| CTR (link) | <0.5% | 0.5-1.5% | 1.5-3% | >3% |
| CPM | >35€ | 20-35€ | 10-20€ | <10€ |
| LPV→Lead rate | <2% | 2-5% | 5-10% | >10% |
| Lead quality rate | <20% | 20-50% | 50-70% | >75% |
| CAPI EMQ score | <4 | 4-6 | 6-8 | >8 |
| Leads/day | <5 | 5-15 | 15-30 | 50+ |
| Revenue/day | <50€ | 50-200€ | 200-600€ | 1000€+ |

---

## PART 8 — COMPETITIVE INTELLIGENCE

### What Top Competitors Do (LeLynx, Meilleurtaux, Santiane)

- **Santiane** (#1 in France): Runs 500+ active ads simultaneously. Pure volume creative testing.
- **Meilleurtaux**: Heavy native content / editorial format. Feels like an article not an ad.
- **LeLynx**: Price comparison table in the ad itself. Very direct.

### What You Can Do That They Can't

1. **Speed:** You can launch a new creative in 30 seconds with Claude. They have 5-person creative teams.
2. **Hyper-personalization:** Run different angles per age bracket (55-60 vs 65-75) — they run one-size campaigns.
3. **AI quality loop:** They still manually review leads. You can automate quality signals back to Meta.
4. **Agility:** You can test 10 new hooks this week. They have approval processes.

---

*This document auto-updates. Run `/meta-buyer` skill after each major campaign change to keep it current.*
