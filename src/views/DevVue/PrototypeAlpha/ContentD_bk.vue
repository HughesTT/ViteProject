<template>
  <div class="calendar-container">
    <h1 class="mb-4">📅 行程管理</h1>

    <div class="row">
      <!-- 左側：日曆 -->
      <div class="col-md-7">
        <div class="calendar-card">
          <div class="calendar-header">
            <button class="btn btn-sm btn-outline-light" @click="moveToday">今天</button>
            <button class="btn btn-sm btn-success ms-2" @click="openAddModal">
              <i class="bi bi-plus-circle"></i> 新增行程
            </button>
          </div>
          <VDatePicker ref="calendar" v-model="selectedDate" :attributes="calendarAttributes" title-position="left"
            expanded @dayclick="onDayClick" />
        </div>
      </div>

      <!-- 右側：行程列表 -->
      <div class="col-md-5">
        <div class="events-card">
          <h3 class="mb-3">
            {{ selectedDateDisplay }} 的行程
            <span class="badge bg-info ms-2">{{ selectedDayEvents.length }}</span>
          </h3>

          <div v-if="selectedDayEvents.length === 0" class="no-events">
            📭 這天沒有安排行程
          </div>

          <div v-else class="events-list">
            <div v-for="event in selectedDayEvents" :key="event.id" class="event-item"
              :style="{ borderLeftColor: event.color }">
              <div class="event-header">
                <span class="event-category" :style="{ backgroundColor: event.color }">
                  {{ event.category }}
                </span>
                <div class="event-actions">
                  <button class="btn-icon" @click="editEvent(event)" title="編輯">
                    ✏️
                  </button>
                  <button class="btn-icon" @click="deleteEvent(event)" title="刪除">
                    🗑️
                  </button>
                </div>
              </div>
              <div class="event-title">{{ event.title }}</div>
              <div class="event-time">
                <i class="bi bi-clock"></i> {{ event.startTime }} - {{ event.endTime }}
              </div>
              <div class="event-desc" v-if="event.description">{{ event.description }}</div>
            </div>
          </div>
        </div>

        <!-- 統計資訊 -->
        <div class="stats-card mt-3">
          <h5>📊 統計</h5>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ totalEvents }}</div>
              <div class="stat-label">總行程</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ todayEvents }}</div>
              <div class="stat-label">今日行程</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ upcomingEvents }}</div>
              <div class="stat-label">未來7天</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/編輯行程 Modal -->
    <div class="modal fade" id="eventModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '✏️ 編輯行程' : '➕ 新增行程' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEvent">
              <div class="mb-3">
                <label class="form-label">行程標題 *</label>
                <input type="text" class="form-control" v-model="currentEvent.title" required placeholder="輸入行程標題" />
              </div>

              <div class="mb-3">
                <label class="form-label">日期 *</label>
                <input type="date" class="form-control" v-model="currentEvent.date" required />
              </div>

              <div class="row mb-3">
                <div class="col-6">
                  <label class="form-label">開始時間 *</label>
                  <input type="time" class="form-control" v-model="currentEvent.startTime" required />
                </div>
                <div class="col-6">
                  <label class="form-label">結束時間 *</label>
                  <input type="time" class="form-control" v-model="currentEvent.endTime" required />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">分類 *</label>
                <select class="form-select" v-model="currentEvent.category" required>
                  <option value="工作">工作</option>
                  <option value="會議">會議</option>
                  <option value="個人">個人</option>
                  <option value="運動">運動</option>
                  <option value="學習">學習</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">顏色標記</label>
                <div class="color-picker">
                  <label v-for="color in colorOptions" :key="color.value" class="color-option">
                    <input type="radio" :value="color.value" v-model="currentEvent.color" />
                    <span class="color-box" :style="{ backgroundColor: color.value }" :title="color.name"></span>
                  </label>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">說明</label>
                <textarea class="form-control" rows="3" v-model="currentEvent.description"
                  placeholder="輸入行程說明（選填）"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveEvent">
              {{ isEditing ? '更新' : '新增' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '../../../composables/useToast.js'
import Modal from 'bootstrap/js/dist/modal'

const { showToast } = useToast()
const calendar = ref(null)
const selectedDate = ref(new Date())
const eventModal = ref(null)
const isEditing = ref(false)
const editingId = ref(null)

// LocalStorage 相關
const STORAGE_KEY = 'calendar-events-prototypealpha'
const eventStorage = {
  fetch() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  },
  save(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }
}

// 行程資料
const events = ref([])

// 當前編輯的行程
const currentEvent = ref({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  category: '工作',
  color: '#3b82f6',
  description: ''
})

// 顏色選項
const colorOptions = [
  { name: '藍色', value: '#3b82f6' },
  { name: '綠色', value: '#10b981' },
  { name: '紅色', value: '#ef4444' },
  { name: '紫色', value: '#8b5cf6' },
  { name: '橘色', value: '#f59e0b' },
  { name: '粉色', value: '#ec4899' }
]

// 計算日曆屬性
const calendarAttributes = computed(() => {
  const attrs = [
    {
      key: 'today',
      highlight: {
        color: 'red',
        fillMode: 'outline'
      },
      dates: new Date()
    }
  ]

  // 為每個事件日期添加標記
  events.value.forEach(event => {
    const existingAttr = attrs.find(attr =>
      attr.dates && new Date(attr.dates).toDateString() === new Date(event.date).toDateString()
    )

    if (!existingAttr) {
      attrs.push({
        key: event.id,
        dot: {
          color: event.color,
          class: 'event-dot'
        },
        dates: new Date(event.date)
      })
    }
  })

  return attrs
})

// 選中日期的行程
const selectedDayEvents = computed(() => {
  const selected = new Date(selectedDate.value).toDateString()
  return events.value
    .filter(event => new Date(event.date).toDateString() === selected)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
})

// 選中日期顯示
const selectedDateDisplay = computed(() => {
  const date = new Date(selectedDate.value)
  const today = new Date().toDateString()
  if (date.toDateString() === today) {
    return '今天'
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

// 統計資料
const totalEvents = computed(() => events.value.length)

const todayEvents = computed(() => {
  const today = new Date().toDateString()
  return events.value.filter(event =>
    new Date(event.date).toDateString() === today
  ).length
})

const upcomingEvents = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  return events.value.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate >= today && eventDate <= nextWeek
  }).length
})

// 回到今天
const moveToday = () => {
  selectedDate.value = new Date()
  calendar.value?.move(new Date())
}

// 點擊日期
const onDayClick = (day) => {
  selectedDate.value = day.date
}

// 開啟新增 Modal
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  currentEvent.value = {
    title: '',
    date: formatDate(selectedDate.value),
    startTime: '09:00',
    endTime: '10:00',
    category: '工作',
    color: '#3b82f6',
    description: ''
  }
  showModal()
}

// 編輯行程
const editEvent = (event) => {
  isEditing.value = true
  editingId.value = event.id
  currentEvent.value = { ...event }
  showModal()
}

// 儲存行程
const saveEvent = () => {
  // 驗證時間順序
  if (currentEvent.value.startTime >= currentEvent.value.endTime) {
    showToast('結束時間必須晚於開始時間', 'danger')
    return
  }

  if (isEditing.value) {
    // 更新現有行程
    const index = events.value.findIndex(e => e.id === editingId.value)
    if (index !== -1) {
      events.value[index] = { ...currentEvent.value, id: editingId.value }
      showToast('行程已更新', 'success')
    }
  } else {
    // 新增行程
    const newEvent = {
      ...currentEvent.value,
      id: Date.now().toString()
    }
    events.value.push(newEvent)
    showToast('行程已新增', 'success')
  }

  eventStorage.save(events.value)
  hideModal()
}

// 刪除行程
const deleteEvent = (event) => {
  if (confirm(`確定要刪除「${event.title}」嗎？`)) {
    events.value = events.value.filter(e => e.id !== event.id)
    eventStorage.save(events.value)
    showToast('行程已刪除', 'success')
  }
}

// Modal 控制
const showModal = () => {
  if (!eventModal.value) {
    eventModal.value = new Modal(document.getElementById('eventModal'))
  }
  eventModal.value.show()
}

const hideModal = () => {
  eventModal.value?.hide()
}

// 日期格式化
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 載入資料
onMounted(() => {
  events.value = eventStorage.fetch()
})
</script>

<style lang="scss" scoped>
.calendar-container {
  color: #fff;

  h1 {
    font-weight: bold;
  }
}

.calendar-card,
.events-card,
.stats-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.calendar-header {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.events-list {
  max-height: 400px;
  overflow-y: auto;
}

.event-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-left: 4px solid;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.2);
  }
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.event-category {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: white;
  font-weight: bold;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
}

.event-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.event-time {
  font-size: 0.9rem;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
}

.event-desc {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.4;
}

.no-events {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 1.1rem;
}

.stats-card {
  h5 {
    margin-bottom: 1rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.8rem;
  color: #cbd5e1;
  margin-top: 0.25rem;
}

.color-picker {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-option {
  cursor: pointer;

  input {
    display: none;
  }

  .color-box {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 3px solid transparent;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  input:checked+.color-box {
    border-color: #fff;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
}

// Modal 樣式覆蓋
.modal-content {
  background: #222;
  color: #fff;

  .form-label {
    color: #cbd5e1;
  }

  .form-control,
  .form-select {
    background: #333;
    border-color: #555;
    color: #fff;

    &:focus {
      background: #3a3a3a;
      border-color: #3b82f6;
      color: #fff;
    }
  }

  .btn-close {
    filter: invert(1);
  }
}

// 自訂滾動條
.events-list::-webkit-scrollbar {
  width: 8px;
}

.events-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.events-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>