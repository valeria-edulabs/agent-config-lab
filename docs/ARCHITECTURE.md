# Architecture

- `src/server.js` - tiny HTTP server (no framework)
- `src/api/` - request handlers, each returns `{ data, error }`
- `src/store.js` - in-memory storage
- `src/utils/` - helpers
- `test/` - tests, run with `npm test` (Node's built-in test runner)
