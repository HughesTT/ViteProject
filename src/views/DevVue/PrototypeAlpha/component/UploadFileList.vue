<template>
  <div class="col-md-9">
    <div class="mb-3">
      <div class="panel">
        <div class="panel-title">
          <span>檔案列表</span>
          <input type="text" class="searchbar form-control form-control-sm" placeholder="🔍 搜尋" v-model="searchKeyword">
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
                <td colspan="7" class="text-center">沒有檔案</td>
              </tr>
              <tr v-for="file in filteredFiles" :key="file.id">
                <td>
                  <img v-if="file.isImage" :src="file.previewUrl" alt="預覽圖" class="img-fluid thumbnail">
                  <div v-else class="file-icon">{{ fileTypeIcons[file.type] || '📄' }}</div>
                </td>
                <td>{{ file.name }}</td>
                <td><span class="filetype">{{ formatFileType(file.type) }}</span></td>
                <td>{{ ((file.size) / 1024).toFixed(0) }} KB</td>
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
</template>

<script setup>
import { ref, computed } from 'vue'
const searchKeyword = ref('') // 關鍵字搜尋

const props = defineProps({
  allFiles: { type: Array, required: true }, // 從父元件傳入的完整檔案列表
})

const emit = defineEmits(['deleteFile']) // 定義刪除檔案事件

// 下載檔案
const downloadFile = (file) => {
  const link = document.createElement('a') // 建立一個 a 標籤元素
  link.href = file.downloadUrl // 下載連結為檔案的 downloadUrl，此 URL 是在 loadFiles 時以檔案的二進位資料產生的 ObjectURL
  link.download = file.name // 設定下載的檔案命名為檔案原始名稱
  document.body.appendChild(link) // 將連結加入到 DOM 中，才能觸發 click 事件
  link.click() // 觸發下載
  document.body.removeChild(link) // 下載完成後移除連結
}

// 刪除檔案（交由父層 ContentE.vue 處理，這裡只負責確認動作並 emit）
const confirmDelete = (file) => {
  if (!confirm(`確定要刪除「${file.name}」？`)) return
  emit('deleteFile', file) // 將要刪除的檔案傳回父層處理
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
  if (!searchKeyword.value) return props.allFiles
  return props.allFiles.filter(f => f.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
})

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
</script>

<style lang="scss">
.panel {
  padding: 10px 15px;
  border: solid 1px var(--panel-border);
  border-radius: 15px;
  background: var(--panel-bg);
  color: var(--text-color);
  transition: background 0.3s ease, color 0.3s ease;

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
}
</style>