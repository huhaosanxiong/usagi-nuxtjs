import dayjs from 'dayjs'

export default defineNuxtPlugin(() => {
  // 不加载 advancedFormat 插件，避免导入问题
  return {
    provide: {
      dayjs
    }
  }
})