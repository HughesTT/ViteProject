<template>
  <div class="custom-input">
    <div class="input-container">
      <input :value="modelValue" @input="handleInput" @focus="focused = true" @blur="focused = false"
        :placeholder="placeholder" :class="{ focused: focused }" class="input-field" />
      <button v-if="modelValue" @click="clearInput" class="clear-btn" type="button">
        ✕
      </button>
    </div>
    <div class="input-info">
      <span class="char-count">{{ charCount }} 字元</span>
      <span v-if="focused" class="focus-indicator">正在輸入...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 定義 props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '請輸入內容...'
  }
})

// 定義 emits - v-model 需要 update:modelValue 事件
const emit = defineEmits({
  'update:modelValue': (value) => typeof value === 'string',
  'clear': () => true
})

// 內部狀態
const focused = ref(false)

// 計算屬性
const charCount = computed(() => props.modelValue.length)

// 方法
const handleInput = (event) => {
  // 發送 update:modelValue 事件來實現 v-model
  emit('update:modelValue', event.target.value)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.custom-input {
  width: 100%;
  max-width: 400px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.input-field:focus,
.input-field.focused {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.clear-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 18px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background-color: #f0f0f0;
  color: #666;
}

.input-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
}

.char-count {
  color: #666;
}

.focus-indicator {
  color: #007bff;
  font-weight: 500;
}
</style>