<template>
  <div class="form-component">
    <h3>多重 v-model 表單</h3>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="firstName">名字:</label>
        <input id="firstName" :value="firstName" @input="updateFirstName" placeholder="請輸入名字" class="form-input" />
      </div>

      <div class="form-group">
        <label for="lastName">姓氏:</label>
        <input id="lastName" :value="lastName" @input="updateLastName" placeholder="請輸入姓氏" class="form-input" />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" type="email" :value="email" @input="updateEmail" placeholder="請輸入 Email" class="form-input" />
        <span v-if="emailError" class="error">{{ emailError }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="!isFormValid" class="btn btn-primary">
          提交表單
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary">
          重置
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定義 props - 多個 v-model
const props = defineProps({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  }
})

// 定義 emits - 多個 v-model 需要對應的 update 事件
const emit = defineEmits({
  'update:firstName': (value) => typeof value === 'string',
  'update:lastName': (value) => typeof value === 'string',
  'update:email': (value) => typeof value === 'string',
  'submit': (formData) => typeof formData === 'object'
})

// 計算屬性
const emailError = computed(() => {
  if (props.email && !/\S+@\S+\.\S+/.test(props.email)) {
    return 'Email 格式不正確'
  }
  return ''
})

const isFormValid = computed(() => {
  return props.firstName.trim() &&
    props.lastName.trim() &&
    props.email.trim() &&
    !emailError.value
})

// 方法
const updateFirstName = (event) => {
  emit('update:firstName', event.target.value)
}

const updateLastName = (event) => {
  emit('update:lastName', event.target.value)
}

const updateEmail = (event) => {
  emit('update:email', event.target.value)
}

const handleSubmit = () => {
  if (isFormValid.value) {
    const formData = {
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      fullName: `${props.firstName} ${props.lastName}`,
      submittedAt: new Date().toLocaleString()
    }
    emit('submit', formData)
  }
}

const resetForm = () => {
  emit('update:firstName', '')
  emit('update:lastName', '')
  emit('update:email', '')
}
</script>

<style scoped>
.form-component {
  max-width: 500px;
  margin: 0 auto;
}

.form {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.error {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
  flex: 1;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>