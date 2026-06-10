# DeployFix Assistant PRD

## Product overview

DeployFix Assistant is a developer tool that reduces time spent debugging failed deployments. It helps users identify the most likely root causes of deployment and configuration issues, especially across modern platforms such as Vercel, Netlify, Railway, Firebase, Cloudflare, and custom Node.js setups.

The product is built for hackathon judges, students, indie hackers, and junior-to-mid developers who often struggle with logs, environment variables, OAuth callbacks, DNS records, database URLs, and build/runtime differences between local and cloud environments.

## Problem statement

Modern deployment workflows are powerful but fragile. Developers frequently face:

- Build failures with unclear logs.
- Missing or incorrect environment variables.
- Incorrect OAuth redirect URLs.
- DNS and domain misconfiguration.
- Database connection failures in production.
- CORS, API base URL, and auth session issues.
- Differences between local development and deployed infrastructure.

Most existing platform logs explain *what* failed, but not *why* it failed in practical terms or *what to do next*.

## Goal

Help developers move from failed deployment to validated fix in under 10 minutes.

## Primary users

### User segment 1: Student / hackathon developer

- Ships fast, often under time pressure.
- Uses Vercel, Netlify, Railway, Firebase, or Render.
- Needs a guided explanation more than raw logs.

### User segment 2: Indie hacker / solo builder

- Manages app, DB, auth, DNS, and deployment alone.
- Wants actionable suggestions and a checklist.

### User segment 3: Junior developer

- Understands code but struggles with infra/debugging.
- Benefits from platform-specific diagnosis and remediation steps.

## Value proposition

DeployFix Assistant converts confusing deployment symptoms into:

- Root-cause hypotheses.
- Confidence-ranked issue categories.
- Platform-specific fixes.
- Validation steps.
- A reusable debugging history.

## Core use cases

1. Paste build logs and get a probable diagnosis.
2. Fill a guided issue form instead of reading raw logs.
3. Detect missing or malformed environment variables.
4. Identify auth callback / domain mismatches.
5. Diagnose DNS and domain configuration issues.
6. Detect database URL and network-related failures.
7. Save a troubleshooting session for later.
8. Share a fix summary with teammates.

## Feature list

### Must-have for hackathon MVP

- User authentication.
- New diagnosis session flow.
- Log paste input.
- Guided questionnaire.
- Rule-based issue classification.
- Suggested fixes with priority ordering.
- Platform selector.
- Session history.
- Copy/export diagnosis summary.

### Should-have

- Repo metadata import from GitHub.
- Environment variable checklist generator.
- Domain/DNS checklist flow.
- Confidence score and issue tags.
- Team/project grouping.

### Nice-to-have

- AI-generated explanation rewrite.
- Auto-redaction of secrets from logs.
- Deployment provider webhook ingestion.
- Browser extension / CLI uploader.
- Suggested “run these commands” terminal block.

## User stories

- As a developer, I want to paste logs and get a plain-English diagnosis so that I can fix deployment issues faster.
- As a beginner, I want guided questions so that I can debug even if I do not understand the raw logs.
- As a project owner, I want to save diagnosis history so I can track recurring issues.
- As a team member, I want a short fix summary I can send to others.
- As a user, I want platform-specific advice because Vercel, Railway, Netlify, and Firebase fail differently.

## Success metrics

### Hackathon success metrics

- User receives first diagnosis in under 60 seconds.
- At least 5 common issue classes are supported end-to-end.
- Demo successfully resolves 2 realistic deployment scenarios.
- Users can understand next steps without external documentation.

### Product metrics

- Median time to diagnosis.
- Diagnosis completion rate.
- Suggested-fix click-through rate.
- Session save rate.
- Repeat usage per project.
- User-rated usefulness score.

## Supported issue categories

- Environment variables missing / malformed.
- Auth callback / redirect URI mismatch.
- Database connection or migration failure.
- Build or dependency failure.
- DNS / domain / SSL setup issue.
- API/CORS/base URL mismatch.
- Runtime crash from config mismatch.

## Out of scope for MVP

- Full remote log ingestion from all providers.
- Real-time infra monitoring.
- Full CI/CD pipeline orchestration.
- Auto-fixing cloud provider settings.
- Enterprise SSO and RBAC.

## Functional requirements

### Session creation

- Users can create a diagnosis session manually.
- Users choose platform, framework, and error type.
- Users can paste logs or skip directly to guided troubleshooting.

### Diagnosis engine

- System parses raw text logs.
- System detects known patterns using rule matching.
- System maps symptoms to issue categories.
- System returns ranked hypotheses.
- System provides explanation, likely cause, fix steps, and validation checklist.

### Results experience

- Users see severity, confidence, and affected area.
- Users can expand evidence matched from their logs.
- Users can copy a concise diagnosis summary.
- Users can mark a diagnosis as resolved.

### History

- Users can revisit previous sessions.
- Users can filter by project, platform, status, and issue category.

## Non-functional requirements

- Fast initial response under 3 seconds for rule-based analysis.
- Mobile-friendly responsive interface.
- Safe handling of sensitive logs.
- Redaction support for tokens, API keys, and secrets.
- Clean UX for both beginners and advanced users.

## Risks

- Misclassification due to vague logs.
- Overpromising on root-cause certainty.
- Sensitive information pasted into logs.
- Scope creep from supporting too many providers.

## Assumptions

- Initial version uses a curated rules engine.
- AI explanations are optional and layered on top, not the primary diagnosis engine.
- Most early users are working with JavaScript/TypeScript web apps.

## Launch version for hackathon

A polished MVP should support:

- Vercel, Netlify, Railway.
- Next.js / Node.js apps.
- 5 to 7 major issue categories.
- Log paste + guided form.
- Diagnosis result page.
- Saved session history.
