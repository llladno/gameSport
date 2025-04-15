import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.scss';
import './assets/tailwind.css';
import router from './router';
import { createPinia } from 'pinia';
import i18n from '../shared/i18n';
import { initTheme } from './theme';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

initTheme();

const app = createApp(App);

const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
};

// Инициализируем i18n первым
app.use(i18n);

// Затем инициализируем store и остальные плагины
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

app.mount('#app');
