<template>
  <div class="">
    <h1 class="text-center my-5 ">Login Page</h1>
    <form @submit.prevent="login">
      <div class="col-md-4 mx-auto login-box">
        <div class="mb-3">
          <label for="username" class="form-label">Username (aduser)</label>
          <input type="text" class="form-control" id="username" placeholder="aduser" v-model="loginInfo.username" />
        </div>
        <div class="mb-3">
          <label for="Password" class="form-label">Password (1234)</label>
          <input type="password" class="form-control" id="Password" placeholder="1234" v-model="loginInfo.password" />
        </div>
        <button type="submit" class="btn btn-secondary w-100">Login</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '../../../router'
import { useToast } from '../../../composables/useToast.js' // 引入 useToast
const { showToast } = useToast()

const emit = defineEmits(['username'])

// 登入資訊，包含使用者名稱與密碼，username 會傳遞到 BoardView.vue 顯示
const loginInfo = ref({
  username: '',
  password: ''
})

const login = () => {
  const loginData = {
    username: 'aduser',
    password: '1234'
  }
  if (loginInfo.value.username === loginData.username && loginInfo.value.password === loginData.password) {
    showToast('登入成功！', 'success')
    emit('username', loginInfo.value.username)
    router.push({
      path: '/prototypealpha/board',
      query: { username: loginInfo.value.username }
    })
  } else {
    showToast('帳號或密碼錯誤', 'danger')
  }
}
</script>

<style lang="scss">
.login-box {
  background: #eee;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  label {
    font-weight: 600;
  }
}
</style>