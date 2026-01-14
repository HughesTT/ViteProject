import { defineStore } from 'pinia'

export default defineStore('statusStore', {
  state: () => ({
    isLoading: false,
    cartLoadingItem: '', // 加入購物車的按鈕鎖定動態判定變數
  })
})