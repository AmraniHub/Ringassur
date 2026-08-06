# RINGASSUR — Error Log
## Every Mistake Made, Why It Happened, How It Was Fixed

**Rule:** Before making ANY recommendation for this account, read this file first.
**Updated:** 2026-05-24

---

## ERROR #001 — Campaign Fragmentation
**What went wrong:** 7 separate campaigns running simultaneously for the same LEADS objective.
**Why it happened:** Created a new campaign each time instead of adding to existing.
**Impact:** Campaigns competed against each other in the auction. CPM inflated. Budget split across 7 learning phases that never exited.
**Fix:** Consolidate into 1 CBO campaign, multiple ad sets inside it.
**Rule going forward:** ONE campaign per objective. Always. No exceptions.

---

## ERROR #002 — Budgets Too Small to Exit Learning
**What went wrong:** Multiple ad sets running at <20€/day.
**Why it happened:** Caution / testing mentality.
**Impact:** Ad sets stayed in "Learning Limited" indefinitely. Meta couldn't find 50 events/week. Algorithm never optimized.
**Fix:** Minimum 50€/day per ad set. For 10€ CPL target: need 50 leads/week = 500€/week minimum per ad set.
**Rule going forward:** Never launch an ad set below 50€/day. If budget is tight, run 1 ad set properly instead of 3 poorly.

---

## ERROR #003 — Manual Age Restriction Killed CPM
**What went wrong:** Set manual age targeting to 40-65 on an ad set.
**Why it happened:** Thought restricting to seniors would lower CPL.
**Impact:** CPM jumped to 56€. Andromeda can't find senior users efficiently when manually restricted — it relies on creative signals to do that automatically.
**Fix:** Remove age restriction. Use Broad + Advantage+. Let the creative attract the right age group naturally.
**Rule going forward:** Never manually restrict age on Meta for this niche. Broad always wins. Andromeda reads the creative and targets seniors automatically.

---

## ERROR #004 — CAPI PageView Missing
**What went wrong:** PageView event was tracked by pixel only — not sent to CAPI.
**Why it happened:** CAPI setup only handled Lead and ViewContent events initially.
**Impact:** Event Match Quality lower. Meta had fewer signals to match users server-side.
**Fix (2026-05-23):** Added PageView CAPI call on page load in all 3 landing pages (sante1, sante2, sante3).
**Rule going forward:** Every pixel event must have a matching CAPI call. PageView, ViewContent, Lead — all three, server-side.

---

## ERROR #005 — Lead Event Fired on setTimeout (800ms)
**What went wrong:** `fbq('track', 'Lead')` was inside `setTimeout(() => {...}, 800)` instead of inside the CAPI `.then()`.
**Why it happened:** Original code used a delay to "ensure CAPI fired first" — wrong approach.
**Impact:** Lead pixel event fired before CAPI confirmed. Race condition. Deduplication could fail. If CAPI failed silently, pixel Lead still fired → double counting or missed events.
**Fix (2026-05-23):** Moved `fbq Lead` inside CAPI fetch `.then()` and `.catch()` — fires after CAPI confirms, every time.
**Rule going forward:** Never use setTimeout for event sequencing. Always use `.then()` on the CAPI fetch.

---

## ERROR #006 — Phone and Name Not Hashed in CAPI
**What went wrong:** CAPI Lead event wasn't passing `ph` (phone) and `fn`/`ln` (name) fields.
**Why it happened:** Initial CAPI setup only included email.
**Impact:** Event Match Quality was low. Without phone hash, Meta can only match by email + IP + UA — much weaker signal.
**Fix (2026-05-23):** Added `ph`, `fn`, `ln` hashing to CAPI body in all 3 landing pages.
**Rule going forward:** Always pass every available PII field to CAPI — email, phone, first name, last name — all hashed SHA-256.

---

## ERROR #007 — Two Pixels Active Simultaneously
**What went wrong:** Old pixel 944605845074489 still referenced in capi.js as default, while new pixel 1011230188058686 was the active one.
**Why it happened:** New pixel created but old pixel not fully decommissioned in code.
**Impact:** Some events fired to old pixel, some to new. Inconsistent data. Learning phase fed by split signals.
**Fix:** New pixel 1011230188058686 is now the sole active pixel. Old pixel exists in code as fallback default but no pages use it.
**Rule going forward:** One pixel per project. When switching pixels, update ALL references in code before deploying. Check capi.js pixelId logic.

---

## ERROR #008 — Short-Lived Token Not Refreshed
**What went wrong:** Meta user access token expired (EAAS4NuaM4...) mid-session. Campaigns continued but CAPI events failed silently.
**Why it happened:** Used a user-level short-lived token (~1-2 hour lifespan) for CAPI calls.
**Impact:** CAPI events stopped firing. Event Match Quality score degraded. Meta had pixel-only data for that period.
**Fix:** Replaced with System User token (EAANhgmvr97k...) — never expires, scoped specifically to pixels.
**Rule going forward:** ALWAYS use System User tokens for CAPI — they never expire. User tokens are for API queries and manual tasks only. System User token is in Vercel env as META_CAPI_TOKEN_2.

---

## ERROR #009 — "84$" Ad Set Never Killed
**What went wrong:** Ad set "84$" ran with 11.14€ spend and 0 leads. Stayed active.
**Why it happened:** Not monitored daily. No kill rule enforced.
**Impact:** Wasted budget. Polluted campaign learning with zero-conversion signals.
**Fix:** Paused. Added to kill list.
**Rule going forward:** Kill rule is automatic: 0 leads after 3x daily budget spend → pause immediately. No exceptions.

---

## ERROR #010 — "Compaigne leads 6g" Never Killed
**What went wrong:** CPL of 28.97€ — nearly 3x target. Stayed active for multiple days.
**Why it happened:** Not monitored. No daily kill/scale protocol in place.
**Impact:** Wasted spend at 3x target CPL. Dragged up blended CPL.
**Fix:** Marked for pause.
**Rule going forward:** Kill rule: CPL > 30€ after 50€+ spend → pause same day. Check every morning.

---

## ERROR #011 — Multiple Campaigns Same Objective Competing in Auction
**What went wrong:** Campaigns "Leads génération 11", "Votre santé mérite", "LEADS NUMBER 2" and others all running simultaneously targeting same FR audience with same objective.
**Why it happened:** New campaigns created for each new idea instead of adding to existing.
**Impact:** Ringassur was bidding against itself. CPM artificially inflated. Each campaign got less data so none could exit learning.
**Fix:** Consolidate all into one CBO campaign.
**Rule going forward:** Before creating any new campaign, check: does a campaign with this objective already exist? If yes — add ad set inside it. Never create a competing campaign.

---

## ERROR #012 — Weak Hook "Votre santé mérite"
**What went wrong:** Campaign hook "Votre santé mérite" had CTR 0.76% and 0 leads.
**Why it happened:** Hook was aspirational/vague instead of pain-focused.
**Impact:** Below CTR kill threshold (0.5%) with no conversions. Wasted budget.
**Fix:** Killed. Replaced with price pain hooks.
**Rule going forward:** For mutuelle santé senior market — aspirational hooks NEVER work. Only pain hooks convert:
- ✅ "Votre mutuelle vous coûte trop cher"
- ✅ "80% des seniors paient trop cher"
- ❌ "Votre santé mérite le meilleur" — too vague, no pain, no urgency

---

## ERROR #013 — Vercel Deploy Failed (Network Timeout)
**What went wrong:** `vercel deploy --prod` timed out. ETIMEDOUT error.
**Why it happened:** Vercel CLI has network connectivity issues in this environment.
**Impact:** Code changes to landing pages (CAPI fixes) not deployed to production.
**Fix:** Must deploy via Vercel Dashboard (drag & drop) or via Git push if connected.
**Rule going forward:** When Vercel CLI fails → go to vercel.com/dashboard → Deployments → Redeploy. Or push to connected Git repo. Never assume CLI deployment worked without checking dashboard.

---

## SUMMARY TABLE

| # | Error | Cost | Fixed | Never Again |
|---|-------|------|-------|------------|
| 001 | 7 campaigns competing | High CPM, wasted budget | Consolidate to 1 | 1 campaign per objective |
| 002 | Budgets <20€/day | Never exited learning | Min 50€/day | Never go under 50€/day |
| 003 | Manual age 40-65 | CPM 56€ | Broad + Advantage+ | Never restrict age |
| 004 | PageView missing CAPI | Low EMQ | Added to all pages | All events need CAPI call |
| 005 | Lead in setTimeout | Race condition | Moved to .then() | Never setTimeout for events |
| 006 | No phone/name hash | Low EMQ | Added PII hashing | Always hash all PII fields |
| 007 | Two pixels active | Split data | One pixel only | One pixel per project |
| 008 | Short-lived token | CAPI silent fails | System User token | System User token only |
| 009 | "84$" not killed | 11€ wasted | Paused | Kill after 3x budget, 0 leads |
| 010 | "leads 6g" not killed | 28.97€ CPL | Marked for pause | Kill after CPL >30€ + 50€ spend |
| 011 | Campaigns competing | Self-bidding war | Consolidate | Add to existing, never new |
| 012 | Weak hook | 0 leads | Killed | Pain hooks only |
| 013 | Vercel CLI timeout | Not deployed | Use dashboard | CLI fails → use dashboard |
