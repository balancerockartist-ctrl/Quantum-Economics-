# Roadmap

## Overview

This roadmap is organized into phases aligned with the maturity of each project component. Milestones are outcome-oriented; specific dates will be tracked in GitHub Issues and Projects.

---

## Phase 0 — Foundation (Current)

**Goal:** Establish the hub repository structure, documentation baseline, and CI infrastructure.

- [x] Hub-style repository structure (`docs/`, `projects/`, `demos/`)
- [x] Core documentation: vision, architecture, AI policy, roadmap
- [x] CI workflow: markdownlint and formatting checks
- [x] FreePay project scaffold (off-chain ledger design)
- [x] Agent system design document
- [x] Economics Lab design document

---

## Phase 1 — FreePay MVP (Off-Chain Ledger)

**Goal:** A working, testable double-entry ledger that can track accounts and transactions locally, with no real-money movement.

**Milestones:**

| # | Milestone | Description |
|---|---|---|
| 1.1 | Domain model | `Account`, `Transaction`, `Journal` entities with validation |
| 1.2 | In-memory ledger | Ledger service backed by in-memory repository; full unit tests |
| 1.3 | Postgres persistence | Swap in SQLAlchemy-backed repository; migration scripts |
| 1.4 | REST API | FastAPI routes: open account, post transaction, query balance, audit log |
| 1.5 | Basic UI | React form to post transfers and display account balances |
| 1.6 | Security baseline | Auth tokens, append-only audit log, input validation |

---

## Phase 2 — Agent System MVP

**Goal:** Agents that can analyze FreePay ledger snapshots and produce structured economic reports.

**Milestones:**

| # | Milestone | Description |
|---|---|---|
| 2.1 | Task executor scaffold | Coordinator, task interface, retry logic |
| 2.2 | Ledger analysis task | Agent reads FreePay data, produces summary statistics |
| 2.3 | Human-in-the-loop checkpoint | Configurable pause for human approval |
| 2.4 | Report generator | Structured Markdown report output |
| 2.5 | Logging and audit | All agent actions logged; review tooling |

---

## Phase 3 — Economics Lab Bootstrap

**Goal:** First reproducible experiment published in the lab.

**Milestones:**

| # | Milestone | Description |
|---|---|---|
| 3.1 | Notebook template | Standardized Jupyter notebook structure |
| 3.2 | Synthetic dataset | Generated dataset of mutual-aid transactions |
| 3.3 | First experiment | Experiment: "Does double-entry tracking change spending behavior in community groups?" |
| 3.4 | Evaluation framework | Metrics, baseline comparisons, reproducibility checklist |

---

## Phase 4 — Payment Rails Integration

**Goal:** FreePay connected to at least one real payment rail.

**Milestones:**

| # | Milestone | Description |
|---|---|---|
| 4.1 | Stripe adapter | Infrastructure adapter for Stripe Payments |
| 4.2 | Compliance review | Legal/compliance review of money movement requirements |
| 4.3 | Sandbox testing | End-to-end test with Stripe sandbox |
| 4.4 | Crypto/stablecoin adapter | Infrastructure adapter for a stablecoin rail (e.g., USDC on Solana) |
| 4.5 | FreePay v1.0 | Public release with at least one live payment rail |

---

## Phase 5 — Community and Ecosystem

**Goal:** Make it easy for external contributors and community groups to adopt FreePay.

**Milestones:**

| # | Milestone | Description |
|---|---|---|
| 5.1 | Deployment guide | Docker Compose + cloud deployment docs |
| 5.2 | Community onboarding | Contribution guide, issue templates, code of conduct |
| 5.3 | First external deployment | A real community group using FreePay in production |
| 5.4 | Economics Lab publication | First public research output from the lab |

---

## Tracking

All active work is tracked in GitHub Issues. Label conventions:

- `phase:0`, `phase:1`, … — phase assignment
- `component:freepay`, `component:agents`, `component:lab` — project area
- `type:feature`, `type:bug`, `type:docs`, `type:research`
- `good first issue` — suitable for new contributors
