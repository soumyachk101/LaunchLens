# DeployFix Assistant TRD

## Technical objective

Build a web application that diagnoses deployment problems through a hybrid architecture combining a deterministic rules engine, structured troubleshooting flows, and optional AI-assisted explanation generation.

## Recommended architecture

### Frontend

- Next.js 15+ with App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui for fast accessible components.
- TanStack Query for async data fetching.
- Zod for form validation.

### Backend

Two valid implementation paths:

1. **Monorepo Next.js app** with server actions and route handlers.
2. **Split architecture** with Next.js frontend and Express/Fastify API.

For a hackathon, the first option is faster.

### Database

- PostgreSQL.
- Prisma ORM.
- Neon or Supabase Postgres for quick provisioning.

### Authentication

- NextAuth if using GitHub login and email auth.
- Clerk if the team wants faster auth UI setup.

### Storage

- Database stores metadata and diagnosis results.
- Optional object storage for raw logs if payloads become large.

## High-level system modules

- Auth module.
- Project/workspace module.
- Diagnosis session module.
- Rules engine module.
- Recommendations module.
- History/reporting module.
- Optional AI explanation module.

## Rules engine design

### Input sources

- Raw logs.
- User questionnaire answers.
- Platform selection.
- Framework selection.
- Manual tags.

### Engine stages

1. Input normalization.
2. Secret redaction.
3. Pattern extraction.
4. Rule matching.
5. Scoring and ranking.
6. Recommendation assembly.
7. Optional explanation rewrite.

### Example rule structure

```json
{
  "id": "env_missing_nextauth_url",
  "title": "NEXTAUTH_URL missing or invalid",
  "platforms": ["vercel", "railway", "netlify"],
  "frameworks": ["nextjs"],
  "patterns": ["NEXTAUTH_URL", "Invalid URL", "callback", "redirect"],
  "category": "auth_config",
  "severity": "high",
  "confidenceBase": 0.72,
  "recommendations": [
    "Set NEXTAUTH_URL to the deployed app URL",
    "Add the exact callback URL in the OAuth provider console",
    "Redeploy after updating environment variables"
  ],
  "validationSteps": [
    "Open /api/auth/signin",
    "Attempt login in incognito",
    "Confirm callback URL matches provider config"
  ]
}
```

## API approach

Use REST for MVP simplicity.

### Core endpoints

- `POST /api/auth/login`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/sessions`
- `GET /api/sessions/:id`
- `POST /api/sessions/:id/analyze`
- `GET /api/rules`
- `POST /api/feedback`

## Security requirements

- Redact secrets before persistence.
- Encrypt sensitive OAuth tokens if stored.
- Store minimum necessary log data.
- Limit request size for pasted logs.
- Rate limit anonymous or abuse-prone endpoints.
- Use server-side validation for all inputs.

## Performance requirements

- Rule-only analysis under 3 seconds for normal log sizes.
- Support logs up to at least 250 KB in MVP.
- Pagination on history endpoints.
- Cache static rule definitions in memory.

## Availability assumptions

- MVP tolerates brief cold starts.
- No multi-region requirement.
- Cron jobs not required for MVP.

## Observability

- Structured server logs.
- Error tracking with Sentry.
- Basic product analytics for diagnosis flow completion.
- Admin-only internal metrics page, optional.

## Feature flags

- `ENABLE_AI_EXPLANATIONS`
- `ENABLE_GITHUB_IMPORT`
- `ENABLE_TEAM_WORKSPACES`
- `ENABLE_LOG_STORAGE`

## Deployment recommendation

### Fastest hackathon path

- App: Vercel.
- DB: Neon Postgres.
- Auth: GitHub OAuth.
- Error tracking: Sentry.

### Alternative path

- Frontend: Vercel.
- API: Railway.
- DB: PostgreSQL on Neon.

## Engineering priorities

1. Reliable diagnosis engine.
2. Clean result UX.
3. Saved session history.
4. Shareable summary.
5. Optional AI layer.

## Test strategy

### Unit tests

- Rule matching utilities.
- Redaction helpers.
- Confidence scoring.

### Integration tests

- Session creation.
- Analysis pipeline.
- Auth-protected project history.

### Demo tests

Prepare canned scenarios:

- Missing env variable.
- OAuth callback mismatch.
- DB URL issue.
- Build dependency failure.
- DNS misconfiguration.
