<template>
  <div class="col-md-2 sidebar">
    <div class="sidebar-title">
      SideBar Title
      <div class="logininfo">
        <div class="username" :username="username">{{ username }} <button type="button" class="btn btn-secondary"
            @click="logout">登出</button></div>
      </div>
    </div>
    <ul>
      <li><a href="" class="sidebar-link text-center" :class="{ active: isActive === 'A' }"
          @click.prevent="selectItem('A')">Member
          Info</a></li>
      <li><a href="" class="sidebar-link text-center" :class="{ active: isActive === 'B' }"
          @click.prevent="selectItem('B')">Add New Item</a></li>
      <li><a href="" class="sidebar-link text-center" :class="{ active: isActive === 'C' }"
          @click.prevent="selectItem('C')">DashBoard</a></li>
      <li><a href="" class="sidebar-link text-center" :class="{ active: isActive === 'D' }"
          @click.prevent="selectItem('D')">VCalendar</a></li>
      <li><a href="" class="sidebar-link text-center" :class="{ active: isActive === 'E' }"
          @click.prevent="selectItem('E')">FileUpload</a></li>
    </ul>
    <div class="theme-toggle">
      <button type="button" class="btn btn-lg btn-info themestylechange" @click="toggleTheme">切換佈景模式</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 引用 Vue Router
import { useToast } from '../../../composables/useToast.js' // 引入 useToast
const { showToast } = useToast() // 取得 showToast 函式

const props = defineProps({
  username: {
    type: String,
    required: true
  }
})
const router = useRouter() // 使用 Vue Router
const emit = defineEmits(['selectContent', 'username']) // 定義事件觸發
const isActive = ref(null) // 目前選取的內容

const selectItem = (item) => {
  isActive.value = item
  emit('selectContent', item)
}

const logout = () => {
  const confirmed = window.confirm('確定要登出嗎？')
  if (confirmed) {
    // 在這裡處理登出邏輯，例如清除使用者資料、導向登入頁面等
    router.push('/prototypealpha')
    showToast('已登出', 'success')
    emit('username', '') // 清除父組件的 username
  } else {
    // 使用者取消登出
    return
  }
}

const theme = ref('dark') // 預設主題為 dark
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
}
</script>

<style lang="scss">
.sidebar {
  border-right: solid 1px var(--sidebar-border);
  position: sticky;
  top: 0;
  height: 100vh;

  .sidebar-title {
    font-size: 1.5em;
    font-weight: 700;
    padding: 15px;
    text-align: center;
    border-bottom: solid 1px var(--sidebar-title-border);
  }

  .logininfo {
    margin-top: 0.5em;

    .username {
      font-size: 0.8em;
      font-weight: 300;
      color: var(--username-color);
    }
  }

  button {
    font-size: 0.7em;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  a {
    display: block;
    padding: 20px 0;
    color: var(--link-color);
    font-size: 1.2em;
    font-weight: 600;
    text-decoration: none;
    transition: ease-in-out 0.3s;

    &:hover {
      color: var(--sidebar-hover-text);
      background-color: var(--sidebar-hover-bg);
    }

    &.active {
      color: var(--sidebar-active-text);
      background-color: var(--sidebar-active-bg);
    }
  }

  .themestylechange {
    font-size: 0.9em;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>