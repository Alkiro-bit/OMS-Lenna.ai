<template>
  <div class="dashboard-layout">

    <!-- SIDEBAR -->
    <aside
      class="sidebar"
      :class="{ 'is-expanded': sidebarExpanded }"
      @mouseenter="handleSidebarMouseEnter"
      @mouseleave="handleSidebarMouseLeave"
    >

      <div class="sidebar-brand">
        <div class="brand-logo">
          <img src="/icons/LOGO Lenna.ai.png" alt="Lenna.ai" class="brand-logo-img" />
        </div>
        <Transition name="fade-slide">
          <div v-if="sidebarExpanded" class="brand-text">
            <p class="brand-name">Lenna.ai</p>
            <p class="brand-sub">Overtime Management System</p>
          </div>
        </Transition>
      </div>

      <nav class="sidebar-nav">
        <p v-if="sidebarExpanded" class="nav-section-label">HOME</p>
        <RouterLink v-for="item in navItems" :key="item.name" :to="item.path"
          class="nav-item" :class="{ active: currentRoute === item.path }">
          <img :src="item.icon" class="nav-icon-img" :alt="item.label" />
          <Transition name="fade-slide">
            <span v-if="sidebarExpanded" class="nav-text">{{ item.label }}</span>
          </Transition>
        </RouterLink>
      </nav>

      <div class="sidebar-account">
        <div class="avatar avatar-sm">{{ getInitials(account.name) }}</div>
        <Transition name="fade-slide">
          <div v-if="sidebarExpanded" class="account-info">
            <p class="account-name">{{ account.name }}</p>
            <p class="account-pos">{{ account.position }}</p>
          </div>
        </Transition>
        <Transition name="fade-slide">
          <span v-if="sidebarExpanded" class="account-more">&#8943;</span>
        </Transition>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="main-content">

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="topbar-left">
          <div class="avatar avatar-md">{{ getInitials(account.name) }}</div>
          <span class="greeting">Hello, <strong>{{ account.name }}</strong></span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          Logout
        </button>
      </header>

      <!-- STATS HERO SECTION  full width, terpisah dari konten bawah -->
      <section class="stats-section">
        <div class="stats-grid">
          <div v-for="card in statsCards" :key="card.key" class="stat-card">
            <p class="stat-number">{{ card.value }}</p>
            <p class="stat-label">{{ card.label }}</p>
            <p class="stat-period">{{ currentPeriod }}</p>
          </div>
        </div>
      </section>

      <!-- CONTENT BODY  My Overtime + Table -->
      <div class="content-body">
        <div class="overtime-bar">My Overtime</div>

        <div class="overtime-table-card">
          <div class="overtime-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in overtimeList" :key="i">
                  <td>{{ row.task }}</td>
                  <td>{{ formatDate(row.date) }}</td>
                  <td>{{ row.hours }} Hour</td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(row.status)">
                      <span class="status-dot"></span>
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const sidebarExpanded = ref(false)
let sidebarHoverTimer = null

function handleSidebarMouseEnter() {
  if (sidebarHoverTimer) {
    clearTimeout(sidebarHoverTimer)
  }
  sidebarExpanded.value = true
}

function handleSidebarMouseLeave() {
  sidebarHoverTimer = setTimeout(() => {
    sidebarExpanded.value = false
  }, 100)
}

// Data user - digunakan di topbar dan sidebar
const account = ref({
  name: 'John Doe',
  position: 'Engineer ~ Fullstack'
})

const navItems = ref([
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: '/icons/material-symbols_dashboard-rounded.png'
  },
  {
    name: 'form',
    label: 'Form',
    path: '/form',
    icon: '/icons/mdi_form-outline.png'
  }
])

const currentRoute = computed(() => router.currentRoute.value.path)

const statsCards = ref([
  { key: 'totalJam', value: 50, label: 'Total Jam Lembur' },
  { key: 'pengajuan', value: 12, label: 'Pengajuan Lembur' },
  { key: 'approved', value: 8, label: 'Lembur di Approve' },
  { key: 'pending', value: 1, label: 'Pending' }
])

const overtimeList = ref([
  { task: 'Debugging', date: new Date(2026, 3, 24), hours: 7, status: 'Pending' },
  { task: 'Deployment', date: new Date(2026, 3, 23), hours: 5, status: 'Approved' },
  { task: 'Developing', date: new Date(2026, 3, 20), hours: 4, status: 'Approved' },
  { task: 'Testing', date: new Date(2026, 3, 18), hours: 4, status: 'Declined' },
  { task: 'Deployment', date: new Date(2026, 3, 15), hours: 5, status: 'Pending' },
  { task: 'Debugging', date: new Date(2026, 3, 11), hours: 6, status: 'Approved' },
  { task: 'Deployment', date: new Date(2026, 3, 9), hours: 8, status: 'Approved' },
  { task: 'Debugging', date: new Date(2026, 3, 7), hours: 6, status: 'Approved' },
  { task: 'Code Review', date: new Date(2026, 3, 5), hours: 3, status: 'Approved' },
  { task: 'Bug Fix', date: new Date(2026, 3, 2), hours: 4, status: 'Pending' }
])

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function getInitials(name) {
  return name
    .trim()
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function formatDate(date) {
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = String(date.getFullYear()).slice(-2)
  return `${day}-${month}-${year}`
}

const currentPeriod = computed(() => {
  const now = new Date()
  const monthName = MONTHS[now.getMonth()]
  const formattedMonth = monthName.charAt(0) + monthName.slice(1).toLowerCase()
  return `${formattedMonth} ${now.getFullYear()}`
})

function getStatusClass(status) {
  const statusMap = {
    'Pending': 'status-pending',
    'Approved': 'status-approved',
    'Declined': 'status-declined'
  }
  return statusMap[status] ?? 'status-default'
}

function handleLogout() {
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

/* LAYOUT UTAMA */
.dashboard-layout {
  display: flex;
  height: 100vh;
  background: #f4f5f7;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  overflow: hidden;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 52px;
  background: #fff;
  border-right: 0.5px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 100;
}

.sidebar.is-expanded {
  width: 220px;
}

/* Sidebar Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px;
  border-bottom: 0.5px solid #e0e0e0;
  min-height: 60px;
  white-space: nowrap;
  overflow: hidden;
}

.brand-logo {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.brand-text {
  overflow: hidden;
}

.brand-name {
  font-size: 12px;
  font-weight: 700;
  color: #111;
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1.3;
}

.brand-sub {
  font-size: 10px;
  color: #888;
  line-height: 1.3;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  color: #aaa;
  letter-spacing: 0.5px;
  padding: 6px 4px 4px;
  white-space: nowrap;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  color: #666;
  text-decoration: none;
  transition: background 0.15s;
}

.nav-item:hover {
  background: #f0f0f0;
}

.nav-item.active {
  background: #f0f0f0;
  color: #111;
}

.nav-icon-img {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Sidebar Account */
.sidebar-account {
  border-top: 0.5px solid #e0e0e0;
  padding: 10px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  overflow: hidden;
}

.account-info {
  flex: 1;
  overflow: hidden;
}

.account-name {
  font-size: 12px;
  font-weight: 600;
  color: #111;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.account-pos {
  font-size: 10px;
  color: #888;
}

.account-more {
  margin-left: auto;
  color: #bbb;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

/* Avatar Component */
.avatar {
  border-radius: 50%;
  background: linear-gradient(135deg, #1D127D, #397CFA);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 11px;
}

.avatar-md {
  width: 34px;
  height: 34px;
  font-size: 12px;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* TOPBAR */
.topbar {
  background: #fff;
  border-bottom: 0.5px solid #e0e0e0;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.greeting {
  font-size: 14px;
  color: #111;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.greeting strong {
  font-weight: 700;
}

.logout-btn {
  width: 120px;
  height: 30px;
  border: 1px solid #8d8d8d;
  border-radius: 6px;
  background: transparent;
  color: #6c6c6c;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.15s, color 0.15s;
}

.logout-btn:hover {
  background: #8d8d8d;
  color: #fff;
}

/* STATS SECTION */
.stats-section {
  background: linear-gradient(135deg, #1D127D, #397CFA);
  padding: 20px 20px 32px;
  flex-shrink: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 12px;
  justify-content: center;
}

.stat-card {
  background: #fff;
  border: 1.5px solid #111;
  border-radius: 10px;
  padding: 12px;
  position: relative;
  width: 200px;
  height: 116px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #111;
  line-height: 1.2;
  margin: 0 0 4px 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.stat-label {
  font-size: 13px;
  color: #444;
  font-weight: 500;
  margin: 0 0 4px 0;
  padding: 0 35px 0 0;
  line-height: 1.3;
}

.stat-period {
  font-size: 11px;
  color: #888;
  margin-top: 0;
}

/* CONTENT BODY */
.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f4f5f7;
}

/* MY OVERTIME BAR */
.overtime-bar {
  background: linear-gradient(90deg, #1D127D, #397CFA);
  padding: 11px 20px;
  text-align: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  border-radius: 10px;
  user-select: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  flex-shrink: 0;
}

/* TABLE CARD */
.overtime-table-card {
  background: #fff;
  border-radius: 10px;
  outline : 1px solid #0000;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.overtime-table-wrap {
  overflow-y: auto;
  flex: 1;
}

/* TABLE STYLING */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead th {
  background: #848484;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 9px 14px;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 2;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

thead th:nth-child(1) {
  width: 30%;
}

thead th:nth-child(2) {
  width: 25%;
}

thead th:nth-child(3) {
  width: 20%;
}

thead th:nth-child(4) {
  width: 25%;
}

tbody tr {
  border-bottom: 1px solid #ececec;
  transition: background 0.1s;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: #f8f9ff;
}

tbody td {
  padding: 9px 14px;
  font-size: 12px;
  color: #222;
  font-family: 'Inter', sans-serif;
}

/* STATUS BADGE */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid transparent;
  font-family: 'Inter', sans-serif;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-pending {
  background: #FFF8E1;
  border-color: #FFD54F;
  color: #7a5c00;
}

.status-pending .status-dot {
  background: #FFD54F;
}

.status-approved {
  background: #E8F5E9;
  border-color: #81C784;
  color: #1b5e20;
}

.status-approved .status-dot {
  background: #66BB6A;
}

.status-declined {
  background: #FFEBEE;
  border-color: #E57373;
  color: #b71c1c;
}

.status-declined .status-dot {
  background: #EF5350;
}

.status-default {
  background: #f0f0f0;
  border-color: #ccc;
  color: #888;
}

.status-default .status-dot {
  background: #ccc;
}

/* TRANSITIONS */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>