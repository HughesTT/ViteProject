<template>
  <div class="user-card">
    <div class="user-avatar">
      {{ name?.charAt(0)?.toUpperCase() }}
    </div>
    <div class="user-info">
      <h3>{{ name }}</h3>
      <p>年齡: {{ age }} 歲</p>
      <p>Email: {{ email }}</p>
      <span class="status" :class="{ active: isActive, inactive: !isActive }">
        {{ isActive ? '線上' : '離線' }}
      </span>
    </div>
  </div>
</template>

<script setup>
// 定義 props，展示不同類型的屬性驗證
const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => value.length > 0
  },
  age: {
    type: Number,
    required: true,
    validator: (value) => value > 0 && value < 150
  },
  email: {
    type: String,
    required: true,
    validator: (value) => /\S+@\S+\.\S+/.test(value)
  },
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  max-width: 400px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 15px;
}

.user-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-info p {
  margin: 5px 0;
  color: #666;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status.active {
  background-color: #28a745;
  color: white;
}

.status.inactive {
  background-color: #6c757d;
  color: white;
}
</style>