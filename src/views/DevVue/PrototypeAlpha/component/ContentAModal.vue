<template>
  <div class="modal fade" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">編輯會員資料</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="saveChanges">
          <div class="modal-body">
            <div class="mb-3">
              <label for="member-name" class="col-form-label">Name:</label>
              <input type="text" class="form-control" id="member-name" v-model="editForm.name" />
            </div>
            <div class="mb-3">
              <label for="member-email" class="col-form-label">Email:</label>
              <input type="email" class="form-control" id="member-email" v-model="editForm.email" />
            </div>
            <div class="mb-3">
              <label for="member-phone" class="col-form-label">Phone:</label>
              <input type="text" class="form-control" id="member-phone" v-model="editForm.phone" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">儲存變更</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Modal from 'bootstrap/js/dist/modal'

const props = defineProps({
  memberData: { // 接收來自父元件的會員資料
    type: Object, // 定義為物件類型
    default: null // 預設值為 null
  }
})
// 定義更新 member 資料事件觸發
const emit = defineEmits(['update:member'])

const editForm = ref({ // 用於綁定表單資料
  id: '',
  name: '',
  email: '',
  phone: ''
})

const originalData = ref(null) // 備份原始資料用於修改 member 資料比對

// 監聽 memberData 變化，更新表單
watch(() => props.memberData, (newData) => { // 當傳遞進來的 memberData 改變時觸發
  if (newData) {
    editForm.value = {
      id: newData.id,
      name: newData.name,
      email: newData.email,
      phone: newData.phone
    }
    // 原始資料的備份副本
    originalData.value = {
      id: newData.id,
      name: newData.name,
      email: newData.email,
      phone: newData.phone
    }
  }
}, { immediate: true }) // 深層監聽，immediate會在初始時立即執行一次

// 儲存修改
const saveChanges = () => {
  // 檢查是否有修改
  const hasChanges =
    editForm.value.name !== originalData.value.name ||
    editForm.value.email !== originalData.value.email ||
    editForm.value.phone !== originalData.value.phone

  if (!hasChanges) {
    return
  } else {
    emit('update:member', editForm.value) // 觸發更新事件，將修改後的資料傳回父元件
    // 關閉 modal
    const modalElement = document.querySelector('.modal')
    const modal = Modal.getInstance(modalElement)
    modal.hide()
  }
}
</script>

<style lang="scss">
.modal-content {
  background: #eee !important;

  .col-form-label {
    font-weight: bold;
  }

  .modal-title {
    font-weight: 700;
  }
}
</style>