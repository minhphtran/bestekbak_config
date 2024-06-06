import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { create_i18n } from './i18n'

const i18n = create_i18n()

createApp(App).use(store).use(i18n).mount('#app')
