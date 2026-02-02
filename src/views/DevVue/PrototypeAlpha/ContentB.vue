<template>
  <h1 class="mb-3">Add New Item</h1>
  <div class="itmesDataCover" v-if="itemList.length < 1">尚未新增任何項目</div>
  <div class="itemsData mb-5" v-else>
    <div class="row newitem mb-2" v-for="item in itemList" :key="item.title">
      <div class="col-md-3 newitem-img">
        <img :src="item.url" alt="New Member Image" />
      </div>
      <div class="col-md-2 newitem-title">{{ item.title }}</div>
      <div class="col-md-5 newitem-des">{{ item.description }}</div>
      <div class="col-md-1 newitem-price">${{ item.price }}</div>
      <div class="col-md-1">
        <button class="btn btn-danger btn-sm" @click.prevent="deleteItem(item)">Delete</button>
      </div>
    </div>
  </div>
  <div>
    <div class="col-md-1 addnewitem" @click="toggleForm">+ 新增項目</div>
    <div class="form-area" style="display: none;">
      <form>
        <div class="row">
          <div class="col-md-3 mb-3">
            <label for="">Title</label>
            <input type="text" class="form-control" id="" placeholder="Name" v-model="item.title" />
          </div>
          <div class="col-md-6 mb-3">
            <label for="">Image</label>
            <input type="text" class="form-control" id="" placeholder="Image url" v-model="item.url" />
          </div>
          <div class="col-md-3 mb-3">
            <label for="">Price</label>
            <input type="number" class="form-control" min="1" id="" placeholder="Price" v-model="item.price" />
          </div>
          <div class="col-md-12 mb-3">
            <label for="">Description</label>
            <textarea rows="3" class="form-control" id="" placeholder="Description"
              v-model="item.description"></textarea>
          </div>
          <div class="col-md-12 mb-3">
            <button type="submit" class="btn btn-primary me-2" @click.prevent="addItem">增加</button>
            <button type="reset" class="btn btn-secondary" @click.prevent="clearInput">清除</button>
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
const { showToast } = useToast()
const itemList = ref([]) // 定義 itemList 陣列來存放新增的項目
const item = ref({ // 定義 item 物件來綁定表單資料
  title: '',
  url: '',
  price: null,
  description: ''
})
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
const addItem = () => {
  if (item.value.title === '' || item.value.url === '' || !item.value.price) {
    showToast('請填寫所有欄位', 'danger')
    return
  } else {
    itemList.value.push({ ...item.value }) // 將目前的 item 物件加入 itemList 陣列
    itemStorage.save(itemList.value) // 將更新後的 itemList 儲存到 localStorage
    item.value = { title: '', url: '', price: null, description: '' } // 清空表單
    toggleForm() // 隱藏表單
    showToast('新增項目成功', 'success')
  }
  console.log('增加的項目:', item.value)
}
const deleteItem = (item) => {
  const index = itemList.value.indexOf(item)
  if (index > -1) {
    const confirmed = window.confirm('確定要刪除這個項目嗎？')
    if (!confirmed) {
      return
    } else {
      itemList.value.splice(index, 1)
      showToast('刪除項目成功', 'success')
    }
  }
}
const clearInput = () => {
  item.value = { title: '', url: '', price: null, description: '' }
}

const toggleForm = () => {
  const formArea = document.querySelector('.form-area')
  if (formArea.style.display === 'none' || formArea.style.display === '') {
    setTimeout(() => {
      formArea.style.display = 'block'
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  } else {
    formArea.style.display = 'none'
  }
}

watch(
  itemList,
  () => {
    itemStorage.save(itemList.value)
  },
  { deep: true }
)

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
    background: #eee;
    padding: 10px;
    border-radius: 10px;
    overflow: hidden;

    .newitem-img {
      height: 200px;
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
}
</style>