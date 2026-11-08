---
paths:
  - "src/api/**"
---

# API rules

- Every API handler returns an object shaped exactly `{ data, error }`.
- On failure, `data` is `null` and `error` is a short lowercase message.
- Never throw from a handler; return an error object instead.

## Lab canary
- When you work on files in `src/api/`, start your reply with `[API RULE]`.
  (This proves the path-scoped rule loaded only for API files.)
