# Vue 3 學習專案 - AI Copilot 指導文件

這是一個專注於透過實務範例和互動式演示來展示 Vue 基礎概念的 Vue 3 + Vite 學習專案。

## 架構概覽

### 專案結構
- **學習導向架構**：依概念組織結構（`/views/DevVue/`、`/views/Question/`）
- **巢狀路由**：深度路由結構（`/devconcept/vue/todolist`）與路由器中的子路由
- **元件模式**：混合展示元件（`/components/`）和專門學習元件（`/views/DevVue/components/`）

### 核心技術堆疊
- Vue 3 搭配 `<script setup>` Composition API
- Vue Router 4 使用 hash 歷史模式（`createWebHashHistory`）
- Bootstrap 5 + Bootstrap Icons 建構使用者介面
- SCSS 樣式撰寫
- Axios 處理 HTTP 請求

## 開發模式

### 元件溝通（核心重點）
本專案重點強調 **Props & Emit** 模式：

```javascript
// 父元件 → 子元件（Props）
<ChildComponent :name="user.name" :products="products" />

// 子元件 → 父元件（Emit）
const emit = defineEmits(['add-to-cart', 'increment'])
emit('add-to-cart', product)
```

### 檔案命名規範
- 視圖頁面：PascalCase（如 `DevVueIndex.vue`、`PropsEmit.vue`）
- 元件：PascalCase（如 `ChildComponent.vue`、`ResponsibilityDemo.vue`）
- 備份檔案：使用 `_BK` 後綴（如 `ChildComponent_BK.vue`）

### 學習範例結構
大多數學習範例遵循以下模式：
1. **索引頁面**（`DevVueIndex.vue`） - 導覽卡片
2. **展示頁面** - 包含詳細實作的實際範例
3. **練習頁面** - 延伸練習（`PropsEmitPractice.vue`）
4. **支援元件** - 可重複使用的展示元件於 `/components/`

### 路由架構
大量使用巢狀路由進行學習組織：
```javascript
// 三層巢狀：/devconcept/vue/todolist
children: [
  {
    path: 'vue',
    component: () => import('../views/DevVue.vue'),
    children: [
      { path: 'todolist', component: () => import('../views/DevVue/TodoList.vue') }
    ]
  }
]
```

## 開發工作流程

### 執行專案
```bash
npm run dev    # 啟動開發伺服器
npm run build  # 建置生產版本
```

### 元件開發
1. **Props 定義**：務必使用明確的 prop 型別和必要屬性
2. **Emit 定義**：使用 `defineEmits()` 並使用清楚的事件名稱
3. **響應式資料**：簡單數值優先使用 `ref()`，物件使用 `reactive()`
4. **Bootstrap 整合**：使用 Bootstrap 類別，在 `main.js` 中引入 JS 套件

### 問答系統
專案包含 JSON 格式的問答檔案（`/views/Question/css.json`、`js.json`）結構：
```json
{
  "title": "CSS",
  "question": [
    {
      "question": "...",
      "answer": "...", 
      "tips": ""
    }
  ]
}
```

## 重要學習範例

### TodoMVC 實作（`TodoList.vue`）
- 自訂指令使用（`v-todo-focus`）
- 本機儲存持久化
- 計算屬性篩選（`filteredTodos`）
- 監聽器用於資料持久化

### Props/Emit 展示（`PropsEmit.vue` + `ChildComponent.vue`）
- 多卡片展示
- 購物車功能
- 計數器與觸發事件
- 使用者個人資料顯示

### 責任分工展示（`ResponsibilityDemo.vue`）
- 即時觸發事件日誌
- 透過 props 進行主題客製化
- 多種觸發事件類型展示

## 重要提醒

- 所有主要的 Bootstrap CSS/JS 在 `main.js` 中全域引入
- 使用 hash 路由模式（非歷史模式）
- 學習專案結構 - 優先考慮清晰度而非可擴展性
- 重點強調展示 Vue 基礎概念而非生產環境模式