const http = require('http');
const api = require('./api/todos');

const server = http.createServer((req, res) => {
  const send = (status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  };

  if (req.method === 'GET' && req.url === '/todos') {
    return send(200, api.listTodos());
  }

  if (req.method === 'POST' && req.url === '/todos') {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      const result = api.createTodo(JSON.parse(raw || '{}'));
      send(result.error ? 400 : 201, result);
    });
    return;
  }

  const match = req.url.match(/^\/todos\/(\d+)\/complete$/);
  if (req.method === 'POST' && match) {
    const result = api.completeTodo(Number(match[1]));
    return send(result.error ? 404 : 200, result);
  }

  send(404, { data: null, error: 'not found' });
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  server.listen(port, () => console.log(`Todo API on http://localhost:${port}`));
}

module.exports = server;
