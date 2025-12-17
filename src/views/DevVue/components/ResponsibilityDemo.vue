<template>
  <div class="responsibility-demo" :style="{ borderColor: themeColor }">
    <h3>👶 子組件內部實現</h3>

    <div class="demo-section">
      <h4>📋 1. 定義接收的 Props</h4>
      <div class="code-block">
        <pre>{{ propsDefinition }}</pre>
      </div>
      <p class="received-data">
        接收到的資料: {{ userName }}, {{ initialCounter }}, {{ themeColor }}
      </p>
    </div>

    <div class="demo-section">
      <h4>📋 2. 定義發送的 Events</h4>
      <div class="code-block">
        <pre>{{ emitDefinition }}</pre>
      </div>
    </div>

    <div class="demo-section">
      <h4>⚙️ 3. 實現業務邏輯</h4>
      <div class="controls">
        <div class="counter-control">
          <label>計數器:</label>
          <button @click="decrementCounter" :style="{ backgroundColor: themeColor }">-</button>
          <span class="counter-value">{{ internalCounter }}</span>
          <button @click="incrementCounter" :style="{ backgroundColor: themeColor }">+</button>
        </div>

        <div class="input-control">
          <label>文字輸入:</label>
          <input v-model="internalInput" @input="handleInput" placeholder="輸入一些文字..."
            :style="{ borderColor: themeColor }" />
        </div>

        <div class="action-control">
          <button @click="triggerStatusChange" :style="{ backgroundColor: themeColor }">
            觸發狀態變化
          </button>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h4>📤 4. 觸發事件給父組件</h4>
      <div class="emit-logs">
        <div class="log-item" v-for="log in emitLogs" :key="log.id">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
          <span class="log-data">{{ log.data }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// 👶 子組件的責任 1: 定義接收的 Props
const props = defineProps({
  userName: {
    type: String,
    required: true
  },
  initialCounter: {
    type: Number,
    default: 0
  },
  themeColor: {
    type: String,
    default: '#007bff'
  }
})

// 👶 子組件的責任 2: 定義發送的 Events
const emit = defineEmits([
  'count-updated',
  'user-input',
  'status-change'
])

// 👶 子組件的責任 3: 實現內部邏輯
const internalCounter = ref(props.initialCounter)
const internalInput = ref('')
const emitLogs = ref([])

// 監聽 props 變化
watch(() => props.initialCounter, (newVal) => {
  internalCounter.value = newVal
})

// 業務邏輯函數
const incrementCounter = () => {
  internalCounter.value++
  // 👶 子組件的責任 4: 觸發事件
  emit('count-updated', internalCounter.value)
  addEmitLog('count-updated', internalCounter.value)
}

const decrementCounter = () => {
  if (internalCounter.value > 0) {
    internalCounter.value--
    emit('count-updated', internalCounter.value)
    addEmitLog('count-updated', internalCounter.value)
  }
}

const handleInput = () => {
  emit('user-input', internalInput.value)
  addEmitLog('user-input', internalInput.value)
}

const triggerStatusChange = () => {
  const status = `${props.userName} 在 ${new Date().toLocaleTimeString()} 觸發了動作`
  emit('status-change', status)
  addEmitLog('status-change', status)
}

// 記錄 emit 事件的輔助函數
const addEmitLog = (event, data) => {
  emitLogs.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    event,
    data: typeof data === 'object' ? JSON.stringify(data) : data
  })

  // 只保留最近 5 條記錄
  if (emitLogs.value.length > 5) {
    emitLogs.value = emitLogs.value.slice(0, 5)
  }
}

// 用於展示的代碼字符串
const propsDefinition = `defineProps({
  userName: { type: String, required: true },
  initialCounter: { type: Number, default: 0 },
  themeColor: { type: String, default: '#007bff' }
})`

const emitDefinition = `defineEmits([
  'count-updated',
  'user-input',
  'status-change'
])`

onMounted(() => {
  addEmitLog('mounted', '組件已掛載')
})
</script>

<style scoped>
.responsibility-demo {
  padding: 20px;
  border: 2px solid #28a745;
  border-radius: 8px;
  background-color: white;
}

.demo-section {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #28a745;
}

.demo-section h4 {
  color: #28a745;
  margin-bottom: 15px;
}

.code-block {
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.received-data {
  margin-top: 10px;
  padding: 10px;
  background-color: #e3f2fd;
  border-radius: 4px;
  font-weight: 500;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.counter-control,
.input-control,
.action-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.counter-control label,
.input-control label {
  min-width: 80px;
  font-weight: 500;
}

.counter-control button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.counter-control button:hover {
  opacity: 0.8;
}

.counter-value {
  min-width: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #495057;
}

.input-control input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
  transition: border-color 0.2s;
}

.input-control input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.action-control button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.action-control button:hover {
  opacity: 0.8;
}

.emit-logs {
  max-height: 150px;
  overflow-y: auto;
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #4a5568;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #a0aec0;
  min-width: 80px;
}

.log-event {
  color: #68d391;
  min-width: 120px;
  font-weight: bold;
}

.log-data {
  color: #fbb6ce;
  word-break: break-all;
}
</style>