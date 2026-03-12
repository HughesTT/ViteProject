<template>
  <div>
    <h1>VCalendar 新增 / 編輯行程</h1>
    <div>
      <div class="row">
        <!-- 左側日期欄 -->
        <div class="col-md-7 mt-5">
          <button class="btn btn-sm btn-outline-light mb-2" @click="moveToday">Today</button>
          <button class="btn btn-sm btn-success ms-2 mb-2" @click="openAddModal">
            <i class="bi bi-plus"></i> 新增行程
          </button>
          <VDatePicker ref="Calendar" v-model="selectedDate" :attributes="calendarAttributes" title-position="left"
            expanded @dayclick="onDayClick">
          </VDatePicker>
          <p>選擇的日期: {{ selectedDate }}</p>
        </div>
        <!-- 右側行程列表 -->
        <div class="col-md-5 mt-5">
          <div class="events-card">
            <h3 class="mb-3">
              {{ selectedDateDisplay }} 的行程
              <span class="badge bg-info ms-2">
                {{ selectedDayEvents.length }}
              </span>
            </h3>
            <div class="no-events" v-if="selectedDayEvents.length === 0">沒有安排行程</div>
            <div class="events-list" v-else>
              <div class="event-item" v-for="event in selectedDayEvents" :key="event.id"
                :style="{ borderLeftColr: event.color }">
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
                <div class="event-title">
                  {{ event.title }}
                </div>
                <div class="event-time">
                  <i class="bi bi-clock"></i> {{ event.startTime }} - {{ event.endTime }}
                </div>
                <div class="event-desc" v-if="event.description">{{ event.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="eventModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '編輯行程' : '新增行程' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEvent">
              <div class="mb-3">
                <label class="form-label">標題</label>
                <input type="text" class="form-control" placeholder="輸入行程標題" v-model="currentEvent.title">
              </div>

              <div class="mb-3">
                <label class="form-label">日期</label>
                <input type="date" class="form-control" v-model="currentEvent.date">
              </div>

              <div class="row mb-3">
                <div class="col-6">
                  <label class="form-label">開始時間</label>
                  <input type="time" class="form-control" v-model="currentEvent.startTime">
                </div>
                <div class="col-6">
                  <label class="form-label">結束時間</label>
                  <input type="time" class="form-control" v-model="currentEvent.endTime">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">分類</label>
                <select class="form-select" v-model="currentEvent.category">
                  <option value="工作">工作</option>
                  <option value="會議">會議</option>
                  <option value="休閒">休閒</option>
                  <option value="運動">運動</option>
                  <option value="個人">個人</option>
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
                <textarea rows="3" class="form-control" placeholder="行程說明"
                  v-model="currentEvent.description"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-primary" @click="saveEvent">{{ isEditing ? '更新' : '新增' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from '../../../composables/useToast.js';
import Modal from 'bootstrap/js/dist/modal'

const { showToast } = useToast();
const Calendar = ref(null); // 綁定 VDatePicker 元件
const selectedDate = ref(new Date()) // 月曆選定的日期
const eventModal = ref(null) // 用於控制新增/編輯行程的 modal
const isEditing = ref(false) // 是否正在編輯或新增行程
const editingId = ref(null) // 正在編輯的行程 ID

const STORAGE_KEY = 'calendar-events-prototypealpha'
const eventStorage = { // 將行程儲存在 localStorage 中
  fetch() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  },
  save(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }
}
// 定義行程資料為陣列
const events = ref([])

// 點擊日期
const onDayClick = (day) => {
  selectedDate.value = day.date
}

// 顯示 modal
const showModal = () => {
  if (!eventModal.value) { // 如果 modal 實例不存在，則創建一個新的 Modal 實例
    eventModal.value = new Modal(document.getElementById('eventModal')) // 這裡設定的 modal 的 id 是 'eventModal'
  }
  eventModal.value.show()
}
const hideModal = () => {
  eventModal.value?.hide()
}

// 點選新增行程，開啟新增 modal
const openAddModal = () => {
  isEditing.value = false // 編輯狀態設為 false，表示是新增行程
  currentEvent.value = {
    title: '',
    date: formatDate(selectedDate.value), // 未選擇其他日期，將今日日期預設為選定的日期
    startTime: '09:00', // 預設開始時間
    endTime: '10:00', // 預設結束時間
    category: '工作', // 預設分類
    color: '#3b82f6', // 預設顏色
    description: '' // 預設說明為空
  }
  showModal()
}

// 目前編輯的行程資料
const currentEvent = ref({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  category: '工作',
  color: '#3b82f6',
  description: ''
})

// 定義新增編輯時的顏色標記選項
const colorOptions = [
  { name: '藍色', value: '#3b82f6' },
  { name: '綠色', value: '#10b981' },
  { name: '黃色', value: '#f59e0b' },
  { name: '紅色', value: '#ef4444' },
  { name: '紫色', value: '#8b5cf6' },
  { name: '粉色', value: '#ec4899' }
]

// 日曆特殊日期標記
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
  events.value.forEach(event => {
    const existingAttr = attrs.find(attr => attr.dates && new Date(attr.dates).toDateString() === new Date(event.date).toDateString())

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

// 回到今天
const moveToday = () => {
  selectedDate.value = new Date()
  Calendar.value?.move(new Date())
}

// 日期格式化
const formatDate = (date) => { // 將日期轉換為 YYYY-MM-DD 格式
  const d = new Date(date) // 確保日期格式正確
  const year = d.getFullYear() // 取得年份
  const month = String(d.getMonth() + 1).padStart(2, '0') // 取得月份，1月份為 0 +1，設定為兩位數，若不足則補零
  const day = String(d.getDate()).padStart(2, '0') // 取得日期，設定為兩位數，若不足則補零
  return `${year}-${month}-${day}` // 回傳格式化後的日期字串
}

// 儲存行程
const saveEvent = () => {
  // 驗證時間順序
  if (currentEvent.value.startTime >= currentEvent.value.endTime) {
    showToast('結束時間必須晚於開始時間', 'error')
    return
  } else if (!currentEvent.value.title.trim()) {
    showToast('行程標題不能為空', 'error')
    return
  }
  if (isEditing.value) { // 編輯行程狀態
    // 找到正在編輯的行程並更新
    const index = events.value.findIndex(e => e.id === editingId.value)
    if (index !== -1) { // 若找到行程資料
      events.value[index] = { ...currentEvent.value, id: editingId.value } // 更新行程資料並保留 ID
      eventStorage.save(events.value) // 儲存更新後的行程資料
      showToast('行程已更新', 'success')
    }
  } else { // 新增行程狀態
    const newEvent = { // 定義新的行程資料
      ...currentEvent.value, // 使用 currentEvent 的資料
      id: Date.now().toString() // 以 timestamp 作為唯一 ID
    }
    events.value.push(newEvent) // 將新的行程資料加入 events 陣列
    eventStorage.save(events.value) // 儲存更新後的行程資料
    showToast('行程已新增', 'success') // 顯示成功訊息
  }
  console.log(currentEvent.value)
  hideModal()
}

// 編輯行程
const editEvent = (event) => {
  isEditing.value = true
  editingId.value = event.id // 記錄正在編輯的行程 ID
  currentEvent.value = { ...event } // 將選定的行程資料複製到 currentEvent 中
  showModal() // 顯示 modal 以編輯行程
}

// 刪除行程
const deleteEvent = (event) => {
  if (confirm(`確定要刪除 ${event.title} 的行程嗎 ?`)) {
    events.value = events.value.filter(e => e.id !== event.id) // 將 events 陣列中 ID 不等於要刪除的行程 ID 的資料留下
    eventStorage.save(events.value) // 儲存更新後的行程資料
    showToast('行程已刪除', 'success') // 顯示成功訊息
  }
}

// 顯示選定日期
const selectedDateDisplay = computed(() => {
  const date = new Date(selectedDate.value) // 如果選定日期是今天，顯示 "今天"
  const today = new Date().toDateString() // 將今天的日期轉換為字串格式
  if (date.toDateString() === today) {
    return '今天'
  }
  return `${date.getMonth() + 1}月${date.getDate()}日` // 否則顯示 "X月X日"
})

// 選定日期的行程
const selectedDayEvents = computed(() => {
  const selected = new Date(selectedDate.value).toDateString() // 篩選出日期相同的行程資料
  return events.value.filter(e => new Date(e.date).toDateString() === selected).sort((a, b) => a.startTime.localeCompare(b.startTime)) // 將行程資料依照開始時間排序
})

onMounted(() => {
  events.value = eventStorage.fetch() // 從 localStorage 中讀取行程資料
})
</script>

<style lang="scss" scoped>
.btn-outline-light {
  color: var(--btn-outline-light-color);
  border-color: var(--btn-outline-light-color);

  &:hover {
    background-color: var(--btn-outline-light-color);
    color: #fff;
  }
}

.calendar-card,
.events-card,
.stats-card {
  background: var(--events-card-bg);
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
  background: var(--events-card-bg);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-left: 4px solid;
  transition: transform 0.2s;

  &:hover {
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
  font-size: 1rem;
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
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.event-time {
  font-size: 0.9rem;
  color: var(--event-time-color);
  margin-bottom: 0.5rem;
}

.event-desc {
  font-size: 0.85rem;
  color: var(--event-desc-color);
  line-height: 1.4;
}

.no-events {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 1.1rem;
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
</style>