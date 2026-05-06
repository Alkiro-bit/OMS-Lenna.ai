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

      <!-- STATS HERO SECTION -->
      <section class="stats-section">
        <div class="stats-grid">
          <div v-for="card in statsCards" :key="card.key" class="stat-card">
            <p class="stat-number">{{ card.value }}</p>
            <p class="stat-label">{{ card.label }}</p>
            <p class="stat-period">{{ currentPeriod }}</p>
          </div>
        </div>
      </section>

      <!-- CONTENT BODY: My Overtime + Table -->
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
                <tr
                  v-for="(row, i) in overtimeList"
                  :key="i"
                  class="table-row-clickable"
                  @click="openDetailModal(row)"
                  tabindex="0"
                  @keydown.enter="openDetailModal(row)"
                >
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

    <!-- ============================================================
          DETAIL PENGAJUAN LEMBUR 
         ============================================================ -->
    <Teleport to="body">
      <Transition name="overlay-fade">
        <div
        v-if="isDetailModalOpen"
        class="detail-overlay"
        @click="handleOverlayClick"
      >
        <Transition name="modal-slide">
          <div
            v-if="isDetailModalOpen"
            class="detail-modal"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <!-- DETAIL HEADER -->
            <div class="detail-header">
              <p class="detail-title">DETAIL PENGAJUAN LEMBUR</p>
              <span
                class="detail-status-badge"
                :style="getStatusStyle(selectedOvertime.status)"
              >
                {{ selectedOvertime.status }}
              </span>
            </div>

            <!-- "DETAIL" BODY -->
            <div class="detail-body">

              <!-- SECTION 1: Informasi Pengaju -->
              <div class="detail-section">
                <p class="section-label">
                  <i class="fa-solid fa-user"></i> Informasi Pengaju
                </p>
                <div class="field-grid">
                  <div class="field-group full">
                    <span class="field-label">Nama Karyawan</span>
                    <span class="field-value">{{ account.name }}</span>
                  </div>
                  <div class="field-group">
                    <span class="field-label">Jabatan</span>
                    <span class="field-value">{{ account.position }}</span>
                  </div>
                  <div class="field-group">
                    <span class="field-label">PIC</span>
                    <span class="field-value">{{ selectedOvertime.pic || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-divider"></div>

              <!-- SECTION 2: Waktu Lembur -->
              <div class="detail-section">
                <p class="section-label">
                  <i class="fa-solid fa-clock"></i> Waktu Lembur
                </p>
                <div class="field-grid">
                  <div class="field-group">
                    <span class="field-label">Tanggal</span>
                    <span class="field-value">{{ formatDate(selectedOvertime.date) }}</span>
                  </div>
                  <div class="field-group">
                    <span class="field-label">Jam Mulai</span>
                    <span class="field-value">{{ selectedOvertime.jamMulai || '19:00' }} WIB</span>
                  </div>
                  <div class="field-group full">
                    <span class="field-label">Durasi</span>
                    <span class="field-value">{{ selectedOvertime.hours }} Jam</span>
                  </div>
                </div>
              </div>

              <div class="detail-divider"></div>

              <!-- SECTION 3: Detail Pekerjaan -->
              <div class="detail-section">
                <p class="section-label">
                  <i class="fa-solid fa-align-left"></i> Detail Pekerjaan
                </p>
                <div class="field-grid">
                  <div class="field-group full">
                    <span class="field-label">Task</span>
                    <span class="field-value">{{ selectedOvertime.task }}</span>
                  </div>
                  <div class="field-group full">
                    <span class="field-label">Deskripsi</span>
                    <span class="field-value field-desc">{{ selectedOvertime.desc || 'Tidak ada deskripsi' }}</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- MODAL FOOTER -->
            <div class="detail-footer">
              <button class="btn-close-modal" @click="closeDetailModal">
                <i class="fa-solid fa-xmark"></i> Close
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

// ============================================================
// SIDEBAR STATE
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

// ============================================================
// STATS CARDS
// ============================================================
const statsCards = ref([
  { key: 'totalJam', value: 52, label: 'Total Jam Lembur' },
  { key: 'pengajuan', value: 10, label: 'Pengajuan Lembur' },
  { key: 'approved', value: 6, label: 'Lembur di Approve' },
  { key: 'pending', value: 3, label: 'Pending' },
  { key: 'declined', value: 1, label: 'Declined' }
])

// ============================================================
// OVERTIME LIST - dengan data dummy lengkap untuk detail modal
// ============================================================
const overtimeList = ref([
  {
    task: 'Debugging',
    date: new Date(2026, 3, 24),
    hours: 7,
    status: 'Pending',
    jamMulai: '19:00',
    jenis: 'Bug Fixing',
    pic: 'Budi Santoso',
    desc: 'Investigasi dan perbaikan critical bug pada endpoint autentikasi yang menyebabkan gagal login pada sejumlah user di environment production.'
  },
  {
    task: 'Deployment',
    date: new Date(2026, 3, 23),
    hours: 5,
    status: 'Approved',
    jamMulai: '19:30',
    jenis: 'Deployment',
    pic: 'Rina Marlina',
    desc: 'Deploy versi 2.4.1 ke production server, mencakup migrasi database schema, konfigurasi environment variable, dan validasi rollback plan.'
  },
  {
    task: 'Developing',
    date: new Date(2026, 3, 20),
    hours: 4,
    status: 'Approved',
    jamMulai: '20:00',
    jenis: 'Feature Development',
    pic: 'Budi Santoso',
    desc: 'Pengembangan fitur notifikasi real-time menggunakan WebSocket untuk modul overtime management, termasuk unit test dan dokumentasi.'
  },
  {
    task: 'Testing',
    date: new Date(2026, 3, 18),
    hours: 4,
    status: 'Declined',
    jamMulai: '19:00',
    jenis: 'QA Testing',
    pic: 'Doni Pratama',
    desc: 'Regression testing untuk sprint 12, mencakup 45 test case pada modul approval dan reporting. Ditolak karena overlap jadwal dengan lembur sebelumnya.'
  },
  {
    task: 'Deployment',
    date: new Date(2026, 3, 15),
    hours: 5,
    status: 'Pending',
    jamMulai: '21:00',
    jenis: 'Deployment',
    pic: 'Rina Marlina',
    desc: 'Hotfix deployment untuk patch keamanan pada dependency library yang teridentifikasi memiliki celah keamanan kritikal di environment production.'
  },
  {
    task: 'Debugging',
    date: new Date(2026, 3, 11),
    hours: 6,
    status: 'Approved',
    jamMulai: '19:00',
    jenis: 'Bug Fixing',
    pic: 'Doni Pratama',
    desc: 'Debug performa query database yang lambat pada halaman laporan bulanan. Ditemukan missing index pada tabel overtime_requests, dilakukan optimasi query plan.'
  },
  {
    task: 'Deployment',
    date: new Date(2026, 3, 9),
    hours: 8,
    status: 'Approved',
    jamMulai: '20:00',
    jenis: 'Deployment',
    pic: 'Budi Santoso',
    desc: 'Major release v3.0.0 menggunakan strategi blue-green deployment. Meliputi zero-downtime deployment, konfigurasi load balancer, dan smoke testing post-deploy.'
  },
  {
    task: 'Debugging',
    date: new Date(2026, 3, 7),
    hours: 6,
    status: 'Approved',
    jamMulai: '19:00',
    jenis: 'Bug Fixing',
    pic: 'Doni Pratama',
    desc: 'Perbaikan bug pada fitur export PDF laporan lembur. Issue terletak pada library rendering yang tidak kompatibel dengan data format tertentu.'
  },
  {
    task: 'Code Review',
    date: new Date(2026, 3, 5),
    hours: 3,
    status: 'Approved',
    jamMulai: '19:30',
    jenis: 'Code Review',
    pic: 'Budi Santoso',
    desc: 'Review pull request dari 2 developer junior mencakup 10 file dan sekitar 600 baris perubahan kode pada modul form pengajuan lembur.'
  },
  {
    task: 'Bug Fix',
    date: new Date(2026, 3, 2),
    hours: 4,
    status: 'Pending',
    jamMulai: '20:00',
    jenis: 'Bug Fixing',
    pic: 'Rina Marlina',
    desc: 'Fix issue pada validasi form pengajuan lembur dimana durasi tidak terhitung dengan benar saat jam mulai melewati tengah malam.'
  }
])

// ============================================================
// MODAL STATE & FUNCTIONS
// ============================================================
const isDetailModalOpen = ref(false)
const selectedOvertime = ref({})

/**
 * Buka modal detail dengan data overtime yang dipilih
 */
const openDetailModal = (rowData) => {
  selectedOvertime.value = rowData
  isDetailModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

/**
 * Tutup modal detail
 */
const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedOvertime.value = {}
  document.body.style.overflow = ''
}

/**
 * Tutup modal saat klik overlay (di luar modal)
 */
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeDetailModal()
  }
}

// ============================================================
// KEYBOARD HANDLER (Escape untuk tutup modal)
// ============================================================
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isDetailModalOpen.value) {
    closeDetailModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
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
  if (!date) return '-'
  const d = new Date(date)
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const year = String(d.getFullYear()).slice(-2)
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

/**
 * Mengembalikan inline style untuk status badge di header modal
 */
function getStatusStyle(status) {
  const styles = {
    'Approved': 'background:#E8F5E9;border-color:#81C784;color:#1b5e20',
    'Declined': 'background:#FFEBEE;border-color:#E57373;color:#b71c1c',
    'Pending':  'background:#FFF8E1;border-color:#FFD54F;color:#7a5c00'
  }
  return styles[status] || styles['Pending']
}

function handleLogout() {
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

/* ============================================================
   LAYOUT UTAMA
   ============================================================ */
.dashboard-layout {
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
  grid-template-columns: repeat(5, auto);
  gap: 12px;
  justify-content: center;
}

.stat-card {
  background: #fff;
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
  outline: 1px solid #0000;
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

thead th:nth-child(1) { width: 30%; }
thead th:nth-child(2) { width: 25%; }
thead th:nth-child(3) { width: 20%; }
thead th:nth-child(4) { width: 25%; }

tbody tr {
  border-bottom: 1px solid #ececec;
  transition: background 0.1s;
}

tbody tr:last-child { border-bottom: none; }

tbody tr:hover { background: #f8f9ff; }

/* ROW CLICKABLE */
.table-row-clickable {
  cursor: pointer;
}

.table-row-clickable:focus {
  outline: 2px solid #397CFA;
  outline-offset: -2px;
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
.status-pending .status-dot { background: #FFD54F; }

.status-approved {
  background: #E8F5E9;
  border-color: #81C784;
  color: #1b5e20;
}
.status-approved .status-dot { background: #66BB6A; }

.status-declined {
  background: #FFEBEE;
  border-color: #E57373;
  color: #b71c1c;
}
.status-declined .status-dot { background: #EF5350; }

.status-default {
  background: #f0f0f0;
  border-color: #ccc;
  color: #888;
}
.status-default .status-dot { background: #ccc; }

/* ============================================================
   MODAL DETAIL PENGAJUAN LEMBUR
   ============================================================ */

/* Overlay */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

/* Modal Container */
.detail-modal {
  background: #fff;
  border-radius: 14px;
  width: 540px;
  max-width: 94vw;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Modal Header */
.detail-header {
  background: linear-gradient(90deg, #1D127D, #397CFA);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.detail-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin: 0;
}

.detail-status-badge {
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  border: 1.5px solid transparent;
  font-family: 'Inter', sans-serif;
}

/* Modal Body */
.detail-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

/* Section Label */
.section-label {
  font-size: 10px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 5px;
}

.section-label i {
  font-size: 11px;
}

/* Field Grid */
.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-group.full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.field-value {
  font-size: 13px;
  color: #111;
  font-weight: 500;
  background: #f7f7f8;
  border-radius: 7px;
  padding: 9px 12px;
  min-height: 36px;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}

.field-desc {
  min-height: 76px;
  font-size: 12px;
  line-height: 1.65;
  font-weight: 400;
  white-space: pre-wrap;
}

/* Divider */
.detail-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0;
}

/* Modal Footer */
.detail-footer {
  padding: 14px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.btn-close-modal {
  padding: 0 24px;
  height: 36px;
  border-radius: 8px;
  background: #1D127D;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}

.btn-close-modal:hover {
  background: #2b1cb0;
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

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-slide-enter-from {
  transform: translateY(20px) scale(0.97);
  opacity: 0;
}
.modal-slide-leave-to {
  transform: translateY(20px) scale(0.97);
  opacity: 0;
}
</style>
