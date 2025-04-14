import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.scss'
import './assets/tailwind.css'
import router from "./router";
import { createPinia } from "pinia";
import i18n from '../shared/i18n'
import { initTheme } from './theme'

initTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
