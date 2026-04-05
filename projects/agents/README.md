# Agents

> **AI agent system for economic analysis, workflow automation, and FreePay integration — with mandatory human-in-the-loop checkpoints.**

---

## Overview

The Agents project provides a lightweight, task-oriented AI agent system. Agents are not general-purpose autonomous systems — they are scoped, auditable task executors that consume structured input and produce structured output.

Every consequential agent action (data modification, external API call, report publication) passes through a configurable **human-in-the-loop checkpoint** before execution.

---

## Responsibilities

| Agent / Task | Input | Output | Checkpoint required? |
|---|---|---|---|
| `economic_summary` | Raw economic dataset | Structured summary + key metrics | No (read-only) |
| `ledger_analysis` | FreePay ledger snapshot | Statistical analysis + anomaly flags | No (read-only) |
| `report_generator` | Analysis output | Formatted Markdown report | Yes (before publish) |
| `transaction_classifier` | Unclassified transactions | Category labels + confidence scores | Yes (if low confidence) |

---

## Boundaries

Agents in this system:

**Can:**

- Read and analyze data from FreePay and Economics Lab
- Produce structured reports and summaries
- Flag anomalies and surface them for human review
- Draft content (reports, documentation, code snippets) for human review

**Cannot:**

- Post transactions or modify financial records autonomously
- Send external communications (email, webhooks) without human approval
- Access credentials, secrets, or PII directly
- Override human-in-the-loop checkpoints

---

## Architecture

```text
projects/agents/
├── coordinator.py          # Task dispatch, retry logic, checkpoint orchestration
├── base_task.py            # Abstract base class for all tasks
├── tasks/
│   ├── economic_summary.py
│   ├── ledger_analysis.py
│   ├── report_generator.py
│   └── transaction_classifier.py
├── checkpoints/
│   └── human_review.py     # Pause, log, and await human approval
├── logging/
│   └── audit_log.py        # Append-only action log for all agent activity
└── tests/
    └── ...
```

### Coordinator

The coordinator is the single entry point for agent task execution. It:

1. Accepts a task name and structured input payload
2. Instantiates the appropriate task
3. Executes the task within a try/except/audit wrapper
4. Triggers a human-review checkpoint if required
5. Returns structured output or raises a typed error

### Checkpoints

A checkpoint is a synchronous pause. The coordinator logs the pending action, emits a notification (configurable: log, webhook, UI banner), and waits for an explicit approval signal before proceeding. In development, checkpoints can be set to `auto-approve` for testing, but this must be disabled in production.

---

## Logging and Audit

All agent actions are recorded in an append-only audit log:

```json
{
  "task":       "ledger_analysis",
  "input_hash": "sha256:...",
  "status":     "completed",
  "checkpoint": false,
  "duration_ms": 340,
  "timestamp":  "2026-04-01T12:00:00Z"
}
```

Logs are never deleted. They are reviewed periodically and on any incident.

---

## Getting Started

```bash
cd projects/agents
pip install -r requirements.txt

# Run a task
python -m coordinator run economic_summary --input data/sample.json

# Run tests
pytest tests/
```

---

## Related Docs

- [Architecture overview](../../docs/architecture.md)
- [AI Policy](../../docs/ai-policy.md)
- [Roadmap — Phase 2](../../docs/roadmap.md#phase-2--agent-system-mvp)
