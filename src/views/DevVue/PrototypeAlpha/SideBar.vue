<template>
  <div class="col-md-2 sidebar">
    <div class="sidebar-title">
      SideBar Title
      <div class="logininfo">
        <div class="username" :username="username">{{ username }} <button type="button" class="btn btn-secondary"
            @click="handleLogout">登出</button></div>
      </div>
    </div>
    <ul>
      <li v-for="item in menuItems" :key="item.id">
        <a href="" class="sidebar-link text-center" :class="{ active: isActive === item.id }"
          @click.prevent="selectItem(item.id)">{{ item.label }}</a>
      </li>

    </ul>
    <div class="theme-toggle">
      <button type="button" class="btn btn-lg btn-secondary themestylechange" @click="toggleTheme">切換{{ theme === 'dark'
        ?
        '淺色' : '深色' }}背景</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../DevVue/PrototypeAlpha/composable/useAuth' // 引入 useAuth
const { logout } = useAuth() // 取得 logout 函式

const props = defineProps({
  username: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['selectContent', 'username', 'submit']) // 定義事件觸發

// 未來有新增項目只需在 menuItems 陣列中添加對應的 id 與 label 即可，若新增項目較多也可以考慮將 menuItems 抽離成獨立的資料檔案來管理
const menuItems = [
  { id: 'A', label: '會員資料修改' },
  { id: 'B', label: '新增項目' },
  { id: 'C', label: '資料圖表' },
  { id: 'D', label: '行事曆' },
  { id: 'E', label: '檔案管理' }
]

const isActive = ref(null) // 目前選取的內容

const selectItem = (item) => {
  isActive.value = item
  emit('selectContent', item)
}

const handleLogout = () => {
  const confirmed = logout()
  if (confirmed) emit('username', '') // 確認登出後清除父元件的 username
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