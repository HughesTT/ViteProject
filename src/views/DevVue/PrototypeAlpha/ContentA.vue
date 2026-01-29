<template>
  <h1 class="mb-3">Member Data</h1>
  <table>
    <thead>
      <tr>
        <th class="text-center">ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in dataA" :key="item.id">
        <td class="text-center">{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.phone }}</td>
        <td><button type="button" class="btn btn-primary" @click="callModal(item)">編輯</button>
          <button type="button" class="btn btn-danger" @click="deleteConfirm(item)">刪除</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ContentAModal :memberData="selectedMember" @update:member="updateMember" />
</template>

<script setup>
import Modal from 'bootstrap/js/dist/modal' // 引用 Bootstrap Modal
import ContentAModal from '../PrototypeAlpha/component/ContentAModal.vue' // 引用設定的 Modal 元件
import { onMounted, ref } from 'vue'
import { useToast } from '../../../composables/useToast.js' // 引入 useToast
const { showToast } = useToast()

const dataA = ref([])
const selectedMember = ref(null) // 用於存儲被選中的成員資料

const getDataA = () => {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then(json => {
      dataA.value = json
    })
}

const modal = ref(null)
const callModal = (member) => { // 呼叫 Modal 並傳遞成員資料
  selectedMember.value = member // 呼叫同時帶入被選定的 member 資料
  modal.value = new Modal(document.querySelector('.modal'))
  showModal()
  // console.log('Member:', member)
}
const showModal = () => {
  modal.value.show()
}

const deleteConfirm = (member) => {
  if (confirm(`確認要刪除 ID: ${member.id}?`)) {
    deleteItem(member)
  }
  // console.log('Delete member:', member)
}

const deleteItem = (member) => {
  dataA.value = [...dataA.value].filter(item => item.id !== member.id)
  showToast(`已刪除 ID: ${member.id}`, 'success')
}

const updateMember = (updatedMember) => {
  const index = dataA.value.findIndex(item => item.id === updatedMember.id) // 尋找要更新的資料索引
  if (index !== -1) { // 確保找到該筆資料
    dataA.value[index] = { ...updatedMember }
    showToast(`已更新 ID : ${updatedMember.id}`, 'success')
  }
}

onMounted(() => {
  getDataA()
})
</script>

<style lang="scss">
table {
  border: solid 1px #ccc;
  width: 100%;
  border-collapse: collapse;

  tr th {
    background: #ccc;
    font-weight: 700;
    color: #666;
    border-right: solid 1px #666;

    &:last-child {
      border-right: none;
    }
  }

  th,
  td {
    border: solid 1px #ccc;
    padding: 8px;
    text-align: left;
  }

  button {
    margin-right: 5px;
  }
}
</style>