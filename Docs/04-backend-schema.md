# DeployFix Assistant Backend Schema

## Backend responsibilities

- Authenticate users.
- Store projects and sessions.
- Accept diagnosis input.
- Run diagnosis engine.
- Store ranked findings.
- Return actionable recommendations.
- Track feedback and resolution outcomes.

## Service boundaries

### API layer

Handles request validation, auth checks, rate limits, and response formatting.

### Diagnosis engine

Processes logs and guided answers, matches rules, and produces findings.

### Persistence layer

Stores users, projects, sessions, findings, and recommendations.

## Request lifecycle

1. Client creates session.
2. Backend stores input draft.
3. Client requests analysis.
4. Backend normalizes and redacts input.
5. Diagnosis engine evaluates rules.
6. Findings and recommendations are stored.
7. Response returns summary and ranked findings.

## Main backend entities

- User
- Workspace
- Project
- DiagnosisSession
- SessionInput
- Finding
- Recommendation
- Rule
- Feedback
- ResolutionNote

## API contracts

## Create session

### `POST /api/sessions`

```json
{
  "projectId": "proj_123",
  "platform": "vercel",
  "framework": "nextjs",
  "environment": "production",
  "title": "Prod deployment failing after auth setup"
}
```

### Response

```json
{
  "id": "sess_123",
  "status": "draft"
}
```

## Submit input

### `POST /api/sessions/:id/input`

```json
{
  "rawLogs": "Error: Invalid URL at NextAuth callback...",
  "questionnaire": {
    "workedLocally": true,
    "issueType": "auth",
    "recentChanges": ["env_vars", "oauth_provider"]
  }
}
```

## Analyze session

### `POST /api/sessions/:id/analyze`

### Response

```json
{
  "sessionId": "sess_123",
  "summary": {
    "headline": "Likely auth configuration mismatch",
    "topCategory": "auth_config",
    "confidence": 0.87
  },
  "findings": [
    {
      "id": "find_1",
      "category": "auth_config",
      "title": "NEXTAUTH_URL or callback URL mismatch",
      "severity": "high",
      "confidence": 0.87,
      "evidence": ["Invalid URL", "callback", "redirect_uri_mismatch"],
      "recommendations": [
        "Set NEXTAUTH_URL to the production domain",
        "Update OAuth callback settings"
      ],
      "validationSteps": [
        "Retry login in deployed environment",
        "Check auth provider console"
      ]
    }
  ]
}
```

## Rule data model

A rule should contain:

- ID.
- Name.
- Category.
- Platforms.
- Frameworks.
- Pattern list.
- Severity.
- Confidence base.
- Explanatory text.
- Recommendations.
- Validation steps.
- Optional negative patterns.

## Rule scoring idea

### Inputs to score

- Pattern match count.
- Pattern quality.
- Platform match.
- Framework match.
- Questionnaire alignment.
- Historical resolution weighting, future scope.

### Output

- Confidence float from 0 to 1.
- Rank order.
- Evidence array.

## Background jobs

Not required for MVP, but possible later:

- Session summarization.
- Similar issue clustering.
- Weekly insights email.

## Error handling conventions

### Error format

```json
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Diagnosis session was not found"
  }
}
```

## Privacy rules

- Secrets are redacted before persistence.
- Access to sessions is workspace-scoped.
- Deleted sessions should be soft-deleted for MVP simplicity.
