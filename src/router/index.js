import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../components/main/LoginPage.vue";
import Dashboard from "../components/main/shared/Dashboard.vue";
import Form from "../components/main/shared/OvertimeForm.vue";
import ReviewApprovals from "../components/main/pm/ReviewApprovals.vue";
import DashboardHr from "../components/main/hr/DashboardHr.vue";
import Profile from "../views/Profile.vue";
import Submission from "../components/main/hr/Submission.vue";
import OvertimeForm from "../components/main/shared/OvertimeForm.vue";
import Histories from "../components/main/shared/Histories.vue";
import HistoriesHr from "../components/main/hr/HistoriesHr.vue";
import UserManagement from "../components/main/hr/UserManagement.vue";

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/form", name: "Form", component: Form },
  { path: "/review-approvals", name: "Review Approvals", component: ReviewApprovals, },
  { path: "/dashboard-hr", name: "HR Dashboard", component: DashboardHr },
  { path: "/profile", name: "Profile", component: Profile },
  { path: "/Submission", name: "Submission", component: Submission },
  { path: "/form/:id", name: "EditForm", component: OvertimeForm, },
  { path: "/histories", name: "Histories", component: Histories},
  { path: "/histories-hr", name: "Histories-hr", component: HistoriesHr},
  { path: "/user-management", name: "User Management", component: UserManagement},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
