<template>
  <div class="app-layout">
    <!-- SIDEBAR (dipindah dari Dashboard.vue) -->
    <aside
      class="sidebar"
      :class="{ 'is-expanded': sidebarExpanded }"
      @mouseenter="handleSidebarMouseEnter"
      @mouseleave="handleSidebarMouseLeave"
      v-if="currentRoute !== '/'"
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
        <RouterLink 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.path"
          class="nav-item" 
          :class="{ active: currentRoute === item.path }"
        >
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
      <!-- TOPBAR-->
      <header class="topbar" v-if="currentRoute !== '/'">
        <div class="topbar-left">
          <div class="avatar avatar-md">{{ getInitials(account.name) }}</div>
          <span class="greeting">Hello, <strong>{{ account.name }}</strong></span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          Logout
        </button>
      </header>

      <!-- -->
      <div class="page-content">
        <router-view :account="account" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()

// ============================================================
// SIDEBAR STATE (dipindah dari Dashboard.vue)
// ============================================================
const sidebarExpanded = ref(false)
let sidebarHoverTimer = null

function handleSidebarMouseEnter() {
  if (sidebarHoverTimer) clearTimeout(sidebarHoverTimer)
  sidebarExpanded.value = true
}

function handleSidebarMouseLeave() {
  sidebarHoverTimer = setTimeout(() => {
    sidebarExpanded.value = false
  }, 100)
}

onUnmounted(() => {
  if (sidebarHoverTimer) clearTimeout(sidebarHoverTimer)
})

const isLoggedIn = computed( () => {
  return window.localStorage.getItem('token') !== null
})

// ============================================================
// USER ACCOUNT DATA
// ============================================================
const account = ref({
  name: 'John Doe',
  position: 'Engineer ~ Fullstack'
})

// ============================================================
// NAVIGATION
// ============================================================
const navItems = computed(() => {
  const role = window.localStorage.getItem('role');
  const items = [
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
  ];

  if (role === 'product_manager') {
    items.push({
      name: 'review-approvals',
      label: 'Review Approvals',
      path: '/review-approvals',
      icon: '/icons/mdi_checkbox-outline.png'
    });
  }

  return items;
})

const currentRoute = computed(() => route.path)

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function getInitials(name) {
  return name
    .trim()
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// ============================================================
// LOGOUT
// ============================================================
function handleLogout() {
  window.localStorage.removeItem('token');
  window.location.href = '/';
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}

/* ============================================================
   APP LAYOUT UTAMA
   ============================================================ */
.app-layout {
  display: flex;
  height: 100vh;
  background: #f4f5f7;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  overflow: hidden;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
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
  cursor: pointer;
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
  cursor: pointer;
}

.brand-sub {
  font-size: 10px;
  color: #888;
  line-height: 1.3;
  cursor: pointer;
}

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
  cursor: pointer;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.avatar-md {
  width: 34px;
  height: 34px;
  font-size: 14px;
}

/* ============================================================
   MAIN CONTENT
   ============================================================ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

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

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* ============================================================
   TRANSITIONS
   ============================================================ */
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