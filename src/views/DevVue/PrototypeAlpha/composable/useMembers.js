import { ref, onMounted } from 'vue'
import { useToast } from '../../../../composables/useToast.js'

export function useMembers() {
  const { showToast } = useToast() // 引用 Toast
  const dataA = ref([]) // 將res的值複製到data
  const selectedMember = ref(null) // 確認點選資料狀態

  const getDataA = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then(json => {
        dataA.value = json
      })
  }

  const deleteItem = (member) => {
    dataA.value = dataA.value.filter(item => item.id !== member.id)
    showToast(`已刪除 ID: ${member.id}`, 'success')
  }

  const updateMember = (updatedMember) => {
    const index = dataA.value.findIndex(item => item.id === updatedMember.id)
    if (index !== -1) { 
      dataA.value[index] = { ...updatedMember }
      showToast(`已更新 ID: ${updatedMember.id}`, 'success')
    }
  }

  onMounted(getDataA)

  return { dataA, selectedMember, deleteItem, updateMember }
}