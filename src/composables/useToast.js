import { ref } from 'vue'

// 全域的 toasts 狀態
const toasts = ref([])
let toastId = 0

// 顯示 toast 的函式
export function showToast(message, type = 'success', duration = 5000) {
  const id = toastId++
  toasts.value.push({ id, message, type })

  // 自動移除 toast
  setTimeout(() => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }, duration)
}

// Composable 函式
export function useToast() {
  return {
    toasts,
    showToast,
  }
}

