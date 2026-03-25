<template>
  <h1 class="mb-4">會員資料修改</h1>
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
import { ref } from 'vue'
import { useMembers } from './composable/useMembers.js' // 引入 useMembers
const { dataA, selectedMember, updateMember, deleteItem } = useMembers()

const modal = ref(null)
const callModal = (member) => { // 呼叫 Modal 並傳遞成員資料
  selectedMember.value = member // 呼叫同時帶入被選定的 member 資料
  modal.value = new Modal(document.querySelector('.modal'))
  modal.value.show()
}

const deleteConfirm = (member) => {
  if (confirm(`確認要刪除 ID: ${member.id}?`)) {
    deleteItem(member) // 傳入整個 member 物件
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  border: solid 1px var(--panel-border, #555);

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr th {
    background: var(--table-header-bg, #555);
    font-weight: 700;
    color: var(--text-color, #fff);
    border-right: solid 1px var(--panel-border, #666);

    &:last-child {
      border-right: none;
    }
  }

  tbody tr {
    transition: background 0.2s;

    &:nth-child(odd) {
      background: rgba(255, 255, 255, 0.03);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  th,
  td {
    border: solid 1px var(--panel-border, #555);
    padding: 10px 12px;
    text-align: left;
  }

  td:last-child {
    display: flex;
    gap: 6px;
    align-items: center;
  }
}
</style>