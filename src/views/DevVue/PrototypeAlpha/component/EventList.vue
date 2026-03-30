<template>
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
              <button class="btn-icon" @click="emit('editEvent', event)" title="編輯">
                ✏️
              </button>
              <button class="btn-icon" @click="emit('deleteEvent', event)" title="刪除">
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedDate: { type: Date, required: true },  // 目前選定的日期
  events: { type: Array, required: true }         // 全部行程資料陣列
})
const emit = defineEmits(['editEvent', 'deleteEvent'])

// 顯示選定日期
const selectedDateDisplay = computed(() => {
  const date = new Date(props.selectedDate)
  const today = new Date().toDateString()
  if (date.toDateString() === today) {
    return '今天'
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

// 選定日期的行程（由 props.events 篩選）
const selectedDayEvents = computed(() => {
  const selected = new Date(props.selectedDate).toDateString()
  return props.events.filter(e => new Date(e.date).toDateString() === selected).sort((a, b) => a.startTime.localeCompare(b.startTime))
})
</script>

<style lang="scss" scoped>
.calendar-card,
.events-card,
.stats-card {
  background: var(--events-card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2.3em;
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
</style>