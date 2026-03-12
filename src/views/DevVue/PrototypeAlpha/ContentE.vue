<template>
  <div class="content-e">
    <h1>檔案管理系統</h1>
    <form>
      <div class="row">
        <h3></h3>
        <div class="col-md-3">
          <div class="panel">
            <div class="panel-title mb-3">上傳檔案</div>
            <input type="file" ref="fileInput" class="d-none" multiple @change="onFileSelect">
            <div class="dropzone" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop" @click="openFileDialog">
              <div class="text-center py-3">
                <div class="drop-icon">
                  {{ isDragging ? '📂' : '📁' }}
                </div>
                <div class="drop-text">點擊或拖曳檔案到此處上傳<br><span>支援多檔案上傳</span></div>
              </div>
            </div>
            <div class="upload-info mt-3" v-if="isUploading">
              <div class="d-flex justify-content-between small mb-1">
                <span>正在上傳 {{ uploading.current }} / {{ uploading.total }}...</span>
                <span>{{ uploading.percent }}%</span>
              </div>
              <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                  :style="{ width: uploading.percent + '%' }"></div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="datainfocard mt-3">
                  <div class="card-title">總檔案數</div>
                  <div class="card-value">{{ allFiles.length }}</div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="datainfocard mt-3">
                  <div class="card-title">總檔案大小</div>
                  <div class="card-value">{{ totalFileSize }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="mb-3">
            <div class="panel">
              <div class="panel-title">
                <span>檔案列表</span>
                <input type="text" class="searchbar form-control form-control-sm" placeholder="🔍"
                  v-model="searchKeyword">
              </div>
              <div class="panel-body p-0">
                <table class="file-table">
                  <thead>
                    <tr>
                      <th>預覽圖</th>
                      <th>檔案名稱</th>
                      <th>類型</th>
                      <th>檔案大小</th>
                      <th>時間</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredFiles.length === 0">
                      <td colspan="7" class="text-center">沒有符合條件的檔案</td>
                    </tr>
                    <tr v-for="file in filteredFiles" :key="file.id">
                      <td>
                        <img v-if="file.isImage" :src="file.previewUrl" alt="預覽圖" class="img-fluid thumbnail">
                        <div v-else class="file-icon">{{ fileTypeIcons[file.type] || '📄' }}</div>
                      </td>
                      <td>{{ file.name }}</td>
                      <td><span class="filetype">{{ formatFileType(file.type) }}</span></td>
                      <td>{{ ((file.size) / 1024).toFixed(2) }} KB</td>
                      <td>{{ new Date(file.uploadTime).toLocaleString() }}</td>
                      <td>
                        <button class="btn btn-success btn-sm me-2" @click.prevent="downloadFile(file)">下載</button>
                        <button class="btn btn-danger btn-sm" @click.prevent="confirmDelete(file)">刪除</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { openDB } from 'idb' // 引入 idb 庫以使用 IndexedDB 功能
import { useToast } from '../../../composables/useToast.js' // 引入 useToast

const { showToast } = useToast() // 取得 showToast 函式
const fileInput = ref(null) // 用於觸發檔案選擇
const isDragging = ref(false) // 用於追蹤檔案拖曳狀態
const isUploading = ref(false) // 用於追蹤檔案上傳狀態
const searchKeyword = ref('') // 關鍵字搜尋
const allFiles = ref([]) // 含有 preview 的檔案列表
const uploading = ref({ current: 0, total: 0, percent: 0 }) // 上傳進度狀態

const DB_NAME = 'StaffFileSystemDB' // IndexedDB 資料庫名稱
const STORE = 'uploads' // 物件儲存空間名稱

// 取得 DB 資料，若無資料則自動建立新資料庫
const getDB = () => openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: 'id' })
    }
  }
})

// 讀取所有檔案並產生 ObjectURL 供預覽
const loadFiles = async () => {
  const db = await getDB() // 取得進入資料庫的權限
  const records = await db.getAll(STORE) // 讀取 db 所有檔案

  // allFiles.value 執行迴圈，釋放舊的 ObjectURL，避免記憶體洩漏 Memory leak (可用的記憶體流失，導致效能下降甚至崩潰)
  allFiles.value.forEach(f => {
    if (f.previewUrl) { // 檢查檔案室否有 previewUrl
      URL.revokeObjectURL(f.previewUrl) // 符合才會釋放，若沒有則會跳過
    }
  })

  // 將 allFiles.value 做排序，讓最新的檔案顯示在最前面，並將每筆資料轉換成新格式
  allFiles.value = records.sort((a, b) => b.uploadTime - a.uploadTime).map(r => ({
    ...r, // 複製原有檔案的資料
    isImage: r.type.startsWith('image/'), // 新增 isImage，判斷是否為圖片類型
    previewUrl: r.type.startsWith('image/') ? URL.createObjectURL(r.blob) : null, // 新增 preview，若為圖片類，以檔案的二進位資料產生預覽 URL，其他類型則為 null
    downloadUrl: URL.createObjectURL(r.blob) // 以檔案的二進為資料產生 downloadUrl，為所有檔案產生下載的 URL
  }))
}

// 觸發被隱藏的檔案選擇，讓上傳可以確實執行，不會發生無法觸發 processFiles 的問題
const openFileDialog = () => {
  fileInput.value.click()
}

// 點選上傳檔案區域觸發檔案選擇對話框
const onFileSelect = (e) => {
  const files = Array.from(e.target.files) // 點選選擇檔案後，建立新的獨立陣列
  e.target.value = '' // 清空 input 的值，讓同一個檔案可以被重複選擇上傳
  processFiles(files) // 取得選擇的檔案並進行上傳處理
}

// 檔案拖曳上傳
const onDrop = (e) => {
  isDragging.value = false // 在 template 已經先執行 @dragover.prevent="isDragging = true" 和 @dragleave.prevent="isDragging = false"，所以這裡直接將 isDragging 設為 false 即可
  processFiles(Array.from(e.dataTransfer.files)) // 取得拖曳的檔案並進行上傳處理
}

// 處理檔案上傳 (模擬上傳流程，實務上這裡會呼叫後端 API)
// 定義允許上傳的檔案類型，以 MIME 類型為準
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'application/x-zip-compressed',
  'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint'
]
const processFiles = async (files) => {
  if (!files.length) return // 若沒有檔案則直接返回，不進行後續處理

  // 逐一檢查每個檔案的類型，過濾掉不支援的格式
  const validFiles = files.filter(f => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      showToast(`「${f.name}」不支援的檔案類型`, 'danger')
      return false // 不符合條件會被過濾掉，不進行上傳
    }
    return true // 符合條件會保留在 validFiles 陣列，進行後續上傳
  })
  if (!validFiles.length) return // 若篩選後沒有符合條件的檔案，則直接返回，不進行上傳

  isUploading.value = true // 開始執行上傳流程
  uploading.value = { current: 0, total: validFiles.length, percent: 0 } // 初始化上傳狀態

  const db = await getDB() // 取得資料庫權限

  // 使用 for 迴圈處理每個檔案，確保能正確上傳並更新上傳進度，若使用 forEach 或 map 可能會因為非同步處理而導致上傳進度無法正確更新
  for (let i = 0; i < validFiles.length; i++) {
    const f = validFiles[i] // 取得目前處理的檔案
    uploading.value.current = i + 1 // 更新目前上傳數量
    uploading.value.percent = Math.round(((i + 1) / validFiles.length) * 100) // 計算上傳百分比

    await new Promise(r => setTimeout(r, 400)) // 模擬上傳延遲

    await db.put(STORE, { // 將檔案資料存入 IndexedDB
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, // 以時間戳和隨機字串組合成唯一 ID，避免同時上傳多個檔案時發生 ID 衝突
      name: f.name, // 檔案名稱
      type: f.type, // 檔案類型
      size: f.size, // 檔案大小
      uploadTime: Date.now(), // 上傳時間戳記
      blob: f // 檔案的二進位資料，後續可以用來產生預覽圖或下載使用
    })
  }

  isUploading.value = false // 結束上傳流程
  showToast(`已上傳 ${validFiles.length} 個檔案`, 'success') // 顯示上傳成功的 Toast 訊息
  await loadFiles() // 上傳完成後重新讀取檔案列表
}

// 下載檔案
const downloadFile = (file) => {
  const link = document.createElement('a') // 建立一個 a 標籤元素
  link.href = file.downloadUrl // 下載連結為檔案的 downloadUrl，此 URL 是在 loadFiles 時以檔案的二進位資料產生的 ObjectURL
  link.download = file.name // 設定下載的檔案命名為檔案原始名稱
  document.body.appendChild(link) // 將連結加入到 DOM 中，才能觸發 click 事件
  link.click() // 觸發下載
  document.body.removeChild(link) // 下載完成後移除連結
}

// 刪除檔案
const confirmDelete = async (file) => {
  if (!confirm(`確定要刪除「${file.name}」？`)) return // 顯示確認對話框，若使用者取消則直接返回，不進行刪除
  const db = await getDB() // 取得資料庫權限
  await db.delete(STORE, file.id) // 從 IndexedDB 中刪除檔案資料
  showToast(`已刪除檔案 「${file.name}」`, 'success') // 顯示刪除成功的 Toast 訊息
  await loadFiles() // 刪除完成後重新讀取檔案列表
}

// MIME檔案類型重新命名
const formatFileType = (mime) => {
  const typeMap = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/webp': 'WEBP',
    'application/pdf': 'PDF',
    'text/plain': 'TXT',
    'application/x-zip-compressed': 'ZIP',
    'application/msword': 'DOC',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.ms-powerpoint': 'PPT'
  }
  return typeMap[mime] || mime // 若 MIME 類型在 typeMap 中有對應的名稱，則使用對應名稱；否則取 MIME 類型的主類別並轉為大寫作為顯示
}

// 搜尋功能，根據 searchKeyword 過濾檔案列表
const filteredFiles = computed(() => {
  if (!searchKeyword.value) return allFiles.value // 若搜尋關鍵字為空，則直接回傳完整檔案列表，不進行過濾
  return allFiles.value.filter(f => f.name.toLowerCase().includes(searchKeyword.value.toLowerCase())) // 將檔案名稱和搜尋關鍵字都轉為小寫，進行包含關係的比對，回傳符合條件的檔案列表
})

// 計算所有檔案大小
const totalFileSize = computed(() =>
  formatBytes(allFiles.value.reduce((acc, file) => acc + file.size, 0))) // 使用 reduce 將所有檔案的大小加總起來，從第一個檔案開始累加，最後回傳總大小，並使用 formatBytes 函式將大小格式化為可讀的字串

// 將總檔案的數值自動換算成合適的單位，包含一位小數
const formatBytes = (bytes) => {
  if (!bytes) return '0 Bytes' // 若無檔案，回傳 0 Bytes
  const k = 1024 // 單位換算的基數
  const sizes = ['Bytes', 'KB', 'MB'] // 定義單位陣列
  const i = Math.floor(Math.log(bytes) / Math.log(k)) // 以檔案大小數值的 log 值除以基數的 log 值，計算適合的單位索引，並向下取整數
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}` // 將數值除以對應單位的基數，並保留一位小數，最後加上單位字串
}

// 檔案類型圖示
const fileTypeIcons = {
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'image/gif': '🖼️',
  'image/webp': '🖼️',
  'application/pdf': '📄',
  'text/plain': '📄',
  'application/x-zip-compressed': '📦',
  'application/msword': '📄',
  'application/vnd.ms-excel': '📊',
  'application/vnd.ms-powerpoint': '📈'
}

// 元件掛載完成後，載入檔案列表，確保頁面開啟就能看到已上傳的檔案
onMounted(() => {
  loadFiles()
})
</script>

<style lang="scss" scoped>
.panel {
  padding: 10px 15px;
  border: solid 1px var(--panel-border);
  border-radius: 15px;
  background: var(--panel-bg);
  color: var(--text-color);
  transition: background 0.3s ease, color 0.3s ease;

  .datainfocard {
    border: solid 1px var(--datacard-border);
    border-radius: 10px;
    padding: 10px;
    background: var(--datacard-bg);
    color: var(--text-color);
    transition: background 0.3s ease, color 0.3s ease;
    text-align: center;

    .card-title {
      font-size: 0.9em;
      color: var(--datacard-title-color);
      margin-bottom: 5px;
    }

    .card-value {
      font-size: 1.8em;
      font-weight: bold;
    }
  }

  .panel-title {
    font-size: 1.2em;
    font-weight: 700;
    padding: 10px;
    border-bottom: solid 2px var(--panel-title-border);
    position: relative;

    .searchbar {
      max-width: 200px;
      margin-left: auto;
      position: absolute;
      right: 7px;
      top: 10px;
      background: var(--searchbar-bg);
      color: var(--searchbar-text);
      border: solid 1px var(--searchbar-border);
      transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
  }

  .panel-body {
    max-height: 500px;
    overflow-y: auto;

    thead {
      position: sticky;
      top: 0;
      background: var(--table-header-bg);
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .dropzone {
    border: dashed 2px var(--dropzone-border);
    border-radius: 15px;
    padding: 20px;
    cursor: pointer;
    transition: background 0.3s ease, border-color 0.3s ease;

    &:hover {
      background: var(--dropzone-hover-bg);
      border-color: var(--dropzone-hover-border);
    }

    &.drag-active {
      background: var(--dropzone-active-bg);
      border-color: var(--dropzone-active-border);
    }

    .drop-icon {
      font-size: 2em;
      margin-bottom: 10px;
    }

    .drop-text {
      font-size: 0.9em;

      span {
        font-size: 0.8em;
        color: var(--text-muted);
      }
    }
  }

  .file-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 10px;
      border-bottom: solid 1px var(--table-border);
      text-align: left;
      max-width: 300px;
      word-break: break-all;

      .filetype {
        text-transform: uppercase;
        font-weight: 600;
        font-size: 0.8em;
        color: var(--filetype-color);
        border: solid 1px var(--filetype-border);
        border-radius: 3px;
        padding: 2px 4px;
        transition: ease-in-out 0.3s;
      }
    }

    th {
      background: var(--table-header-bg);
      min-width: 70px;
    }

    .thumbnail {
      max-width: 40px;
      max-height: 40px;
      object-fit: cover;
      border-radius: 5px;
    }

    .file-icon {
      font-size: 2em;
    }
  }
}
</style>