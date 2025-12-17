<template>
  <div></div>
  <h1>Todo List</h1>
  <div class="todo-list">
    <input class="new-todo" placeholder="What needs to be done?" v-model="newTodo" @keyup.enter="addTodo(todo)">
    <div class="main" v-show="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone" />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <!-- 因 class 有編輯狀態樣式，所以v-bind要加上，否則無法觸發編輯狀態 -->
        <li class="todo" v-for="todo in filteredTodos" :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" />
        </li>
      </ul>
    </div>
    <footer class="footer">
      <span class="todo-count">
        {{ remaining }} {{ pluralize(remaining) }} left
      </span>
      <!-- 各種條件篩選渲染資料 -->
      <ul class="filters">
        <li>
          <a href="#/all" @click.prevent="visibility = 'all'" :class="{ selected: visibility == 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" @click.prevent="visibility = 'active'"
            :class="{ selected: visibility == 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" @click.prevent="visibility = 'completed'"
            :class="{ selected: visibility == 'completed' }">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" @click.prevent="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'

const cssUrl = "https://unpkg.com/todomvc-app-css@2.2.0/index.css";
const styleId = "todolist-style";

const STORAGE_KEY = 'todos-express'
const todoStorage = {
  fetch() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = todoStorage.uid
    })
    todoStorage.uid = todos.length
    return todos
  },
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  },
  uid: 0
}
const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter(todo => !todo.completed),
  completed: (todos) => todos.filter(todo => todo.completed)
}

const todos = ref([])
const visibility = ref('all')
const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => filters.active(todos.value).length)
const pluralize = (n) => n === 1 ? 'item' : 'items'
// 1. 新增、刪除
const newTodo = ref('')
const addTodo = () => {
  const value = newTodo.value && newTodo.value.trim()
  if (!value) { return }
  todos.value.push({
    id: todoStorage.uid++,
    title: value,
    completed: false
  })
  newTodo.value = ''
}
const removeTodo = (todo) => {
  todos.value.splice(todos.value.indexOf(todo), 1)
}

// 2.編輯、取消、完成編輯
const editedTodo = ref('')
let beforeEditCache = null

const editTodo = (todo) => {
  editedTodo.value = todo
  beforeEditCache = todo.title
}

const doneEdit = (todo) => {
  if (!editedTodo.value) { return }
  editedTodo.value = null
  todo.title = todo.title.trim()
  if (!todo.title) {
    removeTodo(todo)
  }
}

const cancelEdit = (todo) => {
  editedTodo.value = null
  todo.title = beforeEditCache
}
// 自定義使用者編輯體驗最佳化
const vTodoFocus = {
  updated(el, binding) {
    if (binding.value) {
      el.focus()
    }
  }
}

// 3. 清除已完成項目、全部勾選及取消勾選
const removeCompleted = () => {
  todos.value = filters.active(todos.value)
}

const allDone = computed({
  get: () => remaining.value === 0,
  set: (value) => todos.value.forEach(todo => todo.completed = value)
})
// 將todos 儲存於本機瀏覽器、監聽資料變化
// 在mounted生命週期，將資料自瀏覽器讀取出來
onMounted(() => {
  todos.value = todoStorage.fetch()

  if (!document.getElementById(styleId)) { // 防止重複新增樣式
    const link = document.createElement('link'); // 建立 link 元素
    link.id = styleId; // 設定 id 屬性以便後續移除
    link.rel = 'stylesheet'; // 設定 rel 屬性
    link.href = cssUrl; // 設定 href 屬性
    document.head.appendChild(link); // 將 link 元素加入到 head 中
  }
})

onUnmounted(() => {
  const link = document.getElementById(styleId); // 獲取要移除的 link 元素
  if (link) { // 檢查元素是否存在
    document.head.removeChild(link); // 從 head 中移除 link 元素
  }
})

// watch( object, (nvalue, ovalue)) ，監聽 todos，若資料發生變化，觸發 todoStorage 儲存資料
watch(
  todos,
  () => {
    todoStorage.save(todos.value)
  }, { deep: true }
)
</script>

<style scoped>
.filters li a {
  font-size: 0.9rem;
}
</style>
