import { createRouter, createWebHistory } from 'vue-router'
import LoginPage  from '../components/main/LoginPage.vue'
import Dashboard  from '../components/main/employee/Dashboard.vue'

const routes = [
  { path: '/',          name: 'Login',     component: LoginPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
