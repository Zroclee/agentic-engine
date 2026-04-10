import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

// 设置默认主题为 AI 炫酷风 (浅色)
document.documentElement.setAttribute('data-theme', 'ai-theme')

// 跟随系统判断亮暗色模式 (Tailwind dark 变体支持 & DaisyUI 深色主题)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (prefersDark) {
  document.documentElement.classList.add('dark')
  document.documentElement.setAttribute('data-theme', 'ai-theme-dark')
} else {
  document.documentElement.classList.remove('dark')
  document.documentElement.setAttribute('data-theme', 'ai-theme')
}

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (e.matches) {
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'ai-theme-dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'ai-theme')
  }
})

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
