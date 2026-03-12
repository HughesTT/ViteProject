<template>
  <div class="file-manager">
    <h2 class="content-title mb-4">📁 員工文件管理系統</h2>

    <!-- 頂部統計欄 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value text-primary">{{ allFiles.length }}</div>
          <div class="stat-label">總檔案數</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value text-success">{{ imageCount }}</div>
          <div class="stat-label">圖片檔</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value text-warning">{{ docCount }}</div>
          <div class="stat-label">文件檔</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value text-danger">{{ totalSizeDisplay }}</div>
          <div class="stat-label">總儲存用量</div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- 左側：上傳區 -->
      <div class="col-md-4 mb-4">
        <div class="panel">
          <div class="panel-title">📤 上傳檔案</div>
          <div class="panel-body">
            <!-- 拖放區域：input 移到外部避免 click 冒泡循環 -->
            <input type="file" ref="fileInput" class="d-none" multiple @change="onFileSelect" />
            <div class="dropzone" :class="{ 'drag-active': isDragging }" @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false" @drop.prevent="onDrop" @click="openFileDialog">
              <div class="text-center py-3">
                <div class="drop-icon">{{ isDragging ? '📂' : '📁' }}</div>
                <div class="drop-text">點擊或拖放檔案</div>
                <div class="drop-hint">支援多檔同時上傳</div>
              </div>
            </div>

            <!-- 分類選擇 -->
            <div class="mt-3">
              <label class="form-label small">檔案分類</label>
              <select class="form-select form-select-sm bg-dark text-white border-secondary" v-model="uploadCategory">
                <option value="合約文件">合約文件</option>
                <option value="員工照片">員工照片</option>
                <option value="財務報表">財務報表</option>
                <option value="簡報資料">簡報資料</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <!-- 上傳進度 -->
            <div v-if="isUploading" class="mt-3">
              <div class="d-flex justify-content-between small mb-1">
                <span>正在上傳 {{ uploading.current }}/{{ uploading.total }}...</span>
                <span>{{ uploading.percent }}%</span>
              </div>
              <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                  :style="{ width: uploading.percent + '%' }"></div>
              </div>
            </div>

            <!-- 分類快捷篩選 -->
            <div class="mt-4">
              <div class="panel-title mb-2">🗂️ 分類瀏覽</div>
              <div v-for="cat in categories" :key="cat.name" class="category-item"
                :class="{ active: activeCategory === cat.name }" @click="activeCategory = cat.name">
                <span>{{ cat.icon }} {{ cat.name }}</span>
                <span class="badge bg-secondary">{{ cat.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側：檔案列表 -->
      <div class="col-md-8 mb-4">
        <div class="panel">
          <div class="panel-title d-flex justify-content-between align-items-center">
            <span>📋 檔案列表
              <span v-if="activeCategory !== '全部'" class="badge bg-info ms-2 small">{{ activeCategory }}</span>
            </span>
            <!-- 搜尋框 -->
            <input type="text" class="form-control form-control-sm bg-dark text-white border-secondary"
              style="width: 200px;" placeholder="🔍 搜尋檔案..." v-model="searchKeyword" />
          </div>
          <div class="panel-body p-0">
            <div class="file-table-wrapper">
              <table class="file-table">
                <thead>
                  <tr>
                    <th width="50">預覽</th>
                    <th>檔案名稱</th>
                    <th>分類</th>
                    <th>大小</th>
                    <th>時間</th>
                    <th width="100">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredFiles.length === 0">
                    <td colspan="6" class="empty-row">
                      {{ searchKeyword ? '找不到符合的檔案' : '尚未上傳任何檔案' }}
                    </td>
                  </tr>
                  <tr v-for="file in filteredFiles" :key="file.id" class="file-row">
                    <td>
                      <img v-if="file.isImage && file.previewUrl" :src="file.previewUrl" class="file-thumb"
                        alt="preview" />
                      <span v-else class="file-icon-text">{{ getFileIcon(file.type) }}</span>
                    </td>
                    <td>
                      <div class="file-name" :title="file.name">{{ file.name }}</div>
                      <div class="file-type-badge">{{ file.type || '未知' }}</div>
                    </td>
                    <td>
                      <span class="category-badge">{{ file.category }}</span>
                    </td>
                    <td class="text-nowrap">{{ formatBytes(file.size) }}</td>
                    <td class="text-nowrap small">{{ formatDate(file.uploadTime) }}</td>
                    <td>
                      <button class="btn-action btn-download" @click="downloadFile(file)" title="下載">⬇️</button>
                      <button class="btn-action btn-delete" @click="confirmDelete(file)" title="刪除">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { openDB } from 'idb'
import { useToast } from '../../../composables/useToast.js'

const { showToast } = useToast()

// ── 狀態 ──────────────────────────────────────────────
const fileInput = ref(null) // 檔案選擇器的 ref
const isDragging = ref(false) // 拖放狀態
const isUploading = ref(false) // 上傳中狀態
const uploadCategory = ref('其他') // 上傳檔案的分類
const searchKeyword = ref('') // 搜尋關鍵字
const activeCategory = ref('全部') // 目前選取的分類
const allFiles = ref([])   // 含有 previewUrl 的顯示用資料
const uploading = ref({ current: 0, total: 0, percent: 0 }) // 上傳進度資訊

// ── IndexedDB ─────────────────────────────────────────
// 實務上此段等同呼叫後端 API (e.g. AWS S3 presigned URL)
// 這裡以 IndexedDB 儲存真實 File Blob，達到同等效果
const DB_NAME = 'StaffFileSystem' // 資料庫名稱
const STORE = 'uploads' // 物件存儲名稱

// 取得 DB 資料，若無資料則自動建立
const getDB = () => openDB(DB_NAME, 1, {
  upgrade(db) { // 
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: 'id' })
    }
  }
})

// 讀取所有檔案並產生 ObjectURL 供預覽
const loadFiles = async () => {
  const db = await getDB() // 取得資料庫
  const records = await db.getAll(STORE) // 讀取所有檔案紀錄

  // 釋放舊的 ObjectURL，避免記憶體堆積
  allFiles.value.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl))

  allFiles.value = records
    .sort((a, b) => b.uploadTime - a.uploadTime)
    .map(r => ({
      ...r,
      isImage: r.type.startsWith('image/'),
      // URL.createObjectURL：從 Blob 建立暫時 URL，不需要 Base64 轉換，效能更好
      previewUrl: r.type.startsWith('image/') ? URL.createObjectURL(r.blob) : null,
      // 下載用也用同一個 Blob URL
      downloadUrl: URL.createObjectURL(r.blob)
    }))
}

// ── 上傳流程 ──────────────────────────────────────────
// 明確使用 .value 呼叫 DOM 方法，比 template inline 更可靠
const openFileDialog = () => {
  fileInput.value.click() // 觸發隱藏的檔案選擇器，讓使用者選擇檔案，選擇後會觸發 onFileSelect 進行後續處理
}

// 檔案拖曳上傳
const onDrop = (e) => {
  isDragging.value = false // 拖曳狀態結束
  processFiles(e.dataTransfer.files)
}
// 點擊 input 區域，觸發檔案選擇對話框
const onFileSelect = (e) => {
  const files = Array.from(e.target.files) // Array.from 建立獨立陣列，與 FileList 脫鉤
  e.target.value = ''                      // 清空 input，FileList 被清空但不影響 files
  processFiles(files)
}

// 處理檔案上傳 (模擬上傳流程，實務上這裡會呼叫後端 API)
const processFiles = async (files) => {
  if (!files.length) return // 若無檔案則返回
  isUploading.value = true // 開始上傳
  uploading.value = { current: 0, total: files.length, percent: 0 } // 初始化上傳進度

  const db = await getDB() // 取得資料庫權限

  // 依序上傳檔案，模擬網路延遲，並更新進度狀態
  for (let i = 0; i < files.length; i++) { // 使用 for 迴圈以確保上傳順序，並能在每次迭代後更新進度
    const f = files[i] // 取得目前檔案
    uploading.value.current = i + 1 // 更新目前上傳數量
    uploading.value.percent = Math.round(((i + 1) / files.length) * 100) // 計算上傳的百分比

    // 模擬網路延遲（實務上這裡是 await axios.post('/api/upload', formData)）
    await new Promise(r => setTimeout(r, 400)) // 模擬上傳延遲
    // 將檔案資料存到 IndexedDB，實務上這裡會是呼叫後端 API 並傳送檔案，後端負責儲存並回傳檔案資訊
    await db.put(STORE, { // 使用 put 方法新增或更新資料，若 id 已存在則覆蓋，否則新增
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, // 生成唯一 ID，實務上應由後端生成並回傳
      name: f.name, // 檔案名稱
      type: f.type, // MIME 類型
      size: f.size, // 檔案大小
      category: uploadCategory.value, // 檔案分類
      uploadTime: Date.now(), // 上傳時間戳
      blob: f  // IndexedDB 可以直接儲存 File/Blob，不需要轉 Base64
    })
  }

  isUploading.value = false // 結束上傳
  showToast(`已上傳 ${files.length} 個檔案`, 'success') // 顯示上傳成功訊息
  await loadFiles() // 重新載入檔案列表以顯示新上傳的檔案
}

// ── 下載 ──────────────────────────────────────────────
const downloadFile = (file) => {
  // 實務：呼叫後端取得下載 URL，或直接拿 presigned URL
  const a = document.createElement('a')
  a.href = file.downloadUrl
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ── 刪除 ──────────────────────────────────────────────
const confirmDelete = async (file) => {
  if (!confirm(`確定要刪除「${file.name}」？`)) return
  const db = await getDB()
  await db.delete(STORE, file.id)
  showToast('已刪除檔案', 'success')
  await loadFiles()
}

// ── 計算屬性 ──────────────────────────────────────────
const imageCount = computed(() => allFiles.value.filter(f => f.isImage).length)
const docCount = computed(() => allFiles.value.filter(f => !f.isImage).length)
const totalSizeDisplay = computed(() => formatBytes(allFiles.value.reduce((sum, f) => sum + f.size, 0)))

const categories = computed(() => {
  const map = {}
  allFiles.value.forEach(f => {
    map[f.category] = (map[f.category] || 0) + 1
  })
  const list = [{ name: '全部', icon: '📂', count: allFiles.value.length }]
  Object.entries(map).forEach(([name, count]) => {
    const iconMap = { '合約文件': '📝', '員工照片': '🖼️', '財務報表': '📊', '簡報資料': '📋', '其他': '📄' }
    list.push({ name, icon: iconMap[name] || '📄', count })
  })
  return list
})

const filteredFiles = computed(() => {
  let result = allFiles.value
  if (activeCategory.value !== '全部') {
    result = result.filter(f => f.category === activeCategory.value)
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(f => f.name.toLowerCase().includes(kw) || f.category.toLowerCase().includes(kw))
  }
  return result
})

// ── 工具函式 ──────────────────────────────────────────
const getFileIcon = (mime) => {
  if (!mime) return '📄'
  if (mime.includes('pdf')) return '📕'
  if (mime.includes('word') || mime.includes('document')) return '📘'
  if (mime.includes('excel') || mime.includes('sheet')) return '📗'
  if (mime.includes('powerpoint') || mime.includes('presentation')) return '📙'
  if (mime.includes('zip') || mime.includes('rar')) return '🗜️'
  if (mime.includes('video')) return '🎬'
  if (mime.includes('audio')) return '🎵'
  return '📄'
}

const formatBytes = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const formatDate = (ts) => new Date(ts).toLocaleString('zh-TW', {
  month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
})

// ── 生命週期 ──────────────────────────────────────────
onMounted(loadFiles)
onUnmounted(() => {
  allFiles.value.forEach(f => {
    f.previewUrl && URL.revokeObjectURL(f.previewUrl)
    f.downloadUrl && URL.revokeObjectURL(f.downloadUrl)
  })
})
</script>

<style lang="scss" scoped>
.file-manager {
  color: #e9ecef;
}

.content-title {
  font-weight: bold;
}

// 統計卡片
.stat-card {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 4px;
}

// 面板
.panel {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
}

.panel-title {
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.panel-body {
  padding: 1rem;
}

// 拖放區
.dropzone {
  border: 2px dashed rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }

  &.drag-active {
    border-color: #0dcaf0;
    background: rgba(13, 202, 240, 0.15);
    transform: scale(1.01);
  }
}

.drop-icon {
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
}

.drop-text {
  font-size: 0.95rem;
  font-weight: 600;
}

.drop-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}

// 分類列表
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.9rem;
  margin-bottom: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(59, 130, 246, 0.3);
    color: #93c5fd;
    font-weight: 600;
  }
}

// 分類標籤
.category-badge {
  background: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
}

// 檔案表格
.file-table-wrapper {
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.file-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.6rem 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    text-align: left;
  }

  thead {
    position: sticky;
    top: 0;
    background: #1e2533;
    z-index: 1;
  }

  th {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
  }

  .file-row {
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

.file-thumb {
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 6px;
}

.file-icon-text {
  font-size: 1.8rem;
  display: block;
  text-align: center;
}

.file-name {
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
}

.file-type-badge {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 2px;
}

.empty-row {
  text-align: center;
  padding: 3rem !important;
  color: #6b7280;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 2px 4px;
  border-radius: 4px;
  transition: transform 0.15s, background 0.15s;

  &:hover {
    transform: scale(1.2);
  }

  &.btn-download:hover {
    background: rgba(6, 182, 212, 0.2);
  }

  &.btn-delete:hover {
    background: rgba(239, 68, 68, 0.2);
  }
}
</style>
