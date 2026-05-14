<template>
  <div class="dashboard-page">
   <section class="welcome-banner">
        <h1>
          {{ isFirstLogin ? "Welcome" : "Welcome back" }}, {{ account.name }}
        </h1>
        <p>Here's your overtime overview.</p>
      </section>
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
                <th v-if="userRole === 'product_manager'">Name</th>
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
                <td v-if="userRole === 'product_manager'">{{ row.employeeName || 'Karyawan' }}</td>
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

    <!-- MODAL DETAIL -->
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
              <div class="detail-header">
                <p class="detail-title">DETAIL PENGAJUAN LEMBUR</p>
                <span
                  class="detail-status-badge"
                  :style="getStatusStyle(selectedOvertime.status)"
                >
                  {{ selectedOvertime.status }}
                </span>
              </div>

              <div class="detail-body">
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

                <div class="detail-section">
                  <p class="section-label">
                    <i class="fa-solid fa-align-left"></i> Detail Pekerjaan
                  </p>
                  <!-- Fallback jika hanya menggunakan format lama (desc) -->
                  <div class="field-grid" v-if="!selectedOvertime.tasks || selectedOvertime.tasks.length === 0">
                    <div class="field-group full">
                      <span class="field-label">Task</span>
                      <span class="field-value">{{ selectedOvertime.task }}</span>
                    </div>
                    <div class="field-group full">
                      <span class="field-label">Deskripsi</span>
                      <span class="field-value field-desc">{{ selectedOvertime.desc || 'Tidak ada deskripsi' }}</span>
                    </div>
                  </div>

                  <!-- Format iterasi jika ada subtasks -->
                  <div class="field-grid" v-if="selectedOvertime.tasks && selectedOvertime.tasks.length > 0">
                    <div class="field-group full" v-for="(subtask, idx) in selectedOvertime.tasks" :key="idx">
                      <span class="field-label" style="color: #1D127D; font-weight: 700;">Task {{ idx + 1 }}: {{ subtask.name }}</span>
                      <span class="field-value field-desc">{{ subtask.description }}</span>
                    </div>
                  </div>
                </div>
              </div>

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
import { useRoute } from 'vue-router'
import { overtimeList } from '../../../store/overtimeStore'

const userRole = ref(window.localStorage.getItem('role'));

// Kita perlu akses account dari parent? Atau gunakan state management / provide-inject?
// Solusi sederhana: defineProps atau bisa juga pake composable.
// Tapi karena account ada di App.vue (parent), kita bisa terima via props.
// Atau pindahkan account ke store Pinia. Untuk sekarang, kita buat props dulu.

const props = defineProps({
  account: {
    type: Object,
    required: true,
    default: () => ({ name: 'John Doe', position: 'Engineer ~ Fullstack' })
  }
})

const router = useRoute()


// STATS CARD SUMMARIES (Logic Perhitungan Stats Card).
const statsCards = computed(() => {
  const list = overtimeList.value || [];
  
  const totalJam = list.reduce((sum, item) => sum + Number(item.hours || 0), 0);
  const pengajuan = list.length;
  const approved = list.filter(item => item.status === 'Approved').length;
  const pending = list.filter(item => item.status === 'Pending').length;
  const declined = list.filter(item => item.status === 'Declined').length;

  return [
    { key: 'totalJam', value: totalJam, label: 'Total Jam Lembur' },
    { key: 'pengajuan', value: pengajuan, label: 'Pengajuan Lembur' },
    { key: 'approved', value: approved, label: 'Lembur di Approve' },    
    { key: 'pending', value: pending, label: 'Pending' },
    { key: 'declined', value: declined, label: 'Declined' }
  ];
})



// Modal state
const isDetailModalOpen = ref(false)
const selectedOvertime = ref({})

const openDetailModal = (rowData) => {
  selectedOvertime.value = rowData
  isDetailModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedOvertime.value = {}
  document.body.style.overflow = ''
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeDetailModal()
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isDetailModalOpen.value) {
    closeDetailModal()
  }
}

const isFirstLogin = ref(false);

onMounted(() => {
  isFirstLogin.value = localStorage.getItem("isFirstLogin") === "true";
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Utilities
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

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

function getStatusStyle(status) {
  const styles = {
    'Approved': 'background:#E8F5E9;border-color:#81C784;color:#1b5e20',
    'Declined': 'background:#FFEBEE;border-color:#E57373;color:#b71c1c',
    'Pending':  'background:#FFF8E1;border-color:#FFD54F;color:#7a5c00'
  }
  return styles[status] || styles['Pending']
}
</script>

<style scoped>
/* ============================================================
   STYLE KHUSUS DASHBOARD (hanya yang belum ada di App.vue)
   ============================================================ */
.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.welcome-banner {
  padding: 20px 24px 10px;
  background: #f4f5f7;
}

.welcome-banner h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #111;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.welcome-banner p {
  margin-top: 6px;
  color: #666;
  font-size: 14px;
}

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

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f4f5f7;
}

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

/* MODAL STYLE (sama seperti sebelumnya) */
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

.detail-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

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

.detail-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0;
}

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