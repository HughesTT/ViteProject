<template>
  <h1 class="mb-3">Add New Item</h1>
  <div class="itmesDataCover" v-if="itemList.length < 1">尚未新增任何項目</div>
  <div class="itemsData mb-5" v-else>
    <div class="row newitem mb-2" v-for="item in itemList" :key="item.title">
      <div class="col-md-3 newitem-img">
        <img :src="item.url" alt="New Member Image" />
      </div>
      <div class="col-md-2 newitem-title">{{ item.title }}</div>
      <div class="col-md-4 newitem-des">{{ item.description }}</div>
      <div class="col-md-2 newitem-price">${{ currency(item.price) }}</div>
      <div class="col-md-1">
        <button class="btn btn-secondary btn-sm mb-2" @click.prevent="editItem(item)">編輯</button>
        <button class="btn btn-danger btn-sm" @click.prevent="deleteItem(item)">刪除</button>
      </div>
    </div>
  </div>
  <div>
    <div class="col-md-1 addnewitem" @click="toggleForm">+ 新增項目</div>
    <div class="form-area" style="display: none;">
      <form>
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="col-md-12 mb-3">
              <label for="">標題</label>
              <input type="text" class="form-control" id="" placeholder="標題" v-model="item.title" />
            </div>
            <div class="col-md-12 mb-3">
              <label for="">價格</label>
              <input type="text" class="form-control" min="1" id="" placeholder="價格" :value="formatPrice(item.price)"
                @input="handlePriceInput" />
            </div>
          </div>
          <div class="col-md-5 mb-3">
            <label for="">圖片連結</label>
            <input type="text" class="form-control mb-2" id="" placeholder="圖片連結" v-model="item.url" />
            <label for="">預覽圖</label>
            <img :src="item.url" alt="Item Image" class="img-fluid" v-if="item.url !== ''" />
            <img src="https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2079504220.jpg"
              class="img-fluid" v-else />
          </div>
          <div class="col-md-12 mb-3">
            <label for="">說明</label>
            <textarea rows="3" class="form-control" id="" placeholder="說明文字" v-model="item.description"></textarea>
          </div>
          <div class="col-md-12 mb-3">
            <button type="submit" class="btn btn-primary me-2" @click.prevent="isEditing ? updateItem() : addItem()">
              {{ isEditing ? '更新' : '增加' }}
            </button>
            <button type="reset" class="btn btn-secondary me-2" @click.prevent="clearInput">清除</button>
            <button type="button" class="btn btn-danger" @click.prevent="cancelEdit">取消</button>
          </div>
          <div class="col-md-3">

          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useToast } from '../../../composables/useToast.js' // 引入 useToast
import { currency } from '../../DevVue/methods/filters.js'
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

// 格式化價格顯示（千分位）
const formatPrice = (price) => {
  if (!price) return ''
  return parseInt(price).toLocaleString('zh-TW')
}

// 處理價格輸入
const handlePriceInput = (e) => {
  // 移除所有非數字符號
  const value = e.target.value.replace(/[^\d]/g, '')
  // 更新實際數值
  item.value.price = value ? parseInt(value) : null
  // 更新顯示（千分位格式）
  e.target.value = value ? parseInt(value).toLocaleString('zh-TW') : ''
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
h1 {
  color: #fff;
  font-weight: bold;
}

.itmesDataCover {
  color: #999;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  padding: 50px 0;
}

.itemsData {
  .newitem {
    background: #eee;
    padding: 10px;
    border-radius: 10px;
    overflow: hidden;

    .newitem-img {
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
      }
    }

    .newitem-title {
      color: #333;
      font-size: 1.2em;
      font-weight: bold;
    }

    .newitem-price {
      color: #f00;
      font-size: 1.2em;
      font-weight: bold;
      text-align: left;
    }

    .newitem-des {
      color: #666;
      font-size: 1em;
      margin-top: 5px;
      /* 顯示多行 */
      display: -webkit-box;
      /* 限制行數 (例如4行約等於200個中文字) */
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      /* 隱藏溢出內容 */
      overflow: hidden;
      /* 顯示刪節號 ... */
      text-overflow: ellipsis;
      /* 可選：設定行高以精確控制行數 */
      max-height: 6em;
      /* line-height * line-clamp */
    }
  }
}

.addnewitem {
  color: #ffe100;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 5px;
  text-align: center;
  border: solid 1px #ffe100;
  border-radius: 15px;
  transition: ease-in-out 0.2s;

  &:hover {
    background: #ffe100;
    color: #333;
  }
}

.form-area {
  color: #333;
  font-weight: bold;
  background: #ccc;
  padding: 20px;

  img {
    width: 100%;
    height: auto;
    border: solid 1px #999;
    border-radius: 5px;
  }
}
</style>