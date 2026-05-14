import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/main/LoginPage.vue'
import Dashboard from '../components/main/shared/Dashboard.vue'
import Form from '../components/main/shared/OvertimeForm.vue'
import ReviewApprovals from '../components/main/pm/ReviewApprovals.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/form', name: 'Form', component: Form },
  { path: '/review-approvals', name: 'Review Approvals', component: ReviewApprovals },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
