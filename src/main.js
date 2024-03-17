import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import * as Icons from '@element-plus/icons'
import './assets/font.css'
import './assets/icons/iconfont/iconfont.css'

const app = createApp(App)

// 注册Icons 全局组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

app.use(ElementPlus)
app.use(router)

app.mount('#app')
