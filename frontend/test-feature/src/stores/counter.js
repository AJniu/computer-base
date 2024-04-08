// pinia 组合式API 的状态管理库，它可以跨组件或页面状态共享。
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// store是一个保存状态（数据）和业务逻辑（可以简单理解为方法）的实体，它并不与组件树绑定。
// 它承载着全局状态。它就像一个永远存在的组件，每个组件都可以读取和写入它。
// 它有三个概念，state(相当于data)，getter（相当于computed）和action（相当于methods）

// defineStore()定义一个store仓库，它接收两个参数
// 第一个参数：要求是一个独一无二的名字（id）,用于和devtools连接
// 第二个参数可以接收两类值：Setup函数或options对象

// 返回一个函数，一般以use...开头
// 以Setup函数作为第二个参数，调用返回的函数，得到的将是Setup的返回值
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  // getter
  const doubleCount = computed(() => count.value * 2)
  // action
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
