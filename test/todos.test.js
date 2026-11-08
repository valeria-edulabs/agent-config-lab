const test = require('node:test');
const assert = require('node:assert');
const store = require('../src/store');
const api = require('../src/api/todos');

test.beforeEach(() => store.reset());

test('createTodo adds a todo', () => {
  const result = api.createTodo({ title: 'Write the lab' });
  assert.strictEqual(result.error, null);
  assert.strictEqual(result.data.title, 'Write the lab');
  assert.strictEqual(api.listTodos().data.length, 1);
});

test('createTodo requires a title', () => {
  const result = api.createTodo({});
  assert.strictEqual(result.error, 'title is required');
});

// This test FAILS on purpose (see the bug in src/api/todos.js).
test('completing a todo twice keeps it completed', () => {
  const { data } = api.createTodo({ title: 'Ship it' });
  api.completeTodo(data.id);
  const result = api.completeTodo(data.id);
  assert.strictEqual(result.data.completed, true);
});
