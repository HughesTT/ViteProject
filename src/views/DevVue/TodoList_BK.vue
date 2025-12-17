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
        <strong>{{ remaining }}</strong> {{ pluralize(remaining) }} left
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
import { ref, computed, onMounted, watch } from 'vue'

const STORAGE_KEY = 'todos-express'
const todoStorage = { // 宣告todoStorage物件，包含 fetch 與 save 方法
  fetch() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') // 從 localStorage 讀取資料，若無資料則回傳空陣列
    todos.forEach(function (todo, index) { // 為每個 todo 加上 id 屬性，其值為索引值
      todo.id = index
    })
    todoStorage.uid = todos.length // 將 uid 設為目前 todos 陣列的長度
    return todos
  },
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) // 將 todos 陣列轉為字串後儲存至 localStorage
  },
  uid: 0
}
const filters = { // 宣告變數filters，包含三種篩選條件的方法
  all: (todos) => todos, // 全部資料
  active: (todos) => todos.filter((todo) => !todo.completed), // 未完成項目，todos篩選留下為不等於 todo.completed 的資料
  completed: (todos) => todos.filter((todo) => todo.completed) // 已完成項目，todos篩選留下 todo.completed 的資料
}

const todos = ref([]) // 宣告變數todos為空陣列，若localStorage有資料，則會帶入
const visibility = ref('all') // 宣告變數切換顯示資料，依照需求(all、active、completed)渲染相對應資料
const filteredTodos = computed(() => filters[visibility.value](todos.value)) // 計算動態呼叫的值
const remaining = computed(() => filters.active(todos.value).length) // 計算未完成項目的數量
const pluralize = (n) => n === 1 ? 'item' : 'items' // 判斷數量為單數or複數，顯示對應的英文字 item

// 1. 新增、刪除
const newTodo = ref('')
const addTodo = () => {
  const value = newTodo.value && newTodo.value.trim() // 定義一 value 變數，其值為去除空格的 newTodo.value
  if (!value) { // 若 value 為空，跳出alert視窗後返回
    alert('Insert your info')
    return
  }
  todos.value.push({ // 將 value 新增至 todos.value
    id: todoStorage.uid++, // id以 todoStorage.uid的值做遞增
    title: value, // title 的值為 value 的值
    completed: false // completed 的值預設為 false 
  })
  newTodo.value = '' // 新增完成後，將 newTodo.value 清空
}
const removeTodo = (todo) => {
  todos.value.splice(todos.value.indexOf(todo), 1) // 若todo 的 id 與 索引相同，則觸發刪除
}

// 2.編輯、取消、完成編輯
const editedTodo = ref('') // 儲存被編輯的項目
let beforeEditCache = null // 額外備份被編輯項目的值，若沒有更改到一半被取消，則可將其還原，防止資料被覆蓋
const editTodo = (todo) => {
  editedTodo.value = todo // 進入編輯狀態
  beforeEditCache = todo.title // 將 todo.title 備份
}
const doneEdit = (todo) => {
  if (!editedTodo.value) { // 若 editedTodo.value 因網路等因素為空時，則返回
    return
  }
  editedTodo.value = null // 離開編輯狀態
  todo.title = todo.title.trim() // todo.title 為將其空格去除的值
  if (!todo.title) { // 若 todo.title 為空，則觸發刪除
    removeTodo(todo)
    alert('Item Removed!!')
  }
}
const cancelEdit = (todo) => {
  editedTodo.value = null // 離開編輯狀態
  todo.title = beforeEditCache // 將 beforeEditCache 還原到 todo.title 
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
const removeCompleted = () => { // 清除已完成，等同留下未完成的資料
  todos.value = filters.active(todos.value)
}

const allDone = computed({ // 計算remaining，將全部項目切換 完成/未完成
  get: () => remaining.value === 0,
  set: (value) => todos.value.forEach(todo => todo.completed = value)
})

// 將todos 儲存於本機瀏覽器、監聽資料變化
// watch( object, (nvalue, ovalue)) ，監聽 todos，若資料發生變化，觸發 todoStorage 儲存資料
watch(
  todos,
  () => {
    todoStorage.save(todos.value)
  }, { deep: true }
)

onMounted(() => todos.value = todoStorage.fetch()) // 在mounted生命週期，將資料自瀏覽器讀取出來

</script>

<style>
@import url("https://unpkg.com/todomvc-app-css@2.2.0/index.css");

.filters li a {
  font-size: 0.9rem;
}
</style>
