# Economics Lab

> **Research experiments, reproducible notebooks, and evaluation frameworks for alternative and community economic systems.**

---

## Overview

The Economics Lab is the research arm of Quantum Economics. It produces reproducible experiments that explore questions relevant to the project's humanitarian mission: how do communities manage shared resources, what makes informal economic systems resilient, and how can software tools change economic behavior?

All experiments are designed to be reproducible: data, code, methodology, and results are published together.

---

## Structure

```text
projects/economics-lab/
├── experiments/
│   └── 001-double-entry-behavior/   # First experiment (Phase 3)
│       ├── README.md                # Hypothesis, methodology, results
│       ├── data/                    # Synthetic or anonymized datasets
│       ├── notebooks/               # Jupyter notebooks
│       └── results/                 # Output tables, charts, summary
├── datasets/
│   └── README.md                    # Dataset registry and descriptions
├── templates/
│   ├── experiment-template.md       # Template for new experiments
│   └── notebook-template.ipynb     # Standardized notebook structure
└── evaluation/
    └── README.md                    # Evaluation framework and metrics
```

---

## Experiment Lifecycle

1. **Hypothesis** — State the question and expected outcome in a short design doc.
2. **Data** — Identify or generate the dataset. Document provenance. No real user data without consent.
3. **Methodology** — Describe the analysis approach, tools, and any AI assistance used.
4. **Execution** — Run the analysis. Use the notebook template for reproducibility.
5. **Results** — Document findings, limitations, and open questions.
6. **Review** — At least one human reviews the methodology and results before publishing.

---

## Datasets

| Dataset | Description | Source | Status |
|---|---|---|---|
| `synthetic-mutual-aid-v1` | 10,000 synthetic mutual-aid transactions | Generated | Planned (Phase 3) |
| `freepay-dev-ledger` | Sample FreePay ledger for analysis testing | FreePay MVP | Planned (Phase 1) |

All datasets are either synthetic or anonymized. No real PII is stored.

---

## Evaluation Framework

Experiments are evaluated against:

- **Reproducibility** — Can the experiment be re-run to produce the same results?
- **Data integrity** — Is the dataset documented, versioned, and free of PII?
- **Methodology soundness** — Is the analysis approach appropriate for the hypothesis?
- **Humanitarian relevance** — Does the finding have a plausible path to real-world impact?

---

## Notebooks

Notebooks live in `experiments/{id}/notebooks/`. All notebooks must:

- Start with a clear title, hypothesis, and author section
- Use only data from the `data/` subdirectory (no external fetches in the notebook)
- Produce all charts and output tables to `results/`
- Include a "Limitations" section
- Be runnable end-to-end with `jupyter nbconvert --execute`

---

## Getting Started

```bash
cd projects/economics-lab

# Set up environment
pip install -r requirements.txt

# Launch Jupyter
jupyter lab

# Run a notebook end-to-end (example)
jupyter nbconvert --to notebook --execute experiments/001-double-entry-behavior/notebooks/analysis.ipynb
```

---

## Related Docs

- [Vision — Intended Impact](../../docs/vision.md#intended-impact)
- [Roadmap — Phase 3](../../docs/roadmap.md#phase-3--economics-lab-bootstrap)
