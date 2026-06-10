# DeployFix Assistant Database Schema

## Database choice

PostgreSQL is recommended because it supports JSON fields, indexing, relational data, and easy Prisma integration.

## Core tables

## users

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| name | text | User display name |
| email | text | Unique |
| image_url | text | Optional avatar |
| auth_provider | text | github, email, etc. |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |

## workspaces

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| name | text | Workspace/team name |
| owner_id | uuid | FK -> users.id |
| created_at | timestamptz | Default now() |

## workspace_members

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| workspace_id | uuid | FK -> workspaces.id |
| user_id | uuid | FK -> users.id |
| role | text | owner, admin, member |
| created_at | timestamptz | Default now() |

## projects

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| workspace_id | uuid | FK -> workspaces.id |
| name | text | Project name |
| platform | text | vercel, railway, netlify, etc. |
| framework | text | nextjs, react, node, etc. |
| repo_url | text | Optional |
| production_url | text | Optional |
| created_by | uuid | FK -> users.id |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |

## diagnosis_sessions

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| project_id | uuid | FK -> projects.id |
| created_by | uuid | FK -> users.id |
| title | text | User-entered or generated |
| status | text | draft, analyzed, resolved, archived |
| environment | text | preview, production, staging |
| issue_type | text | auth, env, db, build, dns, api, other |
| top_category | text | Top finding category |
| top_confidence | numeric | Decimal confidence |
| summary_headline | text | Top issue summary |
| raw_log_excerpt | text | Shortened safe preview |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |
| resolved_at | timestamptz | Nullable |

## session_inputs

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| session_id | uuid | FK -> diagnosis_sessions.id |
| raw_logs | text | Redacted text |
| questionnaire_json | jsonb | Guided answers |
| parsed_metadata_json | jsonb | Extracted metadata |
| created_at | timestamptz | Default now() |

## findings

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| session_id | uuid | FK -> diagnosis_sessions.id |
| rule_id | uuid | Nullable FK -> rules.id |
| category | text | auth_config, env_var, db_conn, etc. |
| title | text | Finding title |
| description | text | Why this finding matters |
| severity | text | low, medium, high, critical |
| confidence | numeric | 0 to 1 |
| evidence_json | jsonb | Matched text fragments |
| rank_order | int | Sort order |
| created_at | timestamptz | Default now() |

## recommendations

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| finding_id | uuid | FK -> findings.id |
| step_order | int | Step order |
| content | text | Fix step |
| step_type | text | fix, verify, learn |
| created_at | timestamptz | Default now() |

## rules

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| key | text | Unique rule key |
| title | text | Rule title |
| category | text | Issue category |
| severity | text | Default severity |
| platforms_json | jsonb | Supported platforms |
| frameworks_json | jsonb | Supported frameworks |
| patterns_json | jsonb | Trigger patterns |
| negative_patterns_json | jsonb | Optional exclusions |
| recommendations_json | jsonb | Default steps |
| validation_json | jsonb | Validation steps |
| is_active | boolean | Default true |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |

## feedback

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| session_id | uuid | FK -> diagnosis_sessions.id |
| finding_id | uuid | Nullable FK -> findings.id |
| user_id | uuid | FK -> users.id |
| was_helpful | boolean | Basic product signal |
| resolution_status | text | fixed, partially_fixed, not_fixed |
| note | text | Optional feedback |
| created_at | timestamptz | Default now() |

## Suggested indexes

- `users(email)` unique
- `projects(workspace_id, created_at desc)`
- `diagnosis_sessions(project_id, created_at desc)`
- `diagnosis_sessions(created_by, status)`
- `findings(session_id, rank_order)`
- `rules(key)` unique

## Relationship overview

```text
User -> WorkspaceMember -> Workspace -> Project -> DiagnosisSession -> SessionInput
                                                   -> Finding -> Recommendation
DiagnosisSession -> Feedback
Finding -> Rule
```

## Prisma model notes

- Use enums for status, severity, platform, and issue type where possible.
- Keep `jsonb` for flexible guided-form answers and rule patterns.
- Add soft delete columns later if needed.
