import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vxe Table
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

// i118n
import { createI18n } from 'vue-i18n';
import messages from '@/language/index'
const i18n = createI18n({
  legacy: false,  // 设置为 false，启用 composition API 模式
  messages,
  locale: 'en'  // 设置默认语言
})

// Vuetify
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(i18n)
  .use(VxeUITable)
  .mount('#app')
