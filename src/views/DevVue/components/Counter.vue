<template>
  <div class="counter">
    <h3>計數器</h3>
    <div class="counter-display">
      <span class="count-value">{{ count }}</span>
    </div>
    <div class="counter-controls">
      <button @click="decrement" :disabled="count <= 0" class="btn btn-danger">
        -1
      </button>
      <button @click="increment" class="btn btn-primary">
        +1
      </button>
      <button @click="increment5" class="btn btn-success">
        +5
      </button>
      <button @click="reset" class="btn btn-warning">
        重置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 定義 props
const props = defineProps({
  initialValue: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  }
})

// 定義 emits，包含事件驗證
const emit = defineEmits({
  increment: (value) => typeof value === 'number',
  decrement: (value) => typeof value === 'number',
  reset: () => true
})

// 內部狀態
const count = ref(props.initialValue)

// 監聽 props 變化
watch(() => props.initialValue, (newValue) => {
  count.value = newValue
})

// 方法
const increment = () => {
  count.value++
  emit('increment', count.value)
}

const increment5 = () => {
  count.value += 5
  emit('increment', count.value)
}

const decrement = () => {
  if (count.value > 0) {
    count.value--
    emit('decrement', count.value)
  }
}

const reset = () => {
  count.value = 0
  emit('reset')
}
</script>

<style scoped>
.counter {
  padding: 20px;
  border: 2px solid #007bff;
  border-radius: 8px;
  background-color: white;
  text-align: center;
  max-width: 300px;
}

.counter-display {
  margin: 20px 0;
}

.count-value {
  font-size: 48px;
  font-weight: bold;
  color: #007bff;
}

.counter-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
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

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background-color: #e0a800;
}
</style>