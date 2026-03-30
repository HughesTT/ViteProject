<template>
  <form>
    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="col-md-12 mb-3">
          <label class="form-label">標題</label>
          <input type="text" class="form-control" placeholder="標題" :value="modelValue.title"
            @input="update('title', $event.target.value)" />
        </div>
        <div class="col-md-12 mb-3">
          <label class="form-label">價格</label>
          <input type="text" class="form-control" placeholder="價格" :value="formatPrice(modelValue.price)"
            @input="handlePriceInput" />
        </div>
        <div class="col-md-12 mb-3">
          <label class="form-label">說明</label>
          <textarea rows="8" class="form-control" placeholder="說明文字" :value="modelValue.description"
            @input="update('description', $event.target.value)"></textarea>
        </div>
      </div>
      <div class="col-md-5 mb-3">
        <label class="form-label">圖片連結</label>
        <input type="text" class="form-control mb-2" placeholder="圖片連結" :value="modelValue.url"
          @input="update('url', $event.target.value)" />
        <label class="form-label">預覽圖</label><br />
        <img :src="modelValue.url" alt="Item Image" class="img-fluid" v-if="modelValue.url" />
        <img src="https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2079504220.jpg"
          class="img-fluid" v-else />
      </div>
      <div class="col-md-12 mb-3">
        <button type="submit" class="btn btn-primary me-2" @click.prevent="emit('submit')">
          {{ isEditing ? '更新' : '增加' }}
        </button>
        <button type="reset" class="btn btn-secondary me-2" @click.prevent="emit('clear')">清除</button>
        <button type="button" class="btn btn-danger" @click.prevent="emit('cancel')">取消</button>
      </div>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true },
  isEditing: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'clear'])

const update = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

// 格式化價格顯示（千分位）
const formatPrice = (price) => {
  if (!price) return ''
  return parseInt(price).toLocaleString('zh-TW')
}

// 處理價格輸入
const handlePriceInput = (event) => {
  const value = event.target.value.replace(/[^\d]/g, '')
  event.target.value = value ? parseInt(value).toLocaleString('zh-TW') : ''
  emit('update:modelValue', {
    ...props.modelValue,
    price: value ? parseInt(value) : null
  })
}
</script>

<style></style>