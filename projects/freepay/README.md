# FreePay

> **Off-chain double-entry ledger — designed from day one to support Stripe and crypto rails in future phases.**

---

## What is FreePay?

FreePay is a lightweight, open-source payment and ledger toolkit designed for community groups, mutual-aid networks, and under-served populations who need transparent transaction tracking without the complexity of a full banking system.

**MVP scope:** An off-chain double-entry ledger. No real money moves in the MVP. The ledger tracks balances and transactions locally, with a clean domain model designed to swap in real payment rails later.

---

## Why Double-Entry?

Double-entry bookkeeping is the foundational primitive of all sound financial systems: every debit must have a corresponding credit, every transaction is balanced. Building on this principle from day one ensures correctness and sets up a clean audit trail.

---

## Key Domain Model

### Account

```text
Account
  id:         UUID
  owner_ref:  string (external user ID, optional)
  currency:   string (ISO 4217, e.g. "USD")
  label:      string (human-readable name)
  created_at: datetime
```

### Transaction

```text
Transaction
  id:           UUID
  journal_id:   UUID (FK → Journal)
  account_id:   UUID (FK → Account)
  entry_type:   enum { DEBIT, CREDIT }
  amount:       Decimal (non-negative)
  description:  string
  posted_at:    datetime
```

### Journal

```text
Journal
  id:           UUID
  reference:    string (human-readable description)
  entries:      List[Transaction]  (must balance: sum(debits) == sum(credits))
  status:       enum { PENDING, POSTED, VOIDED }
  created_at:   datetime
  posted_at:    datetime (nullable)
```

**Invariant:** A journal may only be posted if `sum(debit entries) == sum(credit entries)`.

---

## Intended Stack

| Layer | Technology |
|---|---|
| Backend API | FastAPI (Python 3.11+) |
| Domain/Application | Pure Python; no framework dependency |
| Persistence | PostgreSQL via SQLAlchemy (async) |
| Testing | pytest + pytest-asyncio |
| Frontend | React + TypeScript + Tailwind CSS |
| Auth | JWT tokens (expandable to OAuth/Passkeys) |
| Containerization | Docker + Docker Compose |
| CI | GitHub Actions |

---

## API Outline

```text
POST   /accounts                      Create a new account
GET    /accounts/{id}                 Get account details + current balance
GET    /accounts/{id}/transactions    Paginated transaction history

POST   /journals                      Draft a new journal (not yet posted)
POST   /journals/{id}/post            Post the journal (validates balance)
POST   /journals/{id}/void            Void a posted journal
GET    /journals/{id}                 Get journal + entries

GET    /audit                         Append-only audit log (admin)
```

All write endpoints require authentication. The audit log is append-only and cannot be modified via the API.

---

## MVP Scope (Phase 1)

The Phase 1 deliverable is a working, testable implementation of the above with:

1. In-memory repository (for development and testing)
2. Postgres repository (for deployable instances)
3. FastAPI REST API
4. Unit tests with >80% coverage of domain and application layers
5. A basic React UI for posting transfers and viewing balances
6. Docker Compose for local development

---

## Future Rails (Phase 4+)

FreePay is designed with a **payment rail adapter** pattern. In Phase 4:

- **Stripe adapter** — maps FreePay journal entries to Stripe PaymentIntents and Transfers
- **Crypto adapter** — maps FreePay entries to on-chain transactions (e.g., USDC on Solana or Ethereum)
- **ACH adapter** — bank-to-bank transfers via a BaaS provider

Switching rails is an infrastructure concern; the domain model and application layer do not change.

---

## Getting Started (Development)

```bash
cd projects/freepay

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/

# Start dev server (Docker Compose)
docker-compose up
```

---

## Related Docs

- [Architecture overview](../../docs/architecture.md)
- [Roadmap — Phase 1](../../docs/roadmap.md#phase-1--freepay-mvp-off-chain-ledger)
