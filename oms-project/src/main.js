import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import "sweetalert2/dist/sweetalert2.min.css";
import "./assets/sweetalert.css";

const pinia = createPinia()
createApp(App).use(router).use(pinia).mount('#app')
