# Vue 3 Props & Emit 完整學習指南

## 🎯 學習目標
通過實際範例和練習，掌握 Vue 3 中 Props 和 Emit 的各種用法和最佳實踐。

## 📚 知識點概覽

### 1. Props 基礎知識
```javascript
// 基本語法
const props = defineProps({
  // 基本類型
  name: String,
  age: Number,
  isActive: Boolean,
  
  // 帶預設值
  title: {
    type: String,
    default: '預設標題'
  },
  
  // 必填屬性
  id: {
    type: Number,
    required: true
  },
  
  // 自定義驗證
  email: {
    type: String,
    validator: (value) => /\S+@\S+\.\S+/.test(value)
  }
})
```

### 2. Emit 基礎知識
```javascript
// 基本語法
const emit = defineEmits(['update', 'delete', 'submit'])

// 帶驗證的 emit
const emit = defineEmits({
  update: (value) => typeof value === 'string',
  delete: (id) => typeof id === 'number',
  submit: (data) => data && typeof data === 'object'
})

// 發送事件
emit('update', newValue)
emit('delete', itemId)
emit('submit', formData)
```

### 3. v-model 實現原理
```javascript
// 父組件
<CustomInput v-model="text" />
// 等同於
<CustomInput :modelValue="text" @update:modelValue="text = $event" />

// 子組件
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
```

## 🏃‍♂️ 練習步驟

### 第一步：熟悉基本 Props
1. 查看 `UserCard.vue` 組件
2. 理解不同類型的 props 定義
3. 嘗試修改 `PropsEmitPractice.vue` 中的用戶資料

### 第二步：掌握 Emit 事件
1. 查看 `Counter.vue` 組件
2. 理解事件的發送和接收
3. 嘗試添加新的計數器操作

### 第三步：複雜資料傳遞
1. 查看 `ProductList.vue` 組件
2. 理解物件陣列的傳遞
3. 實現購物車功能

### 第四步：自定義 v-model
1. 查看 `CustomInput.vue` 組件
2. 理解 v-model 的實現原理
3. 嘗試添加更多輸入驗證

### 第五步：多重 v-model
1. 查看 `FormComponent.vue` 組件
2. 理解多個 v-model 的使用
3. 添加更多表單欄位

## 💡 最佳實踐

### Props 最佳實踐
1. **總是定義 prop 類型**
```javascript
// ✅ 好的做法
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

// ❌ 避免的做法
const props = defineProps(['name'])
```

2. **為非必填 props 提供預設值**
```javascript
const props = defineProps({
  size: {
    type: String,
    default: 'medium'
  }
})
```

3. **使用驗證器確保資料品質**
```javascript
const props = defineProps({
  email: {
    type: String,
    validator: (value) => /\S+@\S+\.\S+/.test(value)
  }
})
```

### Emit 最佳實踐
1. **總是宣告 emit 事件**
```javascript
// ✅ 好的做法
const emit = defineEmits(['update', 'delete'])

// ❌ 避免的做法
// 直接使用 $emit 而不宣告
```

2. **使用事件驗證**
```javascript
const emit = defineEmits({
  update: (value) => typeof value === 'string',
  delete: (id) => typeof id === 'number'
})
```

3. **使用語義化的事件名稱**
```javascript
// ✅ 好的做法
emit('user-updated', userData)
emit('form-submitted', formData)

// ❌ 避免的做法
emit('click', data)
emit('change', value)
```

## 🔧 進階技巧

### 1. 動態 Props
```javascript
// 父組件
const userProps = reactive({
  name: '張三',
  age: 25,
  email: 'zhangsan@email.com'
})

// 模板中
<UserCard v-bind="userProps" />
```

### 2. Props 解構
```javascript
// 注意：直接解構會失去響應性
const { name, age } = props // ❌

// 使用 toRefs 保持響應性
import { toRefs } from 'vue'
const { name, age } = toRefs(props) // ✅
```

### 3. 條件性 Props
```javascript
const dynamicProps = computed(() => {
  const baseProps = { name: user.name }
  if (showAge) {
    baseProps.age = user.age
  }
  return baseProps
})
```

## 🎯 練習任務

### 任務 1：創建評分組件
創建一個星級評分組件，包含：
- Props：`rating` (數字), `maxRating` (預設5), `readonly` (布林值)
- Emit：`update:rating` 事件

### 任務 2：創建標籤輸入組件
創建一個標籤輸入組件，包含：
- Props：`tags` (陣列), `placeholder` (字串)
- Emit：`update:tags`, `tag-added`, `tag-removed` 事件

### 任務 3：創建模態框組件
創建一個模態框組件，包含：
- Props：`show` (布林值), `title` (字串), `closable` (布林值)
- Emit：`close`, `confirm` 事件
- Slot：內容插槽

## 🚀 下一步學習
1. 學習 Vue 3 的 Slot 系統
2. 掌握 Provide/Inject 模式
3. 了解 Teleport 組件
4. 學習組件庫設計模式