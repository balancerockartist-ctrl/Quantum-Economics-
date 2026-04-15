# AI Policy

## Purpose

This document defines how AI tools are used in the Quantum Economics project, how authorship and responsibility are assigned, and what safeguards are in place for contributors and users.

---

## 1. AI Assistance Scope

AI tools are used to assist with:

- **Code generation** — drafting boilerplate, suggesting implementations, auto-completing repetitive patterns.
- **Documentation** — drafting initial content, suggesting structure, checking consistency.
- **Code review** — identifying potential bugs, security issues, and style violations.
- **Research summarization** — synthesizing source material into structured notes.
- **Test generation** — suggesting unit test cases based on function signatures.

AI tools are **not** used to:

- Make architectural decisions without human review.
- Commit or merge code autonomously (all merges require human approval).
- Handle sensitive data (credentials, PII, financial records) in prompts.
- Generate content that claims authority, credentials, or permissions the project does not have.

---

## 2. Authorship and Responsibility

**All merged code and documentation is authored by the human contributors who reviewed and approved it.**

AI contributions are acknowledged in commit messages and PR descriptions using the standard `Co-authored-by:` convention:

```text
Co-authored-by: GitHub Copilot <copilot@github.com>
Co-authored-by: emergent-agent-e1 <github@emergent.sh>
```

This acknowledgment does not transfer authorship or responsibility to the AI tool. The human who approves and merges a PR is responsible for that content.

---

## 3. Review Requirements

| Content type | Minimum review |
|---|---|
| Code changes | Human review of every line before merge |
| API surface changes | Human design review + updated docs |
| Security-sensitive code | Human review + threat model check |
| Documentation | Human accuracy check |
| Agent output used in production | Human approval checkpoint required |

No AI-generated content may be merged without at least one human review. Automated CI checks are supplementary, not a substitute for review.

---

## 4. Safety and Harm Avoidance

- AI prompts must not include personal identifiable information (PII), credentials, financial data, or proprietary third-party content.
- If an AI tool produces output that could cause financial harm, discriminate against protected groups, or violate privacy, that output must not be used.
- Agents operating autonomously must have defined scope limits and a human-in-the-loop checkpoint before any consequential action (e.g., sending a transaction, external API call, or data modification).
- All agent actions are logged. Logs are reviewed periodically and on any incident.

---

## 5. Data Handling

- No user data is sent to AI tools or third-party APIs without explicit user consent.
- Demo and test data is synthetic; no real financial data is used in development or CI.
- If AI tools are integrated into production features, a data processing agreement and privacy notice are required before launch.

---

## 6. Contribution Guidelines for AI-Assisted PRs

If you use AI tools when contributing, please:

1. **Disclose** in your PR description which AI tools assisted with the change.
2. **Review** all AI-generated content carefully before including it.
3. **Cite** any sources that the AI may have drawn from, if identifiable.
4. **Do not** include AI-generated content that you cannot explain or verify.
5. **Do not** use AI tools to generate commit messages that misrepresent the nature of the change.

---

## 7. Policy Updates

This policy is a living document. As AI tooling and capabilities evolve, the policy will be updated. Significant changes require a PR and human review, the same as code changes.

Last reviewed: 2026-04
