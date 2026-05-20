# Research: Multi-Asset Derivative P&L Explain and Forensic Attribution

**Date**: 2026-05-19
**Author**: claude
**Status**: Research notes / external-domain reference. Not odd_sdlc governance content.

## Scope

Reference research for building a post-trade P&L attribution and forensic analysis system for multi-asset derivatives (equities, commodities, listed and OTC). Covers:

- pricing model landscape — which mathematical models cover which products
- computational trade representation — data models and schemas
- P&L Explain mechanics — HPL, RTPL, APL, FRTB PLA Test
- attribution decomposition — greeks-explain, factor models, Shapley
- breach detection and forensic drill-down
- open-source vs commercial landscape
- realistic build posture for a forensic-first system

This is not odd_sdlc governance material. It is reference research for a separate financial-systems project. Filed in `comments/` for future retrieval.

---

## Part 1: Pricing Model Landscape

Models split first by **asset class** and second by **what dimension of complexity needs to be modeled**.

### Equities

| Dimension | Workhorse models | Notable |
|---|---|---|
| Vol smile (static) | Dupire local volatility | Calibrates exactly to vanilla surface; fails for forward-smile products (cliquets, autocallables, forward-start) |
| Vol dynamics | Heston, SABR; rough Bergomi / rough Heston | Heston has closed-form via Fourier (Carr-Madan, COS). Rough vol fits short-dated smile better |
| Smile + dynamics combined | Local-stochastic volatility (LSV) | Industry default for equity and FX exotics. Dupire leaf + Heston-style backbone |
| Jumps / fat tails | Merton, Bates, Kou, Variance Gamma, CGMY | When gap risk matters — single names, credit-sensitive |

### Rates

| Dimension | Workhorse models | Notable |
|---|---|---|
| Single curve | Hull-White 1F/2F, G2++, Cheyette / quasi-Gaussian | Cheyette is the workhorse for callable structured rates |
| Full curve | LIBOR Market Model (BGM), SABR-LMM | Bermudan swaptions, CMS spread, multi-callable |
| Short rate (analytical) | Vasicek, CIR, Hull-White | Affine models, closed-form bond pricing |

### FX

Standard: stochastic-local-vol (SLV) with multi-factor rates. Used for triple-no-touch, PRDC, accumulators, quanto products.

### Credit

| Dimension | Workhorse models |
|---|---|
| Single name | Cox / intensity (Jarrow-Turnbull, Duffie-Singleton) — used for CDS, CDS options |
| Portfolio | Gaussian copula (market-standard one-factor for CDO tranches); Marshall-Olkin; top-down intensity |
| Structural | Merton, Black-Cox — equity-debt linkage |

### Hybrids

Multi-factor: equity LSV + Hull-White rates + Cox credit, correlated via Brownian correlation matrix or copula. Used for PRDC, equity-linked notes, CVA modeling.

### Counterparty / XVA

Monte Carlo exposure simulation under risk-neutral and historical measures. Computes CVA, DVA, FVA, KVA, MVA.

### Numerical methods (orthogonal to model choice)

- Monte Carlo with Longstaff-Schwartz for American/Bermudan exercise
- PDE / finite-difference for low-dimensional path-dependent
- Fourier methods (Carr-Madan, COS) for affine models with European payoffs
- AAD (algorithmic / adjoint differentiation) for greeks on complex MC

### Core tradeoff

**Fit-vs-dynamics.** Local vol fits any vanilla surface exactly but mis-prices forward-smile-sensitive products. Stochastic vol gets dynamics right but doesn't fit smile exactly. LSV is the compromise — pricier to calibrate but the industry default for any forward-smile exotic.

---

## Part 2: Commodity-Specific Structure

Commodities introduce phenomena equities don't have, requiring distinct models.

| Phenomenon | Why equities don't see it | Model that handles it |
|---|---|---|
| Storage cost + convenience yield | Equities have dividend yield; commodities have a state-dependent yield from owning physical | Gibson-Schwartz (stochastic convenience yield), Schwartz-Smith |
| Mean reversion to production cost | Equities trend; physical commodities pull back to marginal supply cost | Schwartz one-factor (Vasicek-like), Pilipovic, Lucia-Schwartz |
| Seasonality | Calendar-dependent supply/demand (gas heating, power AC, agricultural harvest) | Lucia-Schwartz (deterministic seasonal + mean reversion), Eydeland-Wolyniec |
| Forward curve dynamics | Contango/backwardation flips; multi-factor curve | Schwartz-Smith two-factor, Gabillon three-factor, Clewlow-Strickland (HJM-style) |
| Spikes / non-storable | Power especially — can't smooth via inventory | Jump-diffusion + regime-switching, Eydeland-Wolyniec, Hambly-Howison-Kluge |
| Spread structure | Calendar / location / crack / spark spreads with their own vol dynamics | Multi-factor with explicit correlation across forwards |
| Real / physical optionality | Storage, transport, power plant, mine all carry embedded options | Least-squares Monte Carlo over multi-factor forward curve |

### Two reference workhorses

- **Schwartz-Smith (2000)** for storables (oil, metals): short-term mean-reverting deviation + long-term Brownian equilibrium. Clean to calibrate, captures contango/backwardation, two-factor curve.
- **Clewlow-Strickland forward-curve model** for everything else: HJM-style direct modeling of the whole forward curve, multi-factor PCA-driven. Standard for energy trading.

For **power and gas** specifically: Eydeland-Wolyniec is the reference text. Combines mean reversion, seasonality, jumps, and regime switching. Black-76 is fine only for vanilla benchmarks.

### Real options layer

If commodities work includes physical asset valuation — storage, generation, transport, mining — value sits in optionality, not just spot dynamics:

- **Gas storage**: rolling intrinsic + extrinsic via LSMC over a multi-factor curve
- **Power plant (tolling)**: spark/dark spread call options, daily-exercisable Bermudan structure
- **Oil/gas reserves**: production-flexibility option on long-dated forward curve
- **Mining**: production cost vs commodity price, plus shut-down/restart option

References: Trigeorgis "Real Options"; Geman "Commodities and Commodity Derivatives".

---

## Part 3: Cross-Asset Hybrid Framework

For structured products spanning asset classes — commodity-linked notes, equity-linked commodity baskets, quanto products, power plant valuation with financing — a unified framework is required:

| Component | Model | Coupling |
|---|---|---|
| Equity leg | LSV (Dupire + Heston backbone) | Brownian correlation to other factors |
| Commodity leg | Schwartz-Smith or multi-factor forward curve | Brownian correlation; for power, regime-switching spikes stay independent |
| Rates leg | Hull-White 2F or G2++ (Cheyette if callable) | Correlates to short-rate factor of every other leg |
| FX leg (for quanto) | Stochastic local vol with rate-dependent drift | Correlated to both currencies' rates and the underlier |

Calibrate each leg to its own vanilla market, then estimate the **cross-asset correlation matrix** from historical data. This is usually the weakest link, since implied correlation isn't observable for most cross-asset pairs. For long-dated structured products (>5y), rate-equity and rate-commodity correlation can matter more than vol dynamics.

---

## Part 4: Computational Trade Representation

This is the **trade representation / instrument modeling** problem — distinct from pricing math. How to structure data so that any trade (vanilla → exotic, single-leg → multi-leg) can be canonically represented, priced, risk-analyzed, and reported.

### Industry-standard schemas

| Framework | What it is | When to use |
|---|---|---|
| **FpML** (ISDA) | XML schema for OTC derivative documentation. Covers IRD, FX, equity, credit, commodity. Verbose, comprehensive, used for confirmations and regulatory reporting | Interoperability with banks/dealers, regulatory reporting (CFTC, EMIR, MAS) |
| **ISDA CDM** (Common Domain Model) | FpML's successor — lifecycle-aware, event-driven, machine-readable. Same scope as FpML plus full lifecycle (novation, exercise, partial unwind) | New systems, lifecycle/event capture, smart-contract integration |
| **FIX 4.4 / FIX 5.0 + FIXatdl** | Order/execution wire protocol with multileg group support | Listed products, execution venues. Weak for OTC exotics |
| **ISO 20022** | Financial messaging | Settlement, payments, regulatory. Wrong shape for exotic economics |
| **DTCC GTR / Trade Repository schemas** | Reporting-only views | Mandated reports, not internal representation |

FpML is still the lingua franca for trade confirmations between banks. CDM is what to build a new system on — it is lifecycle-aware in a way FpML never was.

### Open-source library trade models worth studying

| Library | Trade model shape | Notable |
|---|---|---|
| **OpenGamma Strata** | `Trade` → `Product` → `ResolvedTrade` → `ResolvedProduct` separation; immutable Java | Cleanest open trade model. The Trade/Product/Resolved split is worth borrowing regardless of language |
| **QuantLib** | `Instrument` base class; one subclass per product type; pricing engine pluggable | Pricing-oriented; trade representation is thin |
| **JPMorgan Athena / Goldman SecDB** | Object database + dependency graph; trade is a node, market data are nodes, pricer is a function over nodes | Proprietary but heavily influential. See SecDB blog posts |
| **Apache Fineract** | Banking product hierarchy | Bank loan/deposit, not derivatives |

### Design choices that actually matter

| Decision | Options | Tradeoff |
|---|---|---|
| Product as enum or composition | Enum (one class per product) vs Legs+Observables (composable) | Enum is type-safe and pricer-friendly; composition scales to exotics without code changes |
| Payoff representation | Hardcoded product classes vs payoff DSL (expression tree of MAX/MIN/CONDITIONAL/BARRIER) | DSL handles arbitrary new exotics without recompile; hardcoded gives compile-time guarantees and faster pricers. Real systems use both |
| Resolution model | Inline market data refs vs resolve-at-pricing-time | Strata's Trade/ResolvedTrade split is the pattern: trade is symbolic ("USD-LIBOR-3M"); resolved trade has the actual fixing curve attached |
| Lifecycle | Versioned snapshots vs event log + projection | CDM uses event log; most systems use versioned snapshot. Event log is correct for novations/partial-unwinds; snapshot is operationally simpler |
| Multi-leg semantics | Single trade with N legs vs portfolio of N trades | Affects netting, P&L attribution, regulatory reporting. ISDA convention: economically-linked legs are one trade; strategies (call spread) are usually multiple trades |
| Identity | Trade ID, Deal ID, USI/UTI, External ID, allocation ID | Each serves a different system; trade ID is internal lifeline, USI/UTI is regulatory, deal ID groups related trades |

### Composable-leg pattern (most robust starting point)

```text
Trade
├── header: parties, trade date, status, IDs (internal, USI, external)
├── product: type discriminator + product body
│   └── product body
│       ├── legs: [Leg, Leg, ...]
│       │   └── each leg: notional schedule, rate, fixing, payment schedule
│       ├── observables: [Underlying, Underlying, ...]
│       ├── exercise schedule (if optionable): dates, style, decisions
│       └── payoff: hardcoded OR DSL expression
└── lifecycle: [event, event, ...] — booking → fixings → exercises → expiry/unwind
```

This shape captures:
- Vanilla swap: 2 legs (fixed + float), no observables beyond rates
- FX option: 1 leg, observable = FX rate, payoff = MAX(K - S, 0)
- Asian option: 1 leg, observable = average of fixings
- Knock-out call: 1 leg, observable = path, payoff = MAX(S - K, 0) if min(path) > B
- Autocall: N observation dates, redemption rules per date, residual payoff at maturity
- Spread option: 1 leg, 2 observables, payoff = MAX(S₁ - S₂ - K, 0)
- TARN: 1 leg, accumulating-coupon rule, target-redemption trigger
- Commodity swap: 2 legs, one floating against a commodity index average

### Hard problems most systems get wrong

1. **Mutable vs immutable trades.** Once a trade is booked, amendments should append events, not mutate. Most systems still mutate; the audit trail then drifts.
2. **Market data binding lifetime.** Same trade priced today vs tomorrow uses different fixings/curves. The trade representation should not hold market data; it should hold references the pricer resolves.
3. **Schedule generation.** Business day conventions, holiday calendars, stub periods, broken dates — not trade economics, but shared services. Separate schedule engine.
4. **Observable identity.** "USD-LIBOR-3M" is a market reference, not a fixing. Observables are types separate from their values.
5. **Payoff DSL vs hardcoded at scale.** Most shops end up with both: DSL for new exotics, hardcoded fast paths for the top 20 liquid products. Picking one and pretending the other doesn't exist always breaks.
6. **Allocations and give-ups.** A single executed deal can split across multiple internal books, sub-accounts, or counterparties. Trade ID alone won't model this — needs a separate allocation/allocation-result layer.
7. **Cancellation vs unwind vs novation vs partial unwind.** These are different events with different P&L and regulatory consequences. CDM models them explicitly; ad-hoc systems usually conflate them.

---

## Part 5: Post-Trade P&L Explain

The regulated and operational framework for explaining daily P&L on derivatives books.

### Three P&Ls per trade per day

| P&L | Definition | Source |
|---|---|---|
| **Actual P&L (APL)** | What the desk's books say P&L was | Front office MTM revaluation + cashflows + fees + new trades |
| **Hypothetical P&L (HPL)** | SOD positions priced at EOD market, no new trades, no fees | Full pricer rerun with frozen positions |
| **Risk-theoretical P&L (RTPL)** | SOD positions, explained as Σ (sensitivity × factor move) | Sensitivity ladder × market move vector |

### Breach detection sits in the gaps

- **APL − HPL** = new trades + intraday adjustments + fees + financing + manual booking corrections. Large → stale book / late bookings / wrong dates.
- **HPL − RTPL** = model error. Missing risk factors, second-order greeks, non-linear effects. Large → sensitivity model can't track its own pricer.
- **APL vs limit** = stop-loss / desk limit breach.
- **HPL − RTPL distributional test** = FRTB's **PLA Test** — Kolmogorov-Smirnov and Spearman correlation between the two series. Red zone = desk loses Internal Models Approach capital treatment and falls to the more punitive Standardized Approach.

### Attribution decomposition

A single day's RTPL breaks into Taylor-series buckets. For equities + commodities + derivatives this typically looks like:

```text
Δprice ≈
  + Theta × Δt                          # time decay (deterministic)
  + Delta · ΔS                          # first-order spot/forward
  + ½ Gamma · ΔS²                       # second-order spot
  + Vega · Δσ                           # first-order vol
  + ½ Volga · Δσ²                       # second-order vol
  + Vanna · ΔS · Δσ                     # cross spot-vol
  + Rho · Δr                            # first-order rate
  + Σ DV01_i · Δr_i                     # rate curve buckets
  + Σ CS01_i · Δspread_i                # credit spread buckets (if credit)
  + Carry / coupon accrual              # deterministic cashflows
  + Dividends                           # equity-specific
  + Roll P&L                            # commodity-specific
  + Cross-currency basis                # FX-specific
  + Lifecycle events                    # barrier hit, autocall, exercise
  + Residual (unexplained)              # everything else
```

For each trade: precompute the sensitivity vector at SOD; then RTPL = sensitivities · (EOD market − SOD market) plus deterministic theta/carry. Residual is the model's failure to explain.

### The mapping model

The trade representation needs to expose three views, not just one:

```text
Trade
├── economics: legs, observables, payoff, lifecycle (canonical model from Part 4)
├── pricing view → produces MTM given market data
│     used for: APL, HPL
└── risk view → produces sensitivity vector against canonical risk factors
      used for: RTPL, attribution buckets, breach drill

Position = Trade × valuation_date → { MTM, cashflows-to-date, greeks, lifecycle_state }

RiskFactor (typed, bucketed)
├── rate curve point (CCY × tenor)
├── vol surface point (underlier × strike × tenor)
├── spot (equity ticker, commodity forward, FX pair)
├── dividend (ticker × ex-date)
├── credit spread (issuer × tenor)
└── commodity-specific (forward curve point, basis point, seasonality factor)

MarketSnapshot = { RiskFactor → value } at a specific timestamp
MarketMove = MarketSnapshot_EOD − MarketSnapshot_SOD

Sensitivity = ∂MTM/∂RiskFactor, computed at SOD via AAD, bump-and-revalue, or analytic

PnLAttribution = Position × period →
  { theta, delta_by_factor, gamma, vega_by_factor, ..., new_trades, fees, residual }

Breach = PnLAttribution → { kind, severity, threshold, drill_path }
```

Three properties matter:

1. **Risk factors are typed and bucketed once**, system-wide. Otherwise greeks at 5y can't be combined with moves at 4y.
2. **Sensitivities are time-stamped to SOD**, not "current". Greeks staleness is the dominant source of false residuals.
3. **Lifecycle events** (barrier hits, autocall triggers, fixings) generate non-Taylor jumps; they need to be admitted into attribution as their own bucket, not absorbed into residual.

---

## Part 6: Breach Detection and Explanation

### Breach taxonomy

| Breach type | Detection | Most common cause |
|---|---|---|
| **Unexplained P&L** | \|residual\| / \|APL\| > θ | Stale greeks, missing risk factor coverage, large move triggering convexity (gamma) the model ignored |
| **Risk limit breach** | net Δ, V, DV01, CS01 > desk limit | Position growth, market move exposing pre-existing exposure |
| **Stop-loss breach** | cumulative APL < -L | Loss event |
| **PLA test red zone** | KS test p-value or Spearman ρ outside tolerance | Model risk — desk's sensitivity model can't track its own pricer |
| **APL vs HPL drift** | \|APL − HPL − new_trades − fees\| > θ | Late bookings, wrong trade dates, manual amendments not flowed |
| **Aged trade** | trade has no fresh greek or lifecycle update | System failure, missing fixing, broken feed |
| **Lifecycle gap** | barrier observation date passed but no event recorded | Fixing not pulled, schedule mis-specified |

### Breach explanation drill path

```text
1. Decompose total residual by trade        (which trades drive it?)
2. For top trades, decompose by risk factor (which factors drive it?)
3. For top factors, check:
   - Did the factor move beyond local linearity?  → gamma/volga
   - Is the greek stale?                          → SOD vs current
   - Is there a missing factor?                   → unmapped move
   - Was there a lifecycle event?                 → not in Taylor expansion
   - Was a trade amended/cancelled?               → APL vs HPL gap
4. Output: ranked list of (trade, factor, contribution, suspected cause)
```

Pivot the same residual by trade / leg / risk factor / desk / counterparty until the explanation lands.

### Common defects worth designing against

1. **Greek-market timestamp drift.** Greeks computed at SOD vs market moved at intraday tick — residual emerges as artefact. Lock greeks to a specific snapshot ID.
2. **Risk factor taxonomy churn.** New tenor bucket added but old positions' greeks don't have it — they bleed into residual.
3. **Convexity ignored for vanilla products.** Long-dated bonds, equity options near strike, FX options near barriers — first-order Taylor fails.
4. **Lifecycle event in unexplained bucket.** Barrier hits, autocalls, exercise decisions are step changes. Must be a named attribution bucket, not residual.
5. **Multi-leg netting at attribution time.** A spread trade nets to small delta but each leg has large delta. Attribution at trade-net level loses the explanation when one leg's market moves a lot.
6. **Cross-asset correlation moves.** Equity-rate, commodity-FX cross-greeks aren't always available; if booked as residual, correlated breaches appear across the desk on big macro days.
7. **Aged trades and orphan positions.** Trades that match no booking, fixings that match no trade, expired-but-not-rolled positions. Build a reconciliation tier before attribution.
8. **FRTB-specific gotchas.** NMRF (non-modellable risk factors) need separate treatment; standardized vs internal models have different attribution shapes; PLA test runs per-desk with real capital cost in red zone.

---

## Part 7: Forensic Attribution

Forensic attribution shifts the build/buy calculation. It is not a real-time pipeline — it is analyst-driven, backward-looking, hypothesis-test-shaped. The Python data stack covers much more of it than it does for real-time daily explain.

### How forensic differs from daily P&L explain

| Aspect | Daily P&L explain | Forensic attribution |
|---|---|---|
| Time horizon | T → T+1 | Days to months |
| Latency | Same-day, often before market open T+1 | No urgency |
| Driver | Operational ("explain today's number") | Hypothesis ("why did we lose $X over period Y") |
| Audience | Desk, P&L control, risk | Trader, head of desk, model risk, audit, regulator |
| Output | Daily attribution + breach flags | Narrative + ranked contributors + counterfactuals |
| Tooling | Production pipeline | Notebooks, ad-hoc queries, interactive drill |
| Reproducibility | "Today's snapshot" | Must reproduce 6 months later — snapshot pinning is critical |

### Methodologies — typically several in parallel

| Method | When useful | Notes |
|---|---|---|
| **Greek-based Taylor decomposition** (theta + delta + gamma + vega + vanna + volga + rho + carry + lifecycle + residual) | Always, as baseline | Sum daily attributions over period. Residual is the model's failure to explain |
| **Factor model attribution** (Barra-style: exposures × factor returns) | Equity-heavy directional books | Can be built from PCA on returns if no vendor factor model |
| **Counterfactual / what-if** ("hold X constant, vary Y") | Hypothesis testing — "if vol hadn't spiked, P&L would have been ___" | Replay engine with one input pinned |
| **Shapley attribution** | Non-linear pricers where Taylor breaks down (deep ITM/OTM exotics, knocked-in/out structures) | Order-independent. Computationally expensive but rigorous for exotics. SHAP library helps |
| **Hedge effectiveness decomposition** | "Was the hedge wrong, or was the risk wrong?" | Split position into directional + hedge legs; attribute each separately. Most common forensic bombshell |
| **Time-series cumulative attribution** | Multi-day investigations | Stack daily attribution; identify whether loss built over time or single event |
| **Strategy-vs-residual decomposition** | "Was this skill (alpha) or exposure (beta)?" | Strategy returns regressed against benchmark/factor returns |

Baseline three: **Taylor + counterfactual + time-series cumulative**. Bring in others when these three don't explain.

### Common forensic findings

The investigation typically concludes one of:

1. **Market move beyond model** — gamma/convexity not captured, vol regime change
2. **Stale risk** — greeks not refreshed, missed lifecycle event
3. **Wrong booking** — trade economics didn't match confirms, dates off
4. **Missing factor** — a risk factor existed in P&L but not in attribution
5. **Hedge mismatch** — delta-hedged but vega-exposed
6. **Correlation breakdown** — cross-asset move not modeled
7. **Operational error** — manual amendment, missed fixing, broken feed
8. **Strategy P&L misattributed** — "alpha" was actually beta

---

## Part 8: Open-Source Landscape

No end-to-end open source covers post-trade P&L explain or forensic attribution. The pricing/greek primitives are well covered; the attribution and breach engine is the thing every bank builds in-house. Commercial vendors (Murex PLA, Calypso PL Explain, Bloomberg MARS PnL, Numerix Oneview, FIS Front Arena) charge for exactly this gap.

### What is available at each layer

| Layer | OSS option | What it gives | What still has to be built |
|---|---|---|---|
| Instrument economics + pricer | QuantLib (C++, broad bindings), FinancePy (Python, academic), gs-quant (Python, GS-flavored), Strata (Java, modern) | MTM, vanilla greeks per instrument | Multi-leg structuring, exotic payoffs, trade schema |
| Sensitivities + scenarios | OpenGamma Strata, ORE (built on QuantLib) | Bump-and-revalue or AAD greeks; scenario engine | Risk factor taxonomy/bucketing, sensitivity storage |
| Portfolio simulation / XVA / VaR | ORE | Exposure cubes, MC simulation, basic VaR | Daily SOD/EOD plumbing |
| Trade schema | ISDA CDM (REGnosys Rosetta reference impl, open source) | Canonical data model, lifecycle events | Mapping from source systems |
| Market data + curves | QuantLib, Strata, ORE | Yield curves, vol surfaces | History/snapshot store, EOD process |
| Performance attribution (equity Brinson) | `empyrical`, `pyfolio`, `quantstats` | Sector/security P&L for equity portfolios | Wrong problem — this is asset allocation attribution, not derivative greeks explain |
| **P&L attribution (HPL/RTPL/APL with greeks explain)** | **Nothing comprehensive in OSS** | — | All of it |
| **Breach detection + drill-down** | Nothing | — | All of it |

### Forensic-specific tooling (more readily available)

| Layer | OSS option | Forensic value |
|---|---|---|
| Data manipulation | pandas, polars, DuckDB | Workhorse — most forensic work is pivots, joins, groupbys |
| Snapshot-based storage | Parquet + DuckDB, TimescaleDB, Arctic (MAN AHL tick store, OSS) | Pin market data + positions + greeks by snapshot ID |
| Notebook environment | Jupyter, Marimo | Analyst surface; reproducible if snapshot IDs versioned |
| Visualization | Plotly, Bokeh, Altair, perspective.js (desk-grade pivot table in Jupyter) | Drill-down + time-series, near-commercial quality |
| Shapley values for non-linear attribution | `shap` library | Designed for ML but works for any function — use on pricer(market) |
| Risk factor decomposition | scikit-learn (PCA, regression), statsmodels | Build a factor model from returns if no vendor Barra |
| Performance attribution (equity Brinson) | `pyfolio`, `empyrical`, `quantstats` | If part of the book is directional equity |

For forensic specifically, the gap to commercial is smaller. A skilled quant analyst with Strata-or-ORE + Jupyter + DuckDB reproduces most of what Bloomberg MARS PnL or Murex PLA Explorer offers, less polished.

### Recommended foundations

- **ORE (Open Source Risk Engine)** — closest to a complete OSS foundation. C++, built on QuantLib. Strong on rates/FX/credit; weaker on equity exotics and commodities. Used in production by some smaller banks and asset managers.
- **OpenGamma Strata** — cleanest modern API but Java-only and rates/FX-focused. Equity coverage thinner; commodity coverage essentially none.
- **QuantLib + custom layer** — maximum Python ergonomics; more glue code required.
- **gs-quant** — Python-friendly for rates/FX/some equity; tied to Goldman's product universe.

For **commodities specifically**: open source is thin. Commodities are mostly handled in commercial systems. Building custom forward curve models, seasonality, regime-switching for power is unavoidable for any meaningful commodity coverage.

---

## Part 9: Architecture for a Forensic-First System

```text
┌──────────────────────────────────────────────────┐
│  Snapshot store (DuckDB / Parquet / Arctic)      │
│  - market data by (date, factor) → value         │
│  - positions by (date, trade_id) → state         │
│  - trades by (trade_id, event_seq) → event       │
│  - greeks by (date, trade_id, factor) → ∂price   │
│  Every record carries a snapshot_id              │
└──────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│  Replay engine                                   │
│  - given (date_range, portfolio_filter, scenario)│
│  - reconstruct positions, prices, greeks         │
│  - drives Taylor / counterfactual / Shapley      │
│  - wraps QuantLib/Strata/ORE pricers             │
└──────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│  Attribution layer (DataFrame-shaped)            │
│  - one row per (date, trade, leg, factor)        │
│  - columns: actual_pnl, explained, theta,        │
│    delta_pnl, gamma, vega, ..., residual         │
│  - pivots: by date, factor, trade, desk          │
└──────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│  Forensic notebook surface                       │
│  - pre-built analysis templates                  │
│  - hypothesis logging                            │
│  - reproducible (pinned snapshot_id + code rev)  │
└──────────────────────────────────────────────────┘
```

The attribution layer being a **wide DataFrame** is the central design choice. Once a DataFrame exists with one row per (date × trade × leg × factor) and columns for each attribution bucket, every forensic question becomes a pivot/groupby/filter. Analysts can drive it from notebooks without back-end changes.

### Build vs assemble — components

For a forensic-only system (not daily real-time explain):

| Component | Build? | Notes |
|---|---|---|
| Snapshot store | Build (small) | DuckDB + Parquet, versioned by snapshot_id |
| Pricer integration (Strata or ORE) | Reuse | Map trade canonical to instrument types |
| Greeks computation pipeline | Reuse + thin wrapper | Bump-and-revalue using the pricer; AAD if speed matters |
| Attribution DataFrame builder | Build | Taylor decomposition is mechanical once greeks + moves are aligned |
| Counterfactual engine | Build (small) | Trivial once replay engine exists |
| Forensic notebooks | Build | Each new investigation is a notebook |
| Shapley wrapper | Reuse (`shap`) + thin wrapper | Useful for exotics |
| Hedge-effectiveness decomposition | Build | Strategy-specific per-desk template |
| Trade canonicalization | Build | Source-systems-specific |
| Risk factor taxonomy | Build | Has to match trade universe and desk reporting |

### Effort posture

Forensic is substantially less work than daily real-time explain because there are no production reliability constraints, no SLA, no breach-detection rule engine for non-analysts, and no operational UI. It is a data product, not a service. The pieces reuse heavily from OSS Python tooling.

For multi-asset coverage including commodities, the build effort concentrates in:

1. Commodity-specific pricers (forward curves, seasonality, spikes) — OSS thin
2. Risk factor taxonomy unification across asset classes
3. Mapping trade sources into the canonical representation
4. Investigation templates per recurring question (weekly desk review, limit breach drill, hedge effectiveness)

---

## Open Questions

These pin down the next-step direction:

1. **Is the use case regulatory (FRTB PLA test) or internal (desk explain only)?** Regulatory adds strict definitions of HPL/RTPL and the KS/Spearman tests; internal allows custom thresholds.
2. **Are greeks already produced by an upstream pricer**, or do they need to be computed? If upstream, the model is mostly normalization + attribution + breach-rules. If not, the trade economics need enough detail to bump-and-revalue.
3. **What's the breach granularity** — trade-level, leg-level, factor-level, desk-level? This determines the explain pivot shape and how greeks need to be stored.
4. **Multi-asset coverage** — equities + commodities + rates need different sensitivity taxonomies. Unified risk-factor type system is required for cross-asset explanations.
5. **Commodity depth** — vanilla forwards/swaps vs deep commodity exotics (power, storage optionality, real options on physical assets). The latter doubles the build footprint.
6. **Team size and timeline** — a small analyst-led team can build a forensic-first system on OSS foundations. A larger pricing/risk system with real-time PLA test compliance has different posture.

---

## References

### Pricing — equities, rates, FX, credit, hybrids

- Hull, "Options, Futures, and Other Derivatives" — standard textbook
- Andersen & Piterbarg, "Interest Rate Modeling" (three volumes) — comprehensive
- Gatheral, "The Volatility Surface" — local + stochastic vol
- Bergomi, "Stochastic Volatility Modeling" — modern stochastic vol, rough vol
- Schönbucher, "Credit Derivatives Pricing Models"

### Commodities

- Schwartz, "Stochastic Behavior of Commodity Prices" (1997)
- Schwartz & Smith, "Short-Term Variations and Long-Term Dynamics in Commodity Prices" (2000)
- Eydeland & Wolyniec, "Energy and Power Risk Management" — reference for power/gas
- Clewlow & Strickland, "Energy Derivatives: Pricing and Risk Management"
- Geman, "Commodities and Commodity Derivatives"
- Pilipovic, "Energy Risk"
- Trigeorgis, "Real Options" — physical asset valuation

### Trade representation

- ISDA FpML specification — fpml.org
- ISDA CDM and REGnosys Rosetta reference implementation — github.com/REGnosys
- OpenGamma Strata documentation — opengamma.com/strata
- QuantLib documentation — quantlib.org

### P&L Explain and FRTB

- BCBS d457, "Minimum capital requirements for market risk" (2019, updated 2023) — Basel FRTB framework with the PLA Test
- ISDA papers on PLA test implementation
- Risk.net practitioner articles on attribution edge cases

### Open-source

- ORE (Open Source Risk Engine) — github.com/OpenSourceRisk/Engine
- OpenGamma Strata — github.com/OpenGamma/Strata
- QuantLib — quantlib.org
- gs-quant — github.com/goldmansachs/gs-quant
- FinancePy — github.com/domokane/FinancePy
- SHAP — github.com/shap/shap

---

## End notes

This is reference research, not ratified work. It captures the landscape and design choices for someone building post-trade P&L attribution and forensic analysis on multi-asset derivatives, including commodities. The architecture in Part 9 is the recommended starting point if forensic is the primary use case. The open questions in the prior section pin down the next-step decision.

The conversation that generated this research moved through: pricing models → commodity-specific → cross-asset hybrid → trade computational representation → P&L Explain → forensic attribution → OSS landscape. The final framing (post-trade forensic) is the most actionable; daily-real-time and regulatory-FRTB add operational scope but reuse the same attribution mechanics.

---

## Appendix A: Coal Markets — Concrete Trade, Desk, Counterparty Model

**Scope narrowing.** Existing trade and risk system feeds raw data; the PnL system maps that data into a canonical model for attribution. Coal is the first target. The model below is the concrete shape of trades, desks, counterparties, risk factors, and attribution buckets for a coal book. The general framework in Parts 4-9 still applies; this appendix specializes it.

### Coal-specific structural facts that drive the model

| Dimension | Why it matters for attribution |
|---|---|
| **Thermal vs metallurgical** | Different benchmarks, different consumers, different quality specs. Met coal has additional specs (CSR, fluidity, vitrinite) and trades at much higher premia |
| **Quality spec on the cargo** | Calorific value (GAR/NAR), sulfur, ash, moisture, volatile matter. Realized price = benchmark ± quality differential — quality P&L is its own attribution bucket |
| **Benchmark multiplicity** | API2 (ARA), API4 (Richards Bay), Newcastle gC NEWC (Australia thermal), API5, API6 (Russia), API8 (China), Argus McCloskey assessments. PLV / TSI for met coal. Every position is against *one specific* benchmark; basis between benchmarks is a tradeable risk |
| **Physical vs paper** | Physical = cargo, FOB/CIF/DES, vessel-bound, demurrage. Paper = futures (ICE API2/API4, SGX Newcastle, CME), swaps, options. Most desks run both; hedge effectiveness lives in the gap |
| **Freight** | Capesize / Panamax / Supramax. Realized landed price = FOB + freight. Freight is a separate risk factor and trades on its own (Baltic indices). FFA hedging is standard |
| **Pricing periods** | Cargoes price on month-of-loading or month-of-discharge averages (Asian-style settlement against an index). Pricing period mismatches between physical and paper hedge create basis P&L |
| **INCOTERMS** | FOB, CIF, CFR, DES, DAP determine where risk transfers and what costs sit in P&L (freight, insurance, demurrage) |
| **Storage and weathering** | Limited storage; coal degrades (especially thermal). Inventory P&L includes weathering loss, sometimes 1-3% per month |
| **Carbon / environmental** | EU ETS, sulfur regulations, country-specific. Affects realized economics of consumption, often hedged separately |

### Trade model

Discriminated union over physical and paper, sharing the common header.

```text
Trade
├── trade_id                      # internal lifeline
├── usi                           # regulatory ID
├── trade_date, effective_date
├── trade_status                  # active | exercised | expired | cancelled | novated
├── desk_ref                      → Desk
├── trader_ref
├── counterparty_ref              → Counterparty (or two refs if intermediated)
├── book_ref                      # for P&L attribution
├── source_system_ref             # which T&R system this came from
├── source_trade_id               # ID in source system, for reconciliation
│
├── product                       # discriminated union
│   ├── PhysicalCargo { ... }
│   └── PaperTrade { ... }
│
├── observables                   # which RiskFactors this trade is sensitive to
└── lifecycle_events              # append-only event log
```

#### PhysicalCargo

```text
PhysicalCargo
├── coal_type                     # thermal | met_hard | met_semisoft | PCI | anthracite
├── quality_spec
│   ├── calorific_value           # kcal/kg GAR | kcal/kg NAR | BTU/lb (with basis)
│   ├── sulfur_pct
│   ├── ash_pct
│   ├── total_moisture, inherent_moisture
│   ├── volatile_matter
│   ├── met_specs                 # csr, csi, fluidity, vitrinite (met coal only)
│   └── quality_adjustment_formula   # how spec deviations translate to $/MT
│
├── parcel
│   ├── nominal_size_mt
│   ├── tolerance_pct             # typical ±10%
│   ├── actual_delivered_mt       # set on bill of lading
│   └── lot_count
│
├── delivery
│   ├── incoterm                  # FOB | CIF | CFR | DES | DAP
│   ├── load_port_ref
│   ├── discharge_port_ref
│   ├── laycan_start, laycan_end
│   ├── vessel
│   │   ├── nominated_size        # capesize | panamax | supramax
│   │   ├── tbn_or_named          # "to be nominated" | imo_number
│   │   └── eta_arrival, etb_berth
│   ├── demurrage_rate_per_day
│   └── despatch_rate_per_day     # half of demurrage typically
│
├── price_formula
│   ├── kind                      # fixed | index_linked | formula
│   ├── benchmark_index_ref       # → RiskFactor (API2, Newcastle, ...)
│   ├── pricing_period            # month_of_bl | month_of_arrival | named_month
│   ├── premium_discount_per_mt
│   ├── quality_adjustment_ref    # → quality_adjustment_formula above
│   ├── freight_handling          # included | excluded | basis_freight_route
│   ├── settlement_currency
│   └── payment_terms             # days from BL, LC, prepayment
│
├── certificates
│   ├── load_quality_certificate
│   └── discharge_quality_certificate
│
└── claim_status                  # any quality / weight claims under dispute
```

#### PaperTrade

```text
PaperTrade
├── instrument_kind               # futures | swap | option | basis_swap | crack_spread | freight_swap_ffa
├── benchmark_index_ref           # → RiskFactor
├── periods                       # list of monthly settlement periods
│   └── (period_start, period_end, notional_mt, fixed_price | strike | leg_pair)
├── direction                     # buy | sell (per period if differs)
├── option_terms                  # type, exercise_style, asian_avg_or_european (often Asian for coal)
├── settlement                    # cash | physical_delivery (rare)
├── clearing                      # cleared (ice_clear | lch | cme) | bilateral
├── exchange_ref                  # ICE | CME | SGX | OTC
└── master_agreement_ref          # ISDA | EFET (European coal often EFET)
```

#### Lifecycle events

Coal trades have more event types than vanilla derivatives. The append-only log captures:

- `booked`, `confirmed`, `amended`, `cancelled`, `novated`, `partial_unwound`
- `vessel_nominated`, `vessel_loaded`, `bl_issued`, `arrived`, `discharged`
- `load_quality_certificate_received`, `discharge_quality_certificate_received`
- `pricing_period_fixed`, `invoice_issued`, `paid`
- `quality_claim_raised`, `quality_claim_settled`, `demurrage_invoiced`, `demurrage_settled`
- For paper: `fixing_set`, `exercised`, `expired`, `physical_delivery_taken`

Each event becomes an attribution input. Quality claim → quality P&L bucket. Demurrage → freight/logistics. Pricing period fix → realized vs forecast pricing.

### Desk model

Coal desks split along three axes. Capture the hierarchy explicitly:

```text
Desk
├── desk_id
├── parent_desk_ref               # hierarchy for roll-up
├── product_class                 # thermal | met | freight | mixed
├── region                        # atlantic | pacific | global
├── function                      # origination | trading | structured | logistics | hedging
├── reporting_currency
├── trading_book_classification   # bank book | trading book (matters for FRTB/IFRS)
├── limits
│   ├── delta_per_benchmark       # MT or $/bps per curve
│   ├── basis_limit_pairs         # API2-API4, API4-Newcastle, etc.
│   ├── freight_limit_routes      # Capesize routes
│   ├── physical_position_mt
│   ├── counterparty_concentration
│   ├── tenor_buckets             # front month, prompt quarter, calendar year
│   └── stop_loss_pnl
├── attribution_buckets_enabled
└── books                         # one desk has many books (origination, paper, etc.)
```

Typical taxonomy for a mid-sized coal trading operation:

```text
Coal Trading Group
├── Thermal Atlantic (origination + trading)
├── Thermal Pacific (origination + trading)
├── Metallurgical (mostly origination)
├── Freight Desk (Capesize/Panamax FFAs and physical)
└── Structured / Basis Desk (cross-benchmark, quality, location plays)
```

Attribution drill needs both **by desk** (operational reporting) and **by book within desk** (origination losing vs paper hedging winning) — they tell different stories.

### Counterparty model

Coal counterparties are concentrated; credit exposure matters. Utility / mill defaults have historically been the largest single-event losses.

```text
Counterparty
├── counterparty_id               # internal
├── legal_entity_name
├── lei                           # 20-char ISO LEI
├── parent_group_ref              # → Counterparty (group-level)
├── country
├── sector                        # utility | steel_mill | trading_house | producer | bank | broker
├── credit_rating
│   ├── internal                  # bank's internal rating
│   ├── external                  # S&P / Moody's / Fitch
│   └── watchlist_status
├── credit
│   ├── credit_limit              # by notional, by exposure
│   ├── tenor_limits              # max tenor for new trades
│   ├── current_exposure          # PFE, EPE — from risk system
│   ├── csa_ref                   # Credit Support Annex (collateral terms)
│   └── netting_set_ref
├── master_agreement_ref          # ISDA, EFET (European coal default), bilateral
├── allocations                   # for give-ups and sub-accounts
└── kyc_status                    # active | suspended | exited
```

Two views matter for attribution:

- **By legal entity** — actual credit exposure, regulatory reporting
- **By parent group** — economic concentration (all Glencore subsidiaries roll up)

A trade carries the counterparty *legal entity* ref; the attribution layer joins to group for concentration analysis.

### Risk factor taxonomy for coal

This is the load-bearing integration point. A consistent typed structure across the desk lets cross-curve and cross-asset attribution work.

```text
RiskFactor (discriminated union)
├── CoalBenchmarkCurve
│   ├── benchmark                 # api2 | api4 | newcastle_gc_newc | api5 | api6 | api8 | plv | tsi_*
│   ├── coal_type                 # thermal | met
│   ├── tenor                     # month_1 | month_2 | ... | quarter_1 | cal_+1 | cal_+2
│   └── currency                  # usd typically
│
├── QualityDifferential
│   ├── benchmark_base            # which curve this differential sits against
│   ├── spec_axis                 # calorific | sulfur | ash | csr | ...
│   └── spec_value                # 6000 kcal/kg, 1.0% sulfur, etc.
│
├── LocationBasis
│   ├── pair                      # (api2, api4), (api4, newcastle), ...
│   └── tenor
│
├── FreightRoute
│   ├── vessel_class              # capesize | panamax | supramax
│   ├── route_id                  # C5 (W. Aus → Qingdao), C7 (Bolivar → ARA), P2A, etc.
│   └── tenor
│
├── FXRate
│   ├── pair                      # usd_eur, usd_jpy, usd_cny, usd_inr (consumers)
│   └── tenor                     # spot, forward
│
├── InterestRate
│   ├── currency
│   └── tenor                     # for financing P&L
│
└── CarbonCost
    ├── scheme                    # eu_ets | uk_ets | china_ets
    └── tenor
```

The taxonomy must be **stable across desks** — same benchmark/tenor bucketing system-wide so a position's greeks at the Cal-26 Newcastle point can be matched to today's Cal-26 Newcastle move. Curve calibration (interpolating M1, M2, M3 prompt months into a tenor curve) is a separate concern.

### Attribution buckets specific to coal

Daily/period attribution for a coal book breaks into more buckets than the generic Taylor decomposition. The additional buckets are where forensic value sits.

| Bucket | What it captures | When it's the answer |
|---|---|---|
| **Benchmark price P&L** (Δ benchmark forward × notional) | Pure directional move on the position's benchmark | Standard delta P&L |
| **Quality differential P&L** | Realized spec vs assumed quality premium/discount | "We thought it was 6000 kcal NAR, it loaded at 5750" |
| **Basis P&L (location)** | API2-API4, API4-Newcastle moves on a basis position | Cross-benchmark basis traders |
| **Calendar spread P&L** | M1-M2, Q1-Q2, prompt vs cal year | Roll positions |
| **Freight P&L** | Capesize/Panamax move vs hedged or assumed freight | Realized landed cost diverged from plan |
| **FX P&L** | USD vs reporting currency on USD-denominated positions | Quanto/translation P&L |
| **Carry / financing P&L** | Cost of holding physical or unrealized paper position | Inventory holding cost |
| **Demurrage P&L** | Vessel delays at load or discharge | Port congestion, weather, vessel-side delays |
| **Storage / weathering P&L** | Inventory loss, calorific degradation | Long-held thermal inventory |
| **Pricing-period P&L** | Realized monthly average vs forward-priced expectation | "We sold at trailing month's average, market collapsed in last week" |
| **Hedge basis P&L** | Paper hedge vs physical realized | Hedge effectiveness post-mortem |
| **Lifecycle P&L** | Discrete events: cancellations, quality claims settled, vessel substitution | One-off items |
| **New trades / unwinds in period** | Trades booked or closed during attribution window | New trade impact |
| **Fees and commissions** | Brokerage, clearing, exchange | — |
| **Residual** | Unexplained | Model gap |

The **hedge effectiveness** bucket (paper hedge vs physical realized) is almost always the most forensically interesting in coal. Common patterns:

- Hedged on Newcastle, sold on a Newcastle-derived index with a quality discount → quality differential bled
- Hedged on month-of-trade-date but priced on month-of-loading (often 2-3 months later) → pricing-period basis loss
- Hedged on cleared API2 future but cargo was a CIF Rotterdam delivery with embedded freight at fixed rate → freight P&L on the physical leg
- Hedged tonnage but parcel under-loaded within tolerance → notional mismatch

### Common attribution edge cases in coal

1. **Pricing period mismatch.** Physical priced on month-of-arrival average; hedge placed against month-of-trade. The basis between those two months is unhedged. Common, large, and often misattributed to "market move".
2. **Quality vs index basis.** Index is for a specific spec (e.g., API2 = 6000 kcal NAR, 1% sulfur). Cargo loaded at different spec gets a contractual adjustment; if the adjustment formula and the market-implied differential diverge, that's a quality basis P&L.
3. **Demurrage as a P&L category.** Vessel delays can wipe out trade margin. Whether demurrage sits in trade P&L or freight desk P&L depends on the desk model — model it explicitly.
4. **Term contract embedded options.** Long-term offtake/supply contracts often have embedded options (renewal, price reset, volume flex). These need to be modeled separately or they sit in residual.
5. **Quality claim cycle.** Quality claims raised on discharge can be settled months later. The trade is "closed" but P&L is still being adjusted. Lifecycle event log handles this if claims are events.
6. **Freight included vs excluded.** CIF/CFR/DES contracts have freight bundled; FOB doesn't. Same cargo at same benchmark realizes very different net prices depending on INCOTERM. Don't average them naively.
7. **Trader vs hedge desk allocation.** Origination desk sources cargo, hedge desk takes the price risk via paper. Allocating attribution between them needs explicit transfer pricing — otherwise origination looks unprofitable and hedge desk looks like genius.
8. **Cleared vs bilateral basis.** Cleared ICE API2 futures and bilateral OTC API2 swaps trade at slightly different effective prices (clearing fees, margin financing). On big books this matters.
9. **Spread positions netted at trade level.** A trader's long API2/short API4 spread shows as small net delta to either benchmark; if attribution nets at trade level you lose the leg-level explanation when one side moves.
10. **Daily vs settlement-period attribution.** Most paper coal contracts settle monthly. Daily MTM uses forward curve marks; final settlement uses the actual average. Daily attribution may diverge from settled P&L over the pricing period — reconcile at settlement.

### Industry data sources to map

- **Argus Coal Daily International** — daily assessments across benchmarks, quality differentials, freight
- **S&P Global Platts** — competing assessments, news, market reports
- **ICE** — API2, API4 cleared futures and options settlement prices
- **SGX (Singapore)** — Newcastle thermal futures, met coal futures
- **CME** — Newcastle, API2, API4 contracts
- **Baltic Exchange** — freight indices (BCI, BPI, BSI, BHSI)
- **EU ETS** — carbon price (EEX, ICE)
- **Local exchanges** for Chinese (Zhengzhou ZCE), Indian (MCX) coal where relevant

Each provides a different feed shape. Mapping into the canonical RiskFactor taxonomy is the load-bearing integration work — get the (benchmark, tenor, snapshot_date) triple right and the attribution math is straightforward.

### Open-source vs commercial reality for coal

Coal is **substantially less well-served** by OSS than rates / FX / equity:

- QuantLib, Strata, ORE — no coal-specific instruments. Coal swaps modeled as generic commodity swaps, losing quality / freight specifics.
- gs-quant — no coal coverage.
- Commercial coal trading systems: **Allegro / Aspect (ION)**, **Triple Point (now Aspect)**, **OpenLink (ION)**, **Endur (OpenLink)**, **Murex** for derivatives only, **Eka Software**. These dominate the commercial space.

For a P&L attribution system specifically (not a full ETRM), the OSS stack is more usable because positions and greeks are consumed from an upstream system rather than computed. The work is:

- canonical model (the schemas above)
- mapping from the existing T&R system
- attribution decomposition (DataFrame-shaped, as in Part 9)
- analyst notebooks for forensic drill

### Direction for the next step

Most blocking decisions to pin first:

1. **Field-level schema** — formalize the Trade / Desk / Counterparty schema in the chosen language (TypeScript types, Pydantic models, Avro schema, etc.) and define the mapping from the existing T&R system. This is the most concrete next step.
2. **Risk factor taxonomy** — pin the benchmark list, tenor bucketing, and quality differential structure. Load-bearing integration.
3. **Attribution buckets** — decide which coal-specific buckets each desk needs (basis, quality, freight, demurrage, pricing-period) and how to compute each from upstream data.
4. **Lifecycle events** — enumerate the event types the T&R system emits and map to the canonical event log.
5. **Reference data** — counterparty hierarchy, desk hierarchy, benchmark / curve metadata. Often the messiest part of the mapping.

The three load-bearing prerequisites for any attribution math working at all are: (1) trade schema with stable IDs reconciling to source, (2) risk factor taxonomy with consistent benchmark / tenor bucketing, (3) snapshot-pinned market data and greeks. Everything else is straightforward DataFrame work once those three are stable.

---

## Appendix B: Cascading Attribution Architecture — F_D → F_P → F_H

**Solution shape for the Appendix A scenario.** Existing trade and risk system feeds raw data; PnL system maps to the canonical model from Appendix A and runs forensic breach attribution. The architecture is three layers:

1. **Domain data layer** (Appendix A) — typed records for `Trade`, `PhysicalCargo`/`PaperTrade`, `Desk`, `Counterparty`, `RiskFactor`, `AttributionRow`. Carries field-level types, units, validation. External to GTL.
2. **GTL module** (this appendix) — workflow, cascade routing, governance. Models the lifecycle and the multi-stage attribution.
3. **ABG runtime** — event-sourcing, replay, snapshot binding, provenance. Every stage output is an admitted event.

### Architectural commitment

The runtime path is **F_D end-to-end**. F_P enters only when F_D cannot close. F_H enters only when F_P cannot decide. Every escalation costs more and is rationed by F_D inability. This matches the bootloader rule "Deterministic truth closes first wherever possible" applied at the workflow level, not just per-evaluator.

The attribution pipeline itself contains no per-obligation semantic judgment of `A.req_i → B.result_i` — there is nothing for F_P to do inside the pipeline. F_P sits at one specific synthesis point (S3), and F_H sits at the ratification point (S4). Both are explicit, bounded, and feed back into F_D rules for the next run.

### The four-stage cascade

#### S1 — F_D broad breach detection

| | |
|---|---|
| Input | `AttributionRow` (one per trade × period × leg × factor; carries greeks, market moves, bucket decomposition) |
| Operators | `apply_universal_thresholds`, `check_arithmetic_invariants`, `check_referential_integrity`, `check_reconciliation`, `check_coverage_gaps`, `check_staleness` |
| F_D evaluators | Every check returns pass/fail with mechanical evidence; identities (Σ buckets ≈ total P&L; APL − HPL − new_trades − fees ≈ 0) hold within ε |
| Output | `BreachCandidate { breach_id, breach_kind, trade_ref, period, magnitude, mechanical_evidence_refs }` |
| Cascade | breach → S2; no breach → terminal close on row |

Cheap, universal, runs over every row. Catches the dominant majority of coal-book breaches: threshold violations, reconciliation gaps, arithmetic conservation failures, FK integrity, aged greeks. Most "unexplained P&L" is caught and explained here.

#### S2 — F_D model overlay detection

| | |
|---|---|
| Input | `BreachCandidate` from S1 |
| `CandidateFamily<Overlay>` | `ConvexityOverlay`, `CrossGreekOverlay`, `LifecycleOverlay`, `QualityDifferentialOverlay`, `FreightBasisOverlay`, `HedgeEffectivenessOverlay`, `ShapleyOverlay`, `PricingPeriodOverlay`, `DemurrageOverlay` |
| Operators | `select_applicable_overlays_for_breach`, `apply_overlay` (per selected), `reduce_residual_additively` |
| F_D evaluators | Each overlay is deterministic; reduced residual is well-defined; overlay applicability is pattern-matched by product/desk/factor, mechanical |
| Output | `ResolvedBreach { breach_id, applied_overlays, reduced_residual, overlay_evidence_refs, state }` where state ∈ `"resolved_by_overlay" \| "remains_unexplained"` |
| Cascade | remains_unexplained or magnitude > θ → S3; resolved_by_overlay → terminal close on breach |

The load-bearing F_D layer for forensic value. Coal-specific overlays — quality differential, freight basis, pricing-period basis, hedge-pair decomposition, demurrage — convert most "unexplained" residuals into explained-by-overlay closures.

`CandidateFamily` is the right GTL mechanism here: each overlay is a lawful alternative over the common outer contract `Overlay(BreachCandidate) → ResidualReduction`. Adding a new overlay is admitting a new family member, not rewriting the language.

#### S3 — F_P probability synthesis

| | |
|---|---|
| Input | `ResolvedBreach[state="remains_unexplained"]` or magnitude > escalation_threshold |
| Operators | `gather_breach_signals` (from S1 + S2 + historical comparables), `synthesize_hypotheses` |
| F_P evaluator | Probabilistic ranking with explicit uncertainty bounds and supporting evidence refs |
| Output | `HypothesisRanking { breach_id, ranked_hypotheses: [(cause, probability, evidence_refs, confidence_interval)], synthesis_method, synthesis_provenance }` |
| Cascade | top probability > confidence_floor AND magnitude < escalation_threshold → emit explanation, candidate close; otherwise → S4 |

Hypothesis space for coal forensic is finite and named: `market_regime_change`, `operational_error`, `model_inadequacy`, `hedge_mismatch`, `counterparty_event`, `data_quality_issue`, `lifecycle_drift`. F_P synthesizes across S1+S2 signals to rank them.

The architecture feedback applies sharply: **F_P output is candidate evidence, not authority.** Every hypothesis carries supporting evidence refs (back to S1/S2 mechanical signals), an explicit confidence interval, and a declared `synthesis_method` (Bayesian net / learned classifier / agent reasoning) so the synthesis itself is audit-trackable. Promotion from candidate hypothesis to ratified cause is S4's job, not S3's.

#### S4 — F_H human evaluation

| | |
|---|---|
| Input | `HypothesisRanking[escalated]` |
| Operators | `present_to_reviewer`, `capture_judgment` |
| F_H evaluator | Human ratification with institutional context |
| Output | `RatifiedExplanation { breach_id, confirmed_cause, remediation_action, reviewer_id, timestamp, notes, supersedes_hypothesis_id }` |
| Cascade | Terminal — emits to event log; feedback to rule store |

Remediation actions are themselves typed: `amend_trade`, `update_mapping_rule`, `recalibrate_model`, `adjust_threshold`, `extend_overlay_coverage`, `escalate_to_credit`, `no_action`. Each remediation is admitted as an event; the projection over events updates the rule store / threshold registry / overlay registry for the next pipeline run.

### Feedback loop — the eventual-consistency steel thread

Without the S4 → rule-store loop, the cascade is static. With it, every F_H ratification is a one-way ratchet that moves a class of breaches from F_P/F_H back into F_D:

```text
S4 ratifies "this breach was a quality differential underestimate"
  → admitted event: rule_added (
       kind=quality_differential_overlay,
       spec=met_coal_csr_below_60,
       threshold=$0.50/MT
     )
  → next pipeline run: S2 catches similar pattern,
    emits resolved_by_overlay
  → S3 / S4 no longer invoked for this pattern
```

F_P+F_H resolve ambiguity once → write a rule → F_D handles it deterministically forever. New product, new market regime, new hedging pattern — each becomes a one-time F_P/F_H pass, then F_D handles the class going forward. The system accumulates institutional knowledge as ratified rules.

Replay is preserved because every stage output and every rule update is an admitted event with timestamp and provenance. A breach in 2026-08 shows its full lineage: S1 detected it, S2 applied convexity + lifecycle overlays, S3 synthesized 60% model_inadequacy + 30% data_quality, S4 ratified data_quality, remediation was update_mapping_rule. Six months later, similar breaches close at S2 because of that ratification.

### GTL module shape

```text
Module: post_trade_attribution

# Stage 1 — universal mechanical detection
GraphFunction<s1_broad_breach_detection>
  inputs:  AttributionRow
  vectors: 
    apply_thresholds → check_invariants → check_integrity 
                                        → check_reconciliation
  evaluator: F_D (
    Rule[arithmetic_identity],
    Rule[FK_integrity],
    Rule[threshold_breach]
  )
  outputs: BreachCandidate*

# Stage 2 — model overlay decomposition
CandidateFamily<Overlay> {
  ConvexityOverlay, CrossGreekOverlay, LifecycleOverlay,
  QualityDifferentialOverlay, FreightBasisOverlay,
  HedgeEffectivenessOverlay, ShapleyOverlay,
  PricingPeriodOverlay, DemurrageOverlay
}

GraphFunction<s2_model_overlay_detection>
  inputs:  BreachCandidate
  vectors:
    select_overlays → fan_out(apply_overlay) 
                    → fan_in(reduce_residual) 
                    → classify_state
  evaluator: F_D (
    Rule[overlay_determinism],
    Rule[residual_additivity]
  )
  outputs: ResolvedBreach

# Stage 3 — probabilistic synthesis (only when F_D can't close)
GraphFunction<s3_probability_synthesis>
  inputs:  ResolvedBreach[state="remains_unexplained" ∨ magnitude > θ]
  vectors:
    gather_signals → synthesize → rank → emit_with_bounds
  evaluator: F_P (
    synthesis_method declared,
    confidence bounds required,
    candidate-evidence framing
  )
  outputs: HypothesisRanking

# Stage 4 — human ratification
GraphFunction<s4_human_evaluation>
  inputs:  HypothesisRanking[escalated]
  vectors:
    present_to_reviewer → capture_judgment → emit_ratification
  evaluator: F_H
  outputs: RatifiedExplanation

# Cascade routing — itself F_D
Job<post_trade_attribution_run>
  route:
    AttributionRow → s1
    s1.BreachCandidate → s2
    s2.ResolvedBreach[unexplained ∨ over_threshold] → s3
    s3.HypothesisRanking[uncertain ∨ critical] → s4
    s4.RatifiedExplanation → admitted_event → rule_store

Role: pnl_control, model_risk_reviewer, desk_head
  # F_H reviewer role binding for s4
```

### Sharpening notes before implementation

1. **S2 → S3 escalation threshold is policy, applied as F_D.** Set explicitly per desk / product / magnitude. If too high, important breaches drop through to S3 unnecessarily; if too low, S3 sees noise. Calibrate from historical labels.
2. **S3 synthesis method is a Module-level decision.** Three lawful candidates: Bayesian network (interpretable, requires prior), learned classifier (good with labeled data, opaque), agent reasoning (LLM-driven, requires evidence-chain audit). Pick one to start, declare the choice, change via F_P repricing.
3. **S4 needs a defined reviewer interface.** What the reviewer sees determines whether ratification is genuine or stamp-approval. At minimum: the breach + ranked hypotheses + full evidence chain back to S1. Most F_H value lives in the UI.
4. **Rule store needs versioning.** When S4 ratifies a new overlay rule, it has an effective date. Replaying historical attribution must use the rule version effective at that date, not current. Without this, replay reconstructs different breaches than what was originally flagged.
5. **Cascade is acyclic per run, cyclic across runs.** Within one pipeline run S1 → S2 → S3 → S4 is a DAG. Across runs, S4's rule emissions feed S1/S2. ABG event-sourcing handles this naturally — the projection at run-time uses the projection at run-time's timestamp. Worth being explicit that "DAG" only holds intra-run.
6. **Coverage gaps need a pre-check.** If a factor moves but no greek exists at all, S1 can't see it (no row to evaluate). The coverage check should run *before* S1 — assert every factor with a non-trivial move has at least one greek somewhere in the position set. Otherwise breaches hide in the absence of rows.

### Why this fits the scenario

The Appendix A scenario gives the architecture clean inputs:

- Existing T&R system is the **upstream source** — emits raw trade events, market data, greeks. F_D mapping pulls them into the canonical model from Appendix A.
- Canonical Trade / Desk / Counterparty / RiskFactor records are the **typed domain data** — separate from GTL, expressed in the schema language of choice (Avro, Pydantic, TS types).
- AttributionRow is the **wide DataFrame core** — one row per (date × trade × leg × factor) with all attribution buckets as columns. Computed deterministically from Trade + market snapshots + greeks. F_D end-to-end.
- The cascade above runs over AttributionRow output.

The runtime path is fully deterministic — every breach is recomputable from admitted events + market snapshots + the rule store at that timestamp. Forensic drill is replay over admitted truth. F_P sits at one specific synthesis point; F_H sits at one specific ratification point; everything else is mechanical.

The remaining engineering is concrete and bounded: write the operators per stage, declare the overlays in S2's CandidateFamily, pick the S3 synthesis method, build the S4 reviewer UI, version the rule store. No novel substrate work required — GTL/ABG already covers workflow, lifecycle, event-sourcing, projection, replay, and the F_D/F_P/F_H evaluator regimes. The substrate fits.

---

## Appendix C: Generalization — Asset-Class Modules over a Common Cascade

**Coal is the first instance, not the architecture.** Appendix A's domain data model and Appendix B's cascade are asset-class-agnostic. Specialization happens at four named extension points, all of which GTL handles natively without changing the cascade.

### The four extension points

| Extension point | GTL mechanism | What it specializes |
|---|---|---|
| **Product subtypes** | `CandidateFamily<Trade.product>` | `PhysicalCargo` / `PaperTrade` for coal; `IRS` / `Swaption` / `FRA` for rates; `Option` / `Forward` / `Swap` for FX; `CDS` / `CDX` / `CDO` for credit. The outer `Trade` header is shared |
| **Overlay family members** | `CandidateFamily<Overlay>` in S2 | Coal adds `QualityDifferentialOverlay`, `FreightBasisOverlay`, `DemurrageOverlay`, `PricingPeriodOverlay`. Equities add `DividendOverlay`, `SkewOverlay`, `EarningsEventOverlay`. Rates add `BasisSwapOverlay`, rates-specific `ConvexityOverlay`. Each overlay stays F_D in isolation |
| **RiskFactor kinds** | Discriminated union in the typed schema layer | `CoalBenchmarkCurve` is coal's. Add `EquityForwardCurve`, `VolSurfacePoint`, `CreditSpreadCurve`, `RatesForwardCurve`, etc. Cross-asset factors (`FXRate`, `InterestRate`, `CarbonCost`) are shared |
| **Hypothesis space at S3** | F_P synthesis configuration per Module | Generic hypotheses (market regime, operational error, model inadequacy, hedge mismatch, counterparty event, data quality, lifecycle drift) cover most cases. Asset-specific additions: `corporate_action_unhandled` (equities), `credit_event_unrealized` (credit), `rate_curve_kink_unhedged` (rates), `quality_underestimate` (coal) |

Plus per-Module configuration of thresholds, reviewer roles, lifecycle event vocabulary, and settlement conventions.

### Module composition pattern

A base Module + one Module per asset class:

```text
Module: attribution_base
  # asset-class-agnostic
  publishes:
    GraphFunction<s1_broad_breach_detection>
    GraphFunction<s2_model_overlay_detection>
    GraphFunction<s3_probability_synthesis>
    GraphFunction<s4_human_evaluation>
    Job<post_trade_attribution_run>            # cascade routing
    CandidateFamily<Overlay> with generic members:
      ConvexityOverlay, CrossGreekOverlay, ShapleyOverlay,
      HedgeEffectivenessOverlay, LifecycleOverlay
    Generic hypothesis kinds for S3
    Generic RiskFactor kinds: FXRate, InterestRate

Module: coal_trading
  imports: attribution_base
  extends:
    Trade.product CandidateFamily ← { PhysicalCargo, PaperTrade }
    Overlay CandidateFamily ← {
      QualityDifferentialOverlay, FreightBasisOverlay,
      DemurrageOverlay, PricingPeriodOverlay
    }
    RiskFactor kinds ← {
      CoalBenchmarkCurve, QualityDifferential,
      LocationBasis, FreightRoute
    }
    S3 hypotheses ← + { quality_underestimate, freight_basis_drift, demurrage_unhedged }
    Lifecycle events ← + {
      vessel_nominated, bl_issued, quality_claim_raised, ...
    }
  publishes:
    Role: thermal_atlantic_desk, met_origination_desk, freight_desk
    Module-specific thresholds, reviewer assignments

Module: rates_trading
  imports: attribution_base
  extends:
    Trade.product CandidateFamily ← { IRS, Swaption, FRA, BasisSwap }
    Overlay CandidateFamily ← {
      CurveBucketOverlay, VolSurfaceOverlay, ConvexityRatesOverlay
    }
    RiskFactor kinds ← {
      RatesForwardCurve, SwaptionVolSurface, BasisSpread
    }
    ...

Module: equity_derivatives
  imports: attribution_base
  extends:
    Trade.product CandidateFamily ← {
      VanillaOption, ExoticOption, Variance, Forward, BasketOption
    }
    Overlay CandidateFamily ← {
      DividendOverlay, SkewOverlay, EarningsEventOverlay,
      CorporateActionOverlay
    }
    RiskFactor kinds ← {
      EquityForward, VolSurfacePoint, DividendCurve
    }
    ...
```

Each asset-class Module **adds members** to the open extension points without rewriting the base. The cascade GraphFunctions, the F_D/F_P/F_H regime structure, the event-sourced lifecycle, and the replay machinery are reused unchanged.

### Cross-asset desks need shared RiskFactor type space

A desk trading coal + freight + FX hedging needs all three Modules' RiskFactor kinds visible in the same taxonomy. Two lawful approaches:

1. **Common factor Module** publishes the cross-asset factors (FX, rates, carbon, freight where shared between coal and shipping). Asset-class Modules import and extend.
2. **Module union at the Job level** — the attribution Job for a multi-asset desk references multiple Modules and the RiskFactor types compose by union.

GTL's `same_object` algebra operator is the mechanism for declaring "the same `FXRate` factor is referenced across multiple Modules" — keeps cross-asset attribution coherent without duplicating the factor.

### What extends cleanly vs needs care

**Extends cleanly:**

- Cascade structure (S1 → S2 → S3 → S4) — works for any asset class
- Event log and replay — asset-class-agnostic by construction
- F_D/F_P/F_H regime split — same semantics everywhere
- Threshold/limit/reconciliation invariants at S1 — universal
- Generic overlays (Convexity, CrossGreek, Shapley, HedgeEffectiveness, Lifecycle) — work everywhere
- Rule store + feedback loop — same mechanism

**Needs care:**

- **Physical vs paper asymmetry varies by asset class.** Coal has a rich `PhysicalCargo` with vessel/quality/laycan. Equities have no analog (cleared-equity is paper-only). Rates are entirely paper. The `Trade.product` discriminated union must allow asset classes where the physical leaf doesn't exist.
- **Lifecycle event vocabulary is per-Module.** No shared event taxonomy across asset classes — coal's `vessel_nominated` and equities' `dividend_ex_date` don't unify. Each Module declares its own.
- **Reviewer role binding is per-Module.** Coal forensic reviewer ≠ rates forensic reviewer; F_H role binding stays inside the asset-class Module.
- **Settlement conventions differ.** Coal cargoes settle on monthly averages with pricing-period basis; rates settle daily with fixings; equities settle T+2 with corporate actions. The settlement model is per-Module even if the cascade is shared.
- **S3 hypothesis space grows asymmetrically.** Generic hypotheses cover most cases, but each asset class accumulates its own characteristic failure modes over time as S4 ratifications feed back to the rule store.

### Onboarding a new asset class

Given the architecture, adding a new asset class is a Module-authoring task:

1. Declare Product subtypes — the `CandidateFamily<Trade.product>` members
2. Declare RiskFactor kinds for the asset class
3. Declare overlays as new `CandidateFamily<Overlay>` members for asset-specific decompositions
4. Configure thresholds, settlement conventions, lifecycle events
5. Map source-system feed into the canonical model — F_D mapping rules
6. Define reviewer Roles for F_H escalation
7. Reuse the base cascade unchanged

The cascade GraphFunctions, the event sourcing, the replay engine, the reviewer interface — all base infrastructure stays put.

### Architectural payoff

The reason this generalizes cleanly is that **F_D-throughout-runtime is asset-class-agnostic**. Every asset class's attribution pipeline is mechanical arithmetic over typed records. The differences are in vocabulary (product types, factors, overlays, lifecycle events), not in regime or workflow. GTL's `Module` + `CandidateFamily` mechanisms are exactly the extension surfaces that let vocabulary differ without changing the workflow.

The eventual-consistency steel-thread also generalizes: every asset class's S4 ratifications feed *its own* rule store, but the loop mechanism is shared. New asset class onboarding inherits the loop for free.

Coal becomes the proving instance. Once the cascade is exercised end-to-end on coal — with the full overlay set, F_P synthesis tuned, F_H reviewer flow in place, and the rule-store feedback loop demonstrated — the same substrate carries oil/gas, power, rates, equity derivatives, credit, and any future asset class through the same shape. The architecture earns its breadth one Module at a time, with the cascade and runtime never touched.

---

## Appendix D: Implementation Stack

**The runtime stack for the architecture in Appendices A-C.** GTL/ABG carries workflow and governance; the data path runs on Node + DuckDB + Parquet with Postgres carrying operational state. The split is principled: analytical/historical data flows columnar; transactional/workflow state stays row-oriented.

### Data scale and the threshold for distributed compute

Most P&L attribution workloads fit single-node columnar engines comfortably. The honest rule of thumb:

| Daily data volume | Fit | Why |
|---|---|---|
| Up to ~100 GB / day | Node + DuckDB or Polars on a single beefy machine | Modern columnar engines saturate 64-128 GB RAM; analytical queries finish in seconds. Most commodity desks live here |
| 100 GB – 1 TB / day | Node + DuckDB partitioned by date, or Node → ClickHouse | DuckDB still works with date partitioning. ClickHouse if native clustering is preferred |
| 1 – 10 TB / day | ClickHouse, Trino, BigQuery, Snowflake | Distributed analytical DB or cloud warehouse. Spark possible but overkill for query-shaped workloads |
| 10+ TB / day | Spark, Trino, large warehouse | Genuine distributed compute. Petabyte-scale ETL territory |

For the architecture as scoped (coal first, extensible to other asset classes), the realistic ceiling is the first row. The biggest table is `AttributionRow` (trades × factors × periods), and that's still single-machine workload with columnar storage. Spark is rarely the right starting point.

### Node ecosystem — production-ready building blocks

| Library | What it gives | Notes |
|---|---|---|
| `@duckdb/node-api` | Embedded analytical SQL, reads/writes Parquet natively, queries TBs from disk | The workhorse. Same engine that Python notebooks hit — single SQL source of truth |
| `nodejs-polars` | Rust-backed DataFrame API with multi-threaded execution | Similar performance to DuckDB; use if DataFrame API fits the code style better than SQL |
| `apache-arrow` (Arrow JS) | Columnar in-memory format, zero-copy interop with Python/JVM | The interchange format for crossing language boundaries without serialization cost |
| `parquetjs` | Pure-JS Parquet read/write | Slower than DuckDB's native Parquet; use only when native bindings can't be loaded |
| `worker_threads` (built-in) | CPU-parallel JS workers | For embarrassingly parallel ops like per-trade greek computation |
| `node:stream/web` | Streaming primitives | For chunked ETL from upstream feeds |
| `bullmq` + Redis | Job queue for stage dispatch | If S1/S2/S3 stages are run as queued jobs across multiple worker processes |
| `pg` / `postgres` | Postgres client | For operational state — rule store, reviewer workflow, configuration |
| `onnxruntime-node` | ONNX model inference | For S3 learned-classifier synthesis if going the ML route |

DuckDB is the most-leveraged choice. It changes the calculus on "do I need a separate analytical database":

- Reads Parquet natively — no ingest step
- Vectorized execution, SIMD, parallel by default
- Single process, no operational overhead
- Same SQL dialect as analytical warehouses
- Interop with Python via Arrow (zero-copy)

A single DuckDB-on-a-fat-host query against partitioned Parquet outperforms many Spark clusters on the forensic queries this architecture will run.

### Postgres vs DuckDB — what carries which surface

Same SQL feel, opposite architectures. Postgres is OLTP row-oriented client-server; DuckDB is OLAP column-oriented embedded. The split for this system:

| Surface | Storage | Why |
|---|---|---|
| Rule store (versioned overlay rules, thresholds, mapping rules) | **Postgres** | Many small writes from S4 ratifications, versioned, needs transactional integrity, lives a long time |
| Reviewer workflow state (open / in-review / ratified / remediation queue) | **Postgres** | Concurrent reviewers, transactional state changes, operational alerting |
| User / role / desk assignments | **Postgres** | Standard operational data |
| Configuration (thresholds per desk, hypothesis spaces per Module) | **Postgres** | Read by every pipeline run; updated transactionally |
| Trade canonical model (current state) | **Postgres** or **DuckDB on Parquet** depending on edit pattern | If trades arrive and amend transactionally, Postgres. If lifecycle events append cleanly, Parquet + DuckDB queries |
| Lifecycle event log (append-only) | **Parquet partitioned by date** | Append-only time-series; columnar query wins |
| Market data snapshots (RiskFactor × value × snapshot_id) | **Parquet partitioned by date** | Pure columnar time-series; predicate pushdown |
| Greeks (position × factor × snapshot_id) | **Parquet** | Wide table, scanned heavily, written once per snapshot |
| AttributionRow (the wide DataFrame) | **Parquet** | Largest table, query-heavy, never updated after computation |
| BreachCandidate, ResolvedBreach, HypothesisRanking | **Parquet** or **DuckDB persistent file** | Computed by cascade, read by analysts and downstream stages |
| RatifiedExplanation event log | **Parquet** (analytics) + **Postgres** mirror (operational reads) | Append-only analytical data, but also drives rule-store updates operationally |

The split rule: **Postgres holds state that changes; DuckDB queries data that accumulates.** Operational/transactional → Postgres. Analytical/historical → DuckDB on Parquet.

DuckDB's `postgres_scanner` extension lets DuckDB query Postgres tables directly:

```sql
INSTALL postgres;
LOAD postgres;
ATTACH 'host=localhost user=... dbname=...' AS pg (TYPE postgres);
SELECT a.*, r.threshold
FROM 's3://attribution/date=2026-05-20/*.parquet' a
JOIN pg.public.thresholds r ON a.desk_id = r.desk_id;
```

Operational state stays in Postgres; analysts join against it from DuckDB without a separate ETL step.

### Storage layout

```text
Bucket / disk root:
├── trades/
│   └── snapshot_id=<id>/*.parquet              # canonical trade state at snapshot
├── lifecycle_events/
│   └── date=<YYYY-MM-DD>/*.parquet             # append-only event log
├── market_snapshots/
│   └── date=<YYYY-MM-DD>/
│       └── snapshot_id=<id>/*.parquet          # RiskFactor → value at snapshot
├── greeks/
│   └── date=<YYYY-MM-DD>/
│       └── snapshot_id=<id>/*.parquet          # position × factor sensitivities
├── attribution_rows/
│   └── date=<YYYY-MM-DD>/
│       └── snapshot_id=<id>/*.parquet          # wide DataFrame, the cascade input
├── breach_candidates/        date=<...>/*.parquet  # S1 output
├── resolved_breaches/        date=<...>/*.parquet  # S2 output
├── hypothesis_rankings/      date=<...>/*.parquet  # S3 output
└── ratified_explanations/    date=<...>/*.parquet  # S4 output

Postgres:
├── rule_store              (versioned: rule_id, version, effective_date)
├── threshold_registry      (per-desk, per-product)
├── overlay_registry        (active overlays, version, effective_date)
├── reviewer_workflow       (breach_id, status, assigned_reviewer, sla)
├── ratified_explanation_mirror   (operational view of latest ratifications)
└── config, users, roles, desks
```

Partition by date and snapshot_id so DuckDB can prune scans efficiently. Use Zstd compression on Parquet (~3-5x smaller than Snappy, slightly slower decompression — net win for I/O-bound queries).

### Cascade execution in this stack

Each stage is a SQL operation in DuckDB plus rule lookups in Postgres:

```text
S1 — broad breach detection
    DuckDB query over attribution_rows
    + JOIN to pg.threshold_registry (via postgres_scanner)
    → writes breach_candidates Parquet

S2 — model overlay decomposition
    DuckDB query over breach_candidates
    + JOIN to pg.overlay_registry
    + JOIN to market_snapshots, greeks for overlay math
    → writes resolved_breaches Parquet

S3 — probability synthesis
    Read resolved_breaches[unexplained] via DuckDB
    Hand off to synthesis:
      - Bayesian net: Node code (small, in-process)
      - Learned classifier: onnxruntime-node inference
      - Agent reasoning: Anthropic API call
    → writes hypothesis_rankings Parquet

S4 — human evaluation
    Reviewer UI reads hypothesis_rankings (DuckDB query)
    Reviewer captures judgment via web UI
    Postgres transaction:
      - Insert into reviewer_workflow
      - On submit: write ratified_explanations Parquet
      - Update rule_store (new rule version, new effective_date)
```

S1 and S2 are pure SQL. F_D evaluators map to SQL `WHERE` clauses and arithmetic checks. DuckDB handles them in seconds against tens of millions of rows.

S3 is the only stage that calls out, and the call is to in-process inference or HTTP — no separate compute cluster.

S4 is UI-driven, not compute-heavy. Postgres carries the operational state; the resulting RatifiedExplanation lands in both Parquet (for analytics) and the Postgres mirror (for operational queries).

### Process and deployment shape

A single Node service per asset-class Module, or one service running all Modules. The runtime is:

```text
Node process
├── GTL/ABG runtime (workflow + event sourcing)
├── DuckDB embedded (analytical queries against Parquet + Postgres)
├── Postgres connection pool (rule store, workflow state)
├── Parquet read/write (snapshot store)
├── worker_threads pool for parallel S2 overlay fan-out
└── HTTP / gRPC interface for S4 reviewer UI
```

No separate analytical database server, no Spark cluster, no JVM. The operational footprint is one Node process + Postgres + a filesystem or S3 bucket holding Parquet.

For analyst notebooks (forensic exploration outside the runtime):

```text
Python (Jupyter / Marimo)
├── duckdb (same engine, same SQL, same Parquet files)
├── polars or pandas (DataFrame manipulation)
├── matplotlib / plotly / perspective (visualization)
└── reads the same Parquet store as the runtime
```

Cross-language interop happens at the filesystem layer (Parquet) — not at an RPC boundary. Analysts see the exact same data the runtime sees, with no ETL drift.

### When and how to call out

Most workloads stay in Node + DuckDB. Cases where calling out is the right move:

| Scenario | Call out to | Integration shape |
|---|---|---|
| Greek computation across millions of trades nightly | Spark / Dask / Ray | Spawn batch job; output Parquet; DuckDB reads result |
| Massive ETL pulling from many upstream sources with join-heavy logic | Spark or Trino | Same — write Parquet, DuckDB consumes |
| ML model training for S3 classifier | Python scikit-learn / PyTorch | Train offline, export ONNX, infer in-process via `onnxruntime-node` |
| Existing JVM risk system you must integrate (not replace) | gRPC / REST | Risk system computes greeks; you consume; attribution stays in Node + DuckDB |
| Genuinely petabyte-scale historical replay | Iceberg + Trino / Spark Structured Streaming | At this point, the architecture shifts; DuckDB becomes the development substrate, production runs distributed |

The pattern is always the same: **call-outs land their output in Parquet**, and DuckDB reads from there. The runtime path never depends on a remote analytical engine being available — it can run end-to-end on local data.

### Architectural payoff of this stack

The reasons this stack fits the F_D-throughout cascade naturally:

1. **DuckDB's SQL is the F_D evaluator's natural form.** Threshold checks, arithmetic invariants, FK integrity, reconciliation — all expressible as SQL `WHERE` and aggregate clauses. F_D becomes "this query returns zero rows" or "this aggregate is within tolerance".
2. **Parquet snapshots are the event log's natural storage.** Append-only, time-partitioned, columnar. Replay is `SELECT * FROM ... WHERE snapshot_id = ...`.
3. **Postgres rule store and DuckDB analytical queries compose without ETL.** Via `postgres_scanner`, the rule store and the Parquet attribution data are queryable in one SQL statement.
4. **Same data, same engine, same SQL — Node runtime and Python notebooks.** No drift between runtime breach detection and analyst forensic exploration.
5. **Operational footprint is minimal.** Node + Postgres + filesystem. No separate analytical DB to run, tune, replicate, or pay for.
6. **Scaling has known thresholds.** Up to ~1 TB/day single-node DuckDB. Beyond that, ClickHouse swap-in. Beyond that, distributed. The path is staged.

The stack matches the architecture's principles: deterministic transformations as F_D SQL operators, event-sourced state in append-only Parquet, operational state in transactional Postgres, no probabilistic step until S3 and no human until S4. GTL/ABG carries the workflow law over the top; this stack carries the data.
