<template>
  <div class="content-e mb-5">
    <h1>FileUpload</h1>
    <form>
      <div class="row">
        <h3>Base64</h3>
        <div class="col-md-3">
          <div class="mb-3">
            <label for="formFile" class="form-label">選擇檔案</label>
            <input class="form-control" type="file" @change="handleUpload" accept="image/*" id="imgUpload">
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary" @click="clearImgFile">clear</button>
          </div>
        </div>
        <div class="col-md-2">
          <div class="mb-3">
            <p>圖片預覽：</p>
            <img :src="previewUrl" alt="" class="img-fluid">
          </div>
        </div>
        <div class="col-md-7">
          <div class="mb-3">
            <p>檔案資訊：{{ fileInfo.name }}</p>
            <p>檔案大小：{{ (fileInfo.size / 1024).toFixed(2) }} KB</p>
            <p>檔案類型：{{ fileInfo.type }}</p>
            <p>最後修改時間：{{ fileInfo.lastModifiedDate }}</p>
          </div>
        </div>

        <hr>
        <h3>IndexedDB</h3>
        <div class="col-md-3">
          <div class="mb-3">
            <label for="idbUpload" class="form-label">選擇檔案（儲存至 IndexedDB）</label>
            <input class="form-control" type="file" @change="handleIdbUpload" accept="image/*" id="idbUpload">
          </div>
          <div class="mb-3">
            <button type="button" class="btn btn-success me-2" @click="saveToIdb">儲存</button>
            <button type="button" class="btn btn-secondary" @click="loadFromIdb">讀取全部</button>
          </div>
        </div>
        <div class="col-md-9 mt-5">
          <div class="mb-3">
            <div v-for="item in idbImages" :key="item.id" class="d-flex align-items-center mb-2 idb-item">
              <img :src="item.base64" alt="" style="width:80px; height:80px; object-fit:cover;" class="me-2 rounded">
              <span class="me-2 text-truncate" style="max-width:150px;">{{ item.name }}</span>
              <button type="button" class="btn btn-sm btn-danger" @click="deleteFromIdb(item.id)">刪除</button>
              <div class="info" v-if="idbImages.length > 0">
                <p>檔案名稱：{{ item.name }}</p>
                <p>檔案大小：{{ (item.size / 1024).toFixed(2) }} KB</p>
                <p>檔案類型：{{ item.type }}</p>
                <p>最後修改時間：{{ item.lastModifiedDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <hr>
        <h3>URL.createObjectURL</h3>
        <div class="col-md-3">
          <div class="mb-3">
            <input class="form-control mb-3" type="file" @change="handleFileChange">
          </div>
        </div>
        <div class="col-md-2">
          <img :src="imageUrl" alt="預覽圖" class="img-fluid"
            v-if="urlFileInfo.type !== '' && urlFileInfo.type.startsWith('image/')">
          <p v-else>非圖片檔</p>
        </div>
        <div class="col-md-7" v-if="imageUrl">
          <p>檔案名稱：{{ urlFileInfo.name }}</p>
          <p>檔案大小：{{ (urlFileInfo.size / 1024).toFixed(2) }} KB</p>
          <p>檔案類型：{{ urlFileInfo.type }}</p>
          <p>最後修改時間：{{ urlFileInfo.lastModifiedDate }}</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { openDB } from 'idb' // 引入 idb 庫以使用 IndexedDB 功能
const previewUrl = ref('') // 用於存儲圖片預覽的 URL
const fileInfo = ref({}) // 用於存儲檔案資訊的物件

/**
 * 將 File 物件轉換為 Base64 字串
 * @param {File} file // 要轉換的檔案物件
 * @returns {Promise<string>} // 轉換完成後的 Base64 字串
 */
// 將 File 物件轉換為 Base64 字串的函式
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => { // 回傳一 Promise 物件，讓呼叫者可以使用 async/await 或 .then() 來處理轉換結果
    const reader = new FileReader() // 建立 FileReader，用於讀取檔案內容
    reader.readAsDataURL(file) // 使用 readAsDataURL 讀取檔案，將檔案內容轉換為 Base64 編碼的 Data URL
    reader.onload = () => { // 當檔案讀取完成後，會觸發 onload 事件，這裡將讀取結果傳遞給 resolve 函式，表示轉換成功
      resolve(reader.result) // 讀取結果會是包含 Base64 編碼的 Data URL 字串
    }
    reader.onerror = (error) => reject(error) // 如果讀取過程中發生錯誤，會觸發 onerror 事件，這裡將錯誤資訊傳遞給 reject 函式，表示轉換失敗
  })
}

const handleUpload = async (event) => { // 處理檔案上傳的函式，使用 async/await 來等待 fileToBase64 函式完成轉換
  const file = event.target.files[0] // 從事件物件中取得使用者選擇的檔案，這裡只處理第一個檔案（如果允許多檔案上傳，則需要進行迴圈處理）
  fileInfo.value = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModifiedDate: file.lastModifiedDate
  }
  if (!file) return // 如果為空值，直接返回
  try { // 嘗試將檔案轉換為 Base64 字串，如果成功，則將結果輸出到控制台；如果失敗，則捕捉錯誤並輸出錯誤資訊
    const base64Result = await fileToBase64(file) // 呼叫 fileToBase64 函式，並等待轉換完成，將結果存儲在 base64Result 變數中
    previewUrl.value = base64Result // 更新圖片預覽的 URL
    console.log(base64Result)
    console.log(fileInfo.value)
  } catch (error) { // 如果轉換過程中發生錯誤，會進入 catch 區塊，這裡將錯誤資訊輸出到控制台
    console.log('讀取檔案失敗', error)
  }
}

const clearImgFile = (e) => { // 清除圖片預覽函式
  previewUrl.value = '' // 清除圖片預覽
  e.target.form.reset() // 重置表單，清除檔案輸入
  fileInfo.value = {} // 清除檔案資訊
}


// IndexedDB 上傳區塊
const idbFile = ref(null) // 暫存選取的檔案
const idbImages = ref([]) // 顯示所有存入的圖片陣列

const handleIdbUpload = (event) => { // 暫存使用者選取的檔案，等待按下儲存才寫入 IndexedDB
  idbFile.value = event.target.files[0] || null
  console.log(idbFile.value)
}

const saveToIdb = async () => { // 將選取的檔案轉為 Base64 後儲存至 IndexedDB
  if (!idbFile.value) return
  try {
    const base64 = await fileToBase64(idbFile.value) // 呼叫 fileToBase64 函式，並等待轉換完成，將結果存儲在 base64 變數中
    const taskDB = await useTaskDB() // 呼叫 useTaskDB 函式，並等待資料庫連線完成，將結果存儲在 taskDB 變數中
    await taskDB.addTask({
      name: idbFile.value.name,
      type: idbFile.value.type,
      size: idbFile.value.size,
      lastModifiedDate: idbFile.value.lastModifiedDate,
      base64
    }) // 呼叫 taskDB 的 addTask 方法，將檔案名稱和 Base64 字串作為參數，儲存到 IndexedDB 中
    idbFile.value = null // 儲存後清除暫存的檔案
    await loadFromIdb() // 儲存後自動重新讀取清單
  } catch (error) {
    console.log('儲存失敗', error)
  }
}

const loadFromIdb = async () => { // 從 IndexedDB 讀取所有圖片
  try {
    const taskDB = await useTaskDB()
    idbImages.value = await taskDB.getAllTasks()
  } catch (error) {
    console.log('讀取失敗', error)
  }
}

const deleteFromIdb = async (id) => { // 從 IndexedDB 刪除指定圖片
  try {
    const taskDB = await useTaskDB()
    await taskDB.deleteTask(id)
    await loadFromIdb() // 刪除後自動重新讀取清單
  } catch (error) {
    console.log('刪除失敗', error)
  }
}

// IndexedDB 相關功能的示範
// 封裝可重複使用的 composable 或工具函式
const useTaskDB = async () => { // 定義 useTaskDB 的函式，使用 async/await 來處理 IndexedDB 的非同步操作
  const db = await openDB('TaskSystem', 1, { // 開啟 TaskSystem 的資料庫，序號為 1，如果資料庫不存在或序號較舊，則會觸發 upgrade 呼叫函式
    upgrade(db) { // 新增或升級資料庫的邏輯，這裡會檢查是否已經存在 tasks 的 object store，如果不存在則建立
      if (!db.objectStoreNames.contains('tasks')) { // 檢查是否已經存在 tasks 的 object store，如果不存在則建立
        db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true }) // 建立 tasks 的 object store，使用 id 作為主鍵，並且自動遞增
      }
    }
  })

  return {
    async addTask(task) { // 定義 addTask 的函式，接受一個 task 物件作為參數，使用 async/await 來處理 IndexedDB 的非同步操作
      return await db.add('tasks', task)
    },
    async getAllTasks() { // 定義 getAllTasks 的函式，使用 async/await 來處理 IndexedDB 的非同步操作，回傳所有的任務資料
      return await db.getAll('tasks')
    },
    async deleteTask(id) { // 定義 deleteTask 的函式，接受一個 id 作為參數，使用 async/await 來處理 IndexedDB 的非同步操作，刪除指定的任務資料
      return await db.delete('tasks', id)
    }
  }
}

// Object URL 的示範
const imageUrl = ref(null) // 用於存儲 Object URL 的變數
const urlFileInfo = ref({ name: '', size: 0, type: '', lastModifiedDate: '' }) // 用於存儲檔案資訊的物件

const handleFileChange = (event) => {
  const file = event.target.files[0] // 從事件物件中取得檔案，這裡只處理第一個檔案
  urlFileInfo.value = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModifiedDate: file.lastModifiedDate
  }
  if (!file) return
  // 換檔案時，先釋放舊的URL
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value) // 釋放之前的 Object URL，避免記憶體堆積
  }
  imageUrl.value = URL.createObjectURL(file) // 建立新的 Object URL
}

// 元件銷毀時，釋放最後一個URL
onUnmounted(() => {
  if (imageUrl.value) { // 如果存在 Object URL，則釋放它以清理記憶體
    URL.revokeObjectURL(imageUrl.value)
  }
})
</script>

<style lang="scss" scoped>
.idb-item {
  border: solid 1px var(--text-color);
  padding: 0.5em;
  border-radius: 5px;

  .info {
    margin-left: 2em;
    border-left: solid 1px var(--text-color);
    padding: 0.5em 1em;
  }
}
</style>