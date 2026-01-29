import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import Loading from 'vue-loading-overlay';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'vue-loading-overlay/dist/css/index.css'

const pinia = createPinia()

createApp(App).use(router).use(pinia).use().component('Loading', Loading).mount('#app')