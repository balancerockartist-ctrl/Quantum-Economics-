# Quantum Economics

> **Open ecosystem for AI-assisted economic systems — humanitarian tools built with rigorous engineering and transparent AI collaboration.**

---

## Mission

Quantum Economics is a hub for research, tooling, and experiments at the intersection of **economic systems design**, **AI agents**, and **accessible financial infrastructure**. Every project here is grounded in a concrete humanitarian goal: lower the barrier for communities to participate in fair, transparent economic systems.

---

## Repository Map

```text
Quantum-Economics-/
├── README.md                  ← you are here
├── docs/
│   ├── vision.md              ← mission, values, scope
│   ├── architecture.md        ← system overview + Mermaid diagram
│   ├── ai-policy.md           ← AI usage policy and authorship stance
│   └── roadmap.md             ← phased milestones
├── projects/
│   ├── freepay/               ← off-chain ledger MVP → future payment rails
│   │   └── README.md
│   ├── agents/                ← autonomous agent system
│   │   └── README.md
│   └── economics-lab/         ← experiments, datasets, notebooks
│       └── README.md
├── demos/                     ← runnable demos and notebooks
│   └── README.md
└── .github/
    └── workflows/
        ├── ci.yml             ← markdown lint + formatting checks
        └── jekyll-docker.yml  ← Jekyll site build
```

---

## Projects at a Glance

| Project | Status | Description |
|---|---|---|
| [FreePay](projects/freepay/README.md) | 🚧 MVP | Off-chain double-entry ledger; designed for future Stripe/crypto rails |
| [Agents](projects/agents/README.md) | 🔬 Research | AI agent system for economic analysis and workflow automation |
| [Economics Lab](projects/economics-lab/README.md) | 🔬 Research | Experiments, datasets, and evaluation notebooks |

---

## Quickstart

```bash
# Clone
git clone https://github.com/balancerockartist-ctrl/Quantum-Economics-.git
cd Quantum-Economics-

# Backend (Python)
cd backend
pip install -r requirements.txt
python server.py

# Frontend (Node)
cd ../frontend
npm install
npm start
```

See individual project READMEs under `projects/` for deeper setup instructions.

---

## AI Involvement

This repository is built with **human-in-the-loop AI assistance**. Here is a transparent account of how AI is used:

| Activity | Role of AI | Human Oversight |
|---|---|---|
| Code generation | AI drafts; human reviews every line | Required before merge |
| Documentation | AI drafts; human edits for accuracy | Required |
| Architecture decisions | AI proposes options; human decides | Always human-owned |
| Security review | AI flags risks; human validates | Required |
| Commit authorship | AI commits attributed via co-author tags | Reviewed in PR |

**Authorship stance:** Human author retains full responsibility for all merged content. AI contributions are acknowledged but do not constitute independent authorship. See [docs/ai-policy.md](docs/ai-policy.md) for the full policy.

**Tools used:** GitHub Copilot (code assistance), emergent-agent-e1 (automation scaffolding).

---

## Contributing

1. Open an issue describing your proposed change.
2. Fork → branch → PR against `main`.
3. All PRs must pass the CI checks (markdownlint).
4. Large changes require a brief design note in `docs/`.

---

## License

MIT — see `LICENSE` file (to be added).  
All AI-generated content is reviewed and released under the same terms.
