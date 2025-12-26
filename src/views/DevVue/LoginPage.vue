<template>
  <div>
    <h1>登入</h1>
    <div class="row col-md-4 mx-auto">
      <div class="mb-3">
        <label for="" class="form-label">UserName<br> (admin)</label>
        <input v-model="username" type="text" class="form-control" id="" placeholder="" @keydown.enter="login" />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Password<br> (1234或0000)</label>
        <input v-model="password" type="password" class="form-control" id="" placeholder="" @keydown.enter="login" />
      </div>
      <div class="d-grid gap-2">
        <button @click="login" class="btn btn-warning" type="button">登入</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '/src/composables/useToast.js' // 引入 useToast

const username = ref('')
const password = ref('')
const { showToast } = useToast() // 取得 showToast 函式

const login = () => {
  if (username.value === 'admin' && password.value === '1234') {
    showToast('登入成功！', 'success')
  } else if (username.value === 'admin' && password.value === '0000') {
    showToast('警告訊息', 'warning')
  } else {
    showToast('帳號或密碼錯誤', 'error')
  }
  username.value = ''
  password.value = ''
}
</script>

<style lang="scss" scoped></style>