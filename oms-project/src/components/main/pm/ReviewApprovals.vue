<template>
  <div class="review-approvals">
    <!-- HEADER SECTION -->
    <div class="header">
      <h1 class="header-title">Review Pengajuan Lembur</h1>
      <p class="header-subtitle">Kelola dan review pengajuan lembur karyawan</p>
    </div>

    <!-- FILTER TABS -->
    <div class="filter-tabs">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-pill"
        :class="{ active: selectedFilter === filter.value }"
        @click="filterApprovals(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- TABLE -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Tanggal</th>
            <th>Durasi</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="approval in filteredApprovals"
            :key="approval.id"
            class="table-row"
          >
            <td>{{ approval.employeeName }}</td>
            <td>{{ formatDate(approval.overtimeDate) }}</td>
            <td>{{ approval.duration }}</td>
            <td>
              <img :src="`/icons/status/${approval.status}.png`" :alt="approval.status" class="status-icon-img" />
            </td>
            <td>
              <button class="detail-btn" @click="openModal(approval)">Detail</button>
            </td>
          </tr>
          <tr v-if="filteredApprovals.length === 0">
            <td colspan="5" class="text-center">Tidak ada pengajuan lembur.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL DETAIL -->
    <Teleport to="body">
      <Transition name="overlay-fade">
        <div
          v-if="isModalOpen"
          class="modal-overlay"
          @click="handleOverlayClick"
        >
          <Transition name="modal-slide">
            <div
              v-if="isModalOpen"
              class="modal-content"
              role="dialog"
              aria-modal="true"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="modal-header">
                <p class="modal-title">DETAIL PENGAJUAN LEMBUR</p>
                <img 
                  :src="`/icons/status/${selectedApproval?.status}.png`" 
                  :alt="selectedApproval?.status" 
                  class="modal-status-img"
                />
                <button class="close-btn" @click="closeModal" aria-label="Close modal">
                  <i class="ti ti-x"></i>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="modal-body">
                <!-- A. INFORMASI PENGAJU -->
                <div class="detail-section">
                  <p class="section-label">
                    <i class="ti ti-user"></i> INFORMASI PENGAJU
                  </p>
                  <div class="field-grid">
                    <div class="field-group full">
                      <span class="field-label">NAMA EMPLOYEE</span>
                      <span class="field-value">{{ selectedApproval?.employeeName }}</span>
                    </div>
                    <div class="field-group">
                      <span class="field-label">JABATAN</span>
                      <span class="field-value">{{ selectedApproval?.employeePosition }}</span>
                    </div>
                    <div class="field-group">
                      <span class="field-label">LAMA DURASI PERJANJIAN</span>
                      <span class="field-value">{{ selectedApproval?.contractDuration }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- B. WAKTU LEMBUR -->
                <div class="detail-section">
                  <p class="section-label">
                    <i class="ti ti-clock"></i> WAKTU LEMBUR
                  </p>
                  <div class="field-grid">
                    <div class="field-group">
                      <span class="field-label">TANGGAL</span>
                      <span class="field-value">{{ formatDate(selectedApproval?.overtimeDate) }}</span>
                    </div>
                    <div class="field-group">
                      <span class="field-label">JAM MULAI</span>
                      <span class="field-value">{{ selectedApproval?.startTime }} WIB</span>
                    </div>
                    <div class="field-group full">
                      <span class="field-label">DURASI</span>
                      <span class="field-value">{{ selectedApproval?.duration }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- C. DETAIL PEKERJAAN -->
                <div class="detail-section">
                  <p class="section-label">
                    <i class="ti ti-align-left"></i> DETAIL PEKERJAAN
                  </p>
                  <div
                    v-for="(task, index) in selectedApproval?.tasks"
                    :key="index"
                    class="task-item"
                  >
                    <p class="task-title">TASK {{ index + 1 }}: {{ task.name }}</p>
                    <p class="task-description">{{ task.description }}</p>
                    <div v-if="index < selectedApproval.tasks.length - 1" class="task-divider"></div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- D. NOTES REVIEWER -->
                <div class="detail-section">
                  <p class="section-label">NOTES REVIEWER (OPSIONAL)</p>
                  <textarea
                    v-model="reviewerNotes"
                    class="reviewer-notes"
                    placeholder="Tambahkan catatan review..."
                    rows="4"
                  ></textarea>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="modal-footer">
                <button class="btn-reject" @click="handleReject(selectedApproval?.id)">
                  <i class="ti ti-circle-x"></i> Reject
                </button>
                <button class="btn-approve" @click="handleApprove(selectedApproval?.id)">
                  <i class="ti ti-circle-check"></i> Approve
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

// ============================================================
// STATE MANAGEMENT
// ============================================================
const selectedFilter = ref('all') 
const approvals = ref([])
const isModalOpen = ref(false)
const selectedApproval = ref(null)
const reviewerNotes = ref('')

// ============================================================
// DUMMY DATA
// ============================================================
const approvalsList = [
  {
    id: 1,
    employeeName: "Afgan Ramadhan",
    employeePosition: "Engineer - Fullstack",
    contractDuration: "Lama Durasi Perjanjian",
    overtimeDate: new Date(2026, 3, 24),
    startTime: "19:00",
    duration: "7 Jam",
    status: "Pending",
    tasks: [
      { name: "Debugging", description: "Investigasi dan perbaikan critical bug pada endpoint autentikasi." }
    ]
  },
  {
    id: 2,
    employeeName: "John Doe",
    employeePosition: "Frontend Developer",
    contractDuration: "Lama Durasi Perjanjian",
    overtimeDate: new Date(2026, 3, 23),
    startTime: "19:30",
    duration: "5 Jam",
    status: "Pending",
    tasks: [
      { name: "UI Development", description: "Implementasi design system baru untuk dashboard." }
    ]
  },
  {
    id: 3,
    employeeName: "Sari Dewi",
    employeePosition: "QA Engineer",
    contractDuration: "Lama Durasi Perjanjian",
    overtimeDate: new Date(2026, 3, 20),
    startTime: "17:00",
    duration: "4 Jam",
    status: "Reviewed",
    tasks: [
      { name: "Code Review", description: "Review pull requests from frontend team." }
    ]
  },
  {
    id: 4,
    employeeName: "Budi Santoso",
    employeePosition: "Backend Developer",
    contractDuration: "Lama Durasi Perjanjian",
    overtimeDate: new Date(2026, 3, 19),
    startTime: "20:00",
    duration: "5 Jam",
    status: "Approved",
    tasks: [
      { name: "API Development", description: "Develop new endpoints untuk modul reporting." }
    ]
  },
  {
    id: 5,
    employeeName: "Maya Putri",
    employeePosition: "DevOps Engineer",
    contractDuration: "Lama Durasi Perjanjian",
    overtimeDate: new Date(2026, 3, 18),
    startTime: "19:00",
    duration: "3 Jam",
    status: "Declined",
    tasks: [
      { name: "Deployment", description: "Deploy hotfix ke production." }
    ]
  },
]

// Initialize with dummy data
approvals.value = approvalsList

// ============================================================
// FILTER OPTIONS
// ============================================================
const filters = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewed', value: 'reviewed' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

// ============================================================
// COMPUTED PROPERTIES
// ============================================================
const filteredApprovals = computed(() => {
  if (selectedFilter.value === 'all') {
    return approvals.value
  }
  return approvals.value.filter(item => 
    item.status.toLowerCase() === selectedFilter.value
  )
})

// ============================================================
// FUNCTIONS
// ============================================================

function filterApprovals(status) {
  selectedFilter.value = status
}

function openModal(approval) {
  selectedApproval.value = approval
  isModalOpen.value = true
  reviewerNotes.value = ''
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  isModalOpen.value = false
  selectedApproval.value = null
  reviewerNotes.value = ''
  document.body.style.overflow = ''
}

function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

function handleApprove(id) {
  if (!confirm('Apakah Anda yakin ingin menyetujui pengajuan lembur ini?')) {
    return
  }

  // TODO: Uncomment saat backend ready
  // await axios.post(`/overtime/${id}/approve`, { notes: reviewerNotes.value })

  // Update local state
  const approval = approvals.value.find(a => a.id === id)
  if (approval) {
    approval.status = 'Approved'
  }

  alert('Pengajuan berhasil disetujui')
  closeModal()
}

function handleReject(id) {
  if (!reviewerNotes.value.trim()) {
    alert('Catatan penolakan wajib diisi')
    return
  }

  // TODO: Uncomment saat backend ready
  // await axios.post(`/overtime/${id}/reject`, { notes: reviewerNotes.value })

  // Update local state
  const approval = approvals.value.find(a => a.id === id)
  if (approval) {
    approval.status = 'Rejected'
  }

  alert('Pengajuan ditolak')
  closeModal()
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const year = String(d.getFullYear()).slice(-2)
  return `${day}-${month}-${year}`
}

// ============================================================
// LIFECYCLE HOOKS
// ============================================================
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// ============================================================
// API INTEGRATION (TODO)
// ============================================================
// TODO: Uncomment saat backend ready
// async function fetchApprovals() {
//   const response = await axios.get('/overtime/pending-approvals', {
//     params: { pm_id: currentPmId }
//   })
//   approvals.value = response.data
// }

// async function approveRequest(id, notes) {
//   await axios.post(`/overtime/${id}/approve`, { notes })
// }

// async function rejectRequest(id, notes) {
//   await axios.post(`/overtime/${id}/reject`, { notes })
// }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

.review-approvals {
  padding: 24px;
  background: #f4f5f7;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ============================================================
   HEADER SECTION
   ============================================================ */
.header {
  background: linear-gradient(135deg, #1D127D, #397CFA);
  padding: 24px;
  border-radius: 12px;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin: 0 0 8px 0;
}

.header-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-family: 'Inter', sans-serif;
  margin: 0;
}

/* ============================================================
   FILTER TABS
   ============================================================ */
.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-pill {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: #6B7280;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.filter-pill:hover {
  background: rgba(59, 91, 219, 0.1);
}

.filter-pill.active {
  background: #1D127D;
  color: #fff;
}

/* ============================================================
   TABLE
   ============================================================ */
.table-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 14px;
  text-align: left;
  border-bottom: 2px solid #E5E7EB;
}

thead th:nth-child(1) { width: 30%; }
thead th:nth-child(2) { width: 20%; }
thead th:nth-child(3) { width: 15%; }
thead th:nth-child(4) { width: 20%; }
thead th:nth-child(5) { width: 15%; }

tbody td {
  font-size: 13px;
  color: #111;
  font-family: 'Inter', sans-serif;
  padding: 14px;
  border-bottom: 1px solid #E5E7EB;
}

tbody tr:hover {
  background: #F9FAFB;
}

tbody tr:last-child td {
  border-bottom: none;
}

.status-icon-img {
  height: 18px;
  width: auto;
  display: block;
}

.modal-status-img {
  height: 18px;
  width: auto;
  display: block;
}

.detail-btn {
  background: #1D127D;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.detail-btn:hover {
  background: #2563EB;
}

.text-center {
  text-align: center;
  color: #6B7280;
  font-style: italic;
}

/* ============================================================
   MODAL
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 14px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #2D3B8F, #4A5FC1);
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-transform: uppercase;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.detail-section {
  margin-bottom: 16px;
}

.section-label {
  font-size: 10px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin: 0 0 10px 0;
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
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.field-value {
  font-size: 13px;
  color: #111;
  font-weight: 500;
  background: #F7F7F8;
  border-radius: 7px;
  padding: 10px 12px;
  min-height: 36px;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}

.detail-divider {
  height: 1px;
  background: #E5E7EB;
  margin: 16px 0;
}

.task-item {
  margin-bottom: 12px;
}

.task-title {
  font-size: 12px;
  font-weight: 700;
  color: #1D127D;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-transform: uppercase;
  margin: 0 0 6px 0;
}

.task-description {
  font-size: 13px;
  color: #111;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
  margin: 0;
}

.task-divider {
  height: 1px;
  background: #E5E7EB;
  margin: 12px 0;
}

.reviewer-notes {
  width: 100%;
  min-height: 80px;
  background: #F9FAFB;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.15s;
}

.reviewer-notes:focus {
  outline: none;
  border-color: #3B82F6;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #E5E7EB;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-reject,
.btn-approve {
  padding: 0 24px;
  height: 40px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.15s;
}

.btn-reject:hover,
.btn-approve:hover {
  opacity: 0.9;
}

.btn-reject {
  background: #DC2626;
  color: #fff;
}

.btn-approve {
  background: #16A34A;
  color: #fff;
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
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

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .review-approvals {
    padding: 16px;
  }

  .header {
    padding: 20px;
  }

  .table-container {
    padding: 16px;
  }

  .modal-content {
    max-width: 100%;
    border-radius: 12px;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-footer {
    padding: 12px 16px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
