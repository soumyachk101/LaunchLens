# DeployFix Assistant API Outline

## Auth

### `POST /api/auth/login`

Authenticate user via configured provider.

### `POST /api/auth/logout`

Terminate user session.

### `GET /api/auth/me`

Return current user profile and workspace context.

## Projects

### `GET /api/projects`

List user-accessible projects.

### `POST /api/projects`

Create project.

### `GET /api/projects/:id`

Get project details.

### `PATCH /api/projects/:id`

Update project metadata.

## Sessions

### `GET /api/sessions`

List diagnosis sessions with filters.

Query params:

- `projectId`
- `status`
- `platform`
- `category`
- `page`
- `limit`

### `POST /api/sessions`

Create diagnosis session.

### `GET /api/sessions/:id`

Get a single diagnosis session.

### `POST /api/sessions/:id/input`

Submit or update session input.

### `POST /api/sessions/:id/analyze`

Analyze the session and generate findings.

### `POST /api/sessions/:id/resolve`

Mark session resolved and optionally attach note.

## Findings

### `GET /api/sessions/:id/findings`

List ranked findings for session.

## Rules

### `GET /api/rules`

List active diagnosis rules.

### `POST /api/rules/test`

Internal/admin route to test rule matching against sample logs.

## Feedback

### `POST /api/feedback`

Submit helpfulness and resolution feedback.

## Sample response shape

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0
  }
}
```
