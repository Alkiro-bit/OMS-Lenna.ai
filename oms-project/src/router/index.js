import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/main/LoginPage.vue'
import Dashboard from '../components/main/shared/Dashboard.vue'
import Form from '../components/main/shared/OvertimeForm.vue'
import ReviewApprovals from '../components/main/pm/ReviewApprovals.vue'
import DashboardHr from '../components/main/hr/DashboardHr.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/form', name: 'Form', component: Form },
  { path: '/review-approvals', name: 'Review Approvals', component: ReviewApprovals },
  { path: '/dashboard-hr', name: 'HR Dashboard', component: DashboardHr },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
