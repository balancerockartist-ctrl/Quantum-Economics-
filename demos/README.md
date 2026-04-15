# Demos

This directory contains runnable demonstrations that combine components from the Quantum Economics ecosystem.

---

## What goes here?

| Type | Description | Examples |
|---|---|---|
| **Notebooks** | Self-contained Jupyter notebooks demonstrating a concept or workflow | FreePay ledger walkthrough, agent analysis demo |
| **Scripts** | Short scripts that exercise a specific capability end-to-end | Post a transaction via the FreePay API, run an agent task |
| **Walkthroughs** | Step-by-step Markdown guides with code snippets | "How to deploy FreePay locally in 5 minutes" |

---

## Conventions

- Each demo lives in its own subdirectory: `demos/{demo-name}/`
- Every demo must include a `README.md` explaining what it demonstrates and how to run it.
- Demos use synthetic/sample data only — no real credentials or PII.
- Demos should work with a fresh clone and the standard setup described in the root `README.md`.

---

## Planned Demos

| Demo | Status | Description |
|---|---|---|
| `freepay-ledger-walkthrough` | Planned (Phase 1) | Post accounts and transactions, query balances |
| `agent-ledger-analysis` | Planned (Phase 2) | Run the ledger analysis agent on sample FreePay data |
| `economics-lab-notebook` | Planned (Phase 3) | Interactive experiment from the Economics Lab |

---

## Adding a Demo

1. Create `demos/{your-demo-name}/README.md` with title, description, and run instructions.
2. Add any supporting files (notebooks, scripts, data) in the same subdirectory.
3. Update the table above in a PR.
4. Ensure the demo passes CI (no broken Markdown, no committed secrets).
