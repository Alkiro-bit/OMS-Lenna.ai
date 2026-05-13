import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/main/LoginPage.vue'
import Dashboard from '../components/main/employee/Dashboard.vue'
import Form from '../components/main/employee/Form.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/form', name: 'Form', component: Form },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
