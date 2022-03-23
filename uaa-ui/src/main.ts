import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { components } from '@/plugin'
import App from '@/App.vue'
import router from '@/router'
import store from '@/stores'
import './permission'

const app = createApp(App)

// 按需导入Element Plus组件和插件
components.forEach(component => {
  if (component.name) {
    app.component(component.name, component)
  }
})

app.use(router).use(ElementPlus).use(store).mount('#app')
