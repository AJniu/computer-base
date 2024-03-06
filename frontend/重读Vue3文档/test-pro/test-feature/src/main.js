import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
// 应用实例（整个Vue应用）
// console.log(`应用实例 ->`,app)

// 应用实例对象上的方法大多数时候返回的是实例本身，所以可以链式调用
app.use(createPinia())
app.use(router)

// mount
const rootCompInstance = app.mount('#app')
console.log(`根组件实例 ->`, rootCompInstance);