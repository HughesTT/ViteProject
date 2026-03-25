<template>
  <h1 class="mb-3">新增項目</h1>
  <div class="itmesDataCover" v-if="itemList.length < 1">尚未新增任何項目</div>
  <div class="itemsData mb-5" v-else>
    <div class="row newitem mb-2" v-for="listItem in itemList" :key="listItem.title">
      <div class="col-md-3 newitem-img">
        <img :src="listItem.url" alt="New Member Image" />
      </div>
      <div class="col-md-2 newitem-title">{{ listItem.title }}</div>
      <div class="col-md-4 newitem-des">{{ listItem.description }}</div>
      <div class="col-md-2 newitem-price">${{ currency(listItem.price) }}</div>
      <div class="col-md-1">
        <button class="btn btn-secondary btn-sm mb-2" @click.prevent="editItem(listItem)">編輯</button>
        <button class="btn btn-danger btn-sm" @click.prevent="deleteItem(listItem)">刪除</button>
      </div>
    </div>
  </div>
  <div>
    <div class="col-md-1 addnewitem" @click="toggleForm">+ 新增項目</div>
    <div class="form-area" style="display: none;">
      <AddItemForm v-model="item" :isEditing="isEditing" @submit="isEditing ? updateItem() : addItem()"
        @cancel="cancelEdit" @clear="clearInput" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useToast } from '../../../composables/useToast.js' // 引入 useToast
import { currency } from '../../DevVue/methods/filters.js'
import AddItemForm from '../../DevVue/PrototypeAlpha/component/AddItemForm.vue' // 引入新增項目的表單元件
const { showToast } = useToast()
const itemSTORAGE_KEY = 'item-list-prototypealpha' // 定義 localStorage 的 key
// 宣告 itemStorage 物件，包含 save 與 fetch 方法
const itemStorage = {
  fetch() {
    const items = JSON.parse(localStorage.getItem(itemSTORAGE_KEY) || '[]')
    items.forEach(function (item, index) {
      item.id = index
    })
    itemStorage.uid = items.length
    return items
  },
  save(items) {
    localStorage.setItem(itemSTORAGE_KEY, JSON.stringify(items))
  }
}
const itemList = ref([]) // 定義 itemList 陣列來存放新增的項目
const item = ref({ // 定義 item 物件來綁定表單資料
  title: '',
  url: '',
  price: null,
  description: ''
})
const isEditing = ref(false) // 是否正在編輯
const editingIndex = ref(-1) // 正在編輯的項目索引
// 新增項目
const addItem = () => {
  // 驗證表單欄位是否填寫完整
  if (item.value.title === '' || item.value.url === '' || !item.value.price) {
    showToast('請填寫所有欄位', 'danger')
    return
  }
  itemList.value.push({ ...item.value }) // 將新項目加入 itemList 陣列
  itemStorage.save(itemList.value) // 儲存至 localStorage
  showToast('新增項目成功', 'success')
  clearInput()
  toggleForm()
}

// 開啟編輯項目
const editItem = (selectedItem) => {
  const index = itemList.value.indexOf(selectedItem) // 尋找被選取項目的索引
  isEditing.value = true // 設定為正在編輯狀態
  editingIndex.value = index // 記錄正在編輯的項目索引
  item.value = { ...selectedItem } // 將選取的項目資料複製到 item 物件中
  // 展開表單區域
  const formArea = document.querySelector('.form-area')
  if (formArea.style.display === 'none' || formArea.style.display === '') {
    formArea.style.display = 'block'
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  }
}

// 更新項目
const updateItem = () => {
  // 驗證表單欄位是否填寫完整
  if (item.value.title === '' || item.value.url === '' || !item.value.price) {
    showToast('請填寫所有欄位', 'danger')
    return
  }
  // 判定是否有正在編輯的項目
  if (editingIndex.value > -1) {
    itemList.value[editingIndex.value] = { ...item.value } // 更新對應索引的項目資料
    itemStorage.save(itemList.value) // 儲存至 localStorage
    showToast('更新項目成功', 'success')
    isEditing.value = false // 重設編輯狀態
    editingIndex.value = -1 // 重設編輯索引
    clearInput()
    toggleForm()
  }
}
const deleteItem = (item) => {
  const index = itemList.value.indexOf(item)
  if (index > -1) {
    const confirmed = window.confirm('確定要刪除這個項目嗎？')
    if (!confirmed) {
      return
    } else {
      itemList.value.splice(index, 1) // 從 itemList 陣列中移除指定索引的項目
      itemStorage.save(itemList.value) // 儲存至 localStorage
      showToast('刪除項目成功', 'success')
    }
  }
}
// 取消編輯
const cancelEdit = () => {
  isEditing.value = false // 重設編輯狀態
  editingIndex.value = -1 // 重設編輯索引
  clearInput()
  toggleForm()
}
// 清除輸入欄位
const clearInput = () => {
  item.value = { title: '', url: '', price: null, description: '' }
}
// 表單區域顯示與隱藏切換
const toggleForm = () => {
  const formArea = document.querySelector('.form-area')
  if (formArea.style.display === 'none' || formArea.style.display === '') {
    isEditing.value = false
    editingIndex.value = -1
    clearInput()
    formArea.style.display = 'block'
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  } else {
    formArea.style.display = 'none'
    isEditing.value = false
    editingIndex.value = -1
    clearInput()
  }
}

// 監聽 itemList 的變化並儲存至 localStorage
watch(
  itemList,
  () => {
    itemStorage.save(itemList.value)
  },
  { deep: true }
)

// 生命週期函式，載入時從 localStorage 取得資料
onMounted(() => {
  itemList.value = itemStorage.fetch()
})
</script>

<style lang="scss" scoped>
.itmesDataCover {
  color: #999;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  padding: 50px 0;
}

.itemsData {
  .newitem {
    background: var(--panel-bg, #444);
    padding: 10px;
    border-radius: 10px;
    overflow: hidden;
    border: solid 1px var(--panel-border, #555);
    transition: background 0.2s, box-shadow 0.2s;

    &:hover {
      background: var(--sidebar-hover-bg, #555);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    }

    .newitem-img {
      overflow: hidden;

      img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 6px;
      }
    }

    .newitem-title {
      color: var(--text-color, #fff);
      font-size: 1.2em;
      font-weight: bold;
    }

    .newitem-price {
      color: #f66;
      font-size: 1.2em;
      font-weight: bold;
      text-align: left;
    }

    .newitem-des {
      color: var(--event-desc-color, #ccc);
      font-size: 1em;
      margin-top: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 6em;
    }
  }
}

.addnewitem {
  color: #60a5fa;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 8px;
  text-align: center;
  border: solid 1px #60a5fa;
  border-radius: 15px;
  transition: ease-in-out 0.2s;
  display: inline-block;

  &:hover {
    background: #60a5fa;
    color: #1e293b;
  }
}

.form-area {
  color: var(--text-color, #fff);
  font-weight: bold;
  background: var(--panel-bg, #444);
  border: solid 1px var(--panel-border, #555);
  border-radius: 10px;
  padding: 20px;
  margin-top: 10px;

  img {
    width: 100%;
    height: auto;
    border: solid 1px var(--panel-border, #555);
    border-radius: 5px;
  }
}
</style>