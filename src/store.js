// Very small in-memory store for todos.
const todos = [];
let nextId = 1;

function addTodo(title) {
  const todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  return todo;
}

function findTodo(id) {
  return todos.find((t) => t.id === id);
}

function allTodos() {
  return [...todos];
}

function reset() {
  todos.length = 0;
  nextId = 1;
}

module.exports = { addTodo, findTodo, allTodos, reset };
