<template>
  <div class="">
    <h1 class="text-center my-5 ">Login Page</h1>
    <form @submit.prevent="login">
      <div class="col-md-4 mx-auto login-box">
        <div class="mb-3">
          <label for="username" class="form-label">Username (aduser)</label>
          <input type="text" class="form-control" id="username" placeholder="aduser" :value="modelValue.username"
            @input="emit('update:modelValue', { ...modelValue, username: $event.target.value })" />
        </div>
        <div class="mb-3">
          <label for="Password" class="form-label">Password (1234)</label>
          <input type="password" class="form-control" id="Password" placeholder="1234" :value="modelValue.password"
            @input="emit('update:modelValue', { ...modelValue, password: $event.target.value })" />
        </div>
        <button type="submit" class="btn btn-secondary w-100" :disabled="loading" @click="emit('submit')">Login</button>
      </div>
    </form>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Object,
  loading: Boolean
})
const emit = defineEmits(['update:modelValue', 'submit'])
</script>