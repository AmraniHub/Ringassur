# Ringassur — Campaign Monitoring Plan

**Account:** act_2028742241382135 | Pixel: 1011230188058686
**Last updated:** 2026-05-23

---

## Option 2 — Daily Scheduled Report (8am)

Every morning at 8am, pull the last 24h of data from Meta API and get a structured report.

### What it pulls
- Spend, CPL, CTR, CPM, impressions per campaign
- Spend, CPL, CTR, CPM per ad set
- Top 3 and bottom 3 ads by CTR
- Total leads yesterday vs. 7-day average
- Budget utilization (spent vs. daily budget)

### How to run
Use `/schedule` skill with this prompt at 08:00 daily:

```
Pull yesterday's Meta Ads data for account act_2028742241382135.
Token: EAAS4NuaM4... (stored in session)
Report format:
- Total spend | Total leads | Blended CPL
- Per campaign: spend / leads / CPL / status
- Per ad set: CTR / CPM / CPL / verdict (SCALE / HOLD / KILL)
- Top creative by CTR
- Any kill/scale signals triggered
```

### API endpoint to hit
```
GET https://graph.facebook.com/v21.0/act_2028742241382135/insights
  ?fields=campaign_name,adset_name,spend,actions,cpm,ctr,impressions,reach
  &date_preset=yesterday
  &level=adset
  &access_token=...
```

---

## Option 3 — Alert Thresholds (Real-Time Triggers)

Conditions that require immediate action. Check against these every time you pull data.

### Red Alerts (pause immediately)

| Condition | Threshold | Action |
|-----------|-----------|--------|
| CPL too high | CPL > 30€ after 50€+ spend | PAUSE ad set |
| No leads | 0 leads after 3x daily budget | PAUSE campaign |
| CTR dead | CTR < 0.5% after 2,000 impressions | PAUSE ad |
| CPM spiking | CPM > 40€ | CHECK audience / narrow |
| Zero spend | Any active campaign with 0€ spend | CHECK billing/status |

### Green Lights (scale now)

| Condition | Threshold | Action |
|-----------|-----------|--------|
| CPL excellent | CPL < 8€ for 3 consecutive days | +25% budget |
| CTR strong | CTR > 2% with stable CPM | Duplicate ad set |
| Lead rate high | LPV-to-Lead > 6% | Increase budget |

### Weekly Kill/Scale Protocol (every Monday)
1. Pull 7-day: CPL, CTR, CPM per ad and ad set
2. Kill: CTR < 0.5% after 3,000+ impressions
3. Kill: CPL > 2.5x target (37.5€) after 3+ days
4. Scale: +25% budget if CPL < 15€ for 3 days straight
5. Add 2 new creative variations on winning angle
6. Update Learning Log in `skills/ringassur-mutuelle-skill.md`

---

## Current Campaign Priority Actions

### Immediate (do now)
- [ ] Reactivate "Leads génération 11" → 150€/day CBO
- [ ] Reactivate "37£" ad set (CPL 1.94€ — best ever)
- [ ] Reactivate "Tous les Metiers" ad set (CPL 3.06€)
- [ ] Pause "84$" ad set (0 leads)
- [ ] Pause "Compaigne leads 6g" (CPL 28.97€)

### This Week
- [ ] Build new consolidated campaign → sante3 (primary LP)
- [ ] 5 new static image ads: price pain angle
- [ ] Test Facebook Native Lead Form vs sante3 landing page
- [ ] Check CAPI Event Match Quality in Events Manager (after 7 days live)

---

## Tracking Issues — Status

| Issue | Fix | Status |
|-------|-----|--------|
| 1 — Event Match Quality unknown | Check Events Manager after 7 days | Informational — no code fix |
| 2 — CAPI Lead missing phone/name | Pass nom + telephone in fetch body | FIXED (was already done) |
| 3 — PageView not in CAPI | Add CAPI PageView call on page load | FIXED 2026-05-23 |
| 4 — Lead fires 800ms setTimeout | Move fbq Lead into CAPI .then() | FIXED 2026-05-23 |
