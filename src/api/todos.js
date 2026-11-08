// API handlers. Each handler returns a plain object that the server sends as JSON.
const store = require('../store');

function listTodos() {
  return { data: store.allTodos(), error: null };
}

function createTodo(body) {
  if (!body || !body.title) {
    return { data: null, error: 'title is required' };
  }
  return { data: store.addTodo(body.title), error: null };
}

function completeTodo(id) {
  const todo = store.findTodo(id);
  if (!todo) {
    return { data: null, error: 'todo not found' };
  }
  // BUG (planted on purpose): this toggles instead of marking as completed.
  todo.completed = !todo.completed;
  return { data: todo, error: null };
}

module.exports = { listTodos, createTodo, completeTodo };
