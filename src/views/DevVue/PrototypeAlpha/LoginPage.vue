<template>
  <LoginForm v-model="loginInfo" :loading="loading" @submit="login" />
</template>

<script setup>
import LoginForm from '../../DevVue/PrototypeAlpha/component/LoginForm.vue'
import { useAuth } from '../../DevVue/PrototypeAlpha/composable/useAuth' // 引入 useAuth

const { loginInfo, loading, login } = useAuth() // 從 useAuth 取得 loginInfo、loading 狀態和 login 函式
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