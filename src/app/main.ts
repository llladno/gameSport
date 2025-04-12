import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.scss'
import router from "./router";

createApp(App).use(router).mount('#app')
