<template>
  <div class="review-approvals">

    <section class="stats-section">
      <div class="stats-grid">
        <h1 class="header-title">Overtime Submission Review</h1>
        <p class="header-subtitle">Manage and review employee overtime requests</p>
      </div>
    </section>

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
            <th>Name</th>
            <th>Form Title</th>
            <th>DATE</th>
            <th>Duration</th>
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
            <td>{{ approval.overtime_title }}</td> <!-- ================ TITLE TABLE (ini uda bener belom si?) ================== -->
            <td>{{ formatDate(approval.overtimeDate) }}</td>
            <td>{{ approval.duration }}</td>
            <td>
              <img
                :src="getStatusIcon(approval.status)"
                :alt="approval.status"
                class="status-icon-img"
              />
            </td>
            <td>
              <button class="detail-btn" @click="openModal(approval)">
                Detail
              </button>
            </td>
          </tr>
          <tr v-if="filteredApprovals.length === 0">
            <td colspan="6" class="text-center">Tidak ada pengajuan lembur.</td>
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
                <p class="modal-title">OVERTIME SUBMISSION DETAILS</p>
                <img
                  :src="getStatusIcon(selectedApproval?.status)"
                  :alt="selectedApproval?.status"
                  class="modal-status-img"
                />
                <button
                  class="close-btn"
                  @click="closeModal"
                  aria-label="Close modal"
                >
                  <i class="ti ti-x"></i>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="modal-body">
                <!-- A. INFORMASI PENGAJU -->
                <div class="detail-section">
                  <p class="section-label">
                    <i class="ti ti-user"></i> Submitter Information
                  </p>
                 <div class="field-grid">
                    <div class="field-group full">
                      <span class="field-label">Name</span>
                      <span class="field-value">
                        {{ selectedApproval?.employeeName }}
                      </span>
                    </div>

                    <div class="field-group full">
                      <span class="field-label">Position</span>
                      <span class="field-value">
                        {{ selectedApproval?.employeePosition }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- B. DETAIL LEMBUR -->
                <div class="detail-section">
                  <p class="section-label">
                    <i class="ti ti-clock"></i> Overtime Information
                  </p>
                  <div class="field-grid">
                    
                    <!-- ============================ FORM TITLE (itu calling data Arraynya udah bener ga si?)============================ -->
                    <div class="field-group full">
                      <span class="field-label">FORM TITLE</span> 
                      <span class="field-value">
                        {{ selectedApproval?.overtime_title }}
                      </span>
                    </div>
                    
                    <div class="field-group">
                      <span class="field-label">Date</span>
                      <span class="field-value">
                        {{ formatDate(selectedApproval?.overtimeDate) }}
                      </span>
                    </div>

                    <div class="field-group">
                      <span class="field-label">Start Time</span>
                      <span class="field-value">
                        {{ selectedApproval?.startTime }} WIB
                      </span>
                    </div>

                    <div class="field-group">
                      <span class="field-label">End Time</span>
                      <span class="field-value">
                        {{ selectedApproval?.endTime }} WIB
                      </span>
                    </div>

                    <div class="field-group">
                      <span class="field-label">Duration</span>
                      <span class="field-value">
                        {{ selectedApproval?.duration }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- C. DETAIL PEKERJAAN -->
                <div class="detail-section">
                  <p class="section-label">
                    <i class="ti ti-align-left"></i> Task Details
                  </p>
                  <div
                    v-for="(task, index) in selectedApproval?.tasks"
                    :key="index"
                    class="task-item"
                  >
                    <p class="task-title">
                      TASK {{ index + 1 }}: {{ task.name }}
                    </p>
                    <p class="task-description">{{ task.description }}</p>
                    <div
                      v-if="index < selectedApproval.tasks.length - 1"
                      class="task-divider"
                    ></div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- D. NOTES REVIEWER -->
                <div class="detail-section">
                  <p class="section-label">REVIEWER NOTES</p>
                  <textarea
                    v-if="!isFinalStatus(selectedApproval?.status)"
                    v-model="reviewerNotes"
                    class="reviewer-notes"
                    placeholder="Add review notes..."
                    rows="4"
                  ></textarea>
                  <textarea
                    v-else
                    class="reviewer-notes reviewer-notes-readonly"
                    :value="getApprovalNotes(selectedApproval)"
                    :placeholder="hasApprovalNotes(selectedApproval) ? '' : 'No reviewer notes available.'"
                    readonly
                    disabled
                    rows="4"
                  ></textarea>
                </div>
              </div>

              <!-- Modal Footer -->
              <div v-if="!isFinalStatus(selectedApproval?.status)" class="modal-footer">
                <button
                  type="button"
                  class="btn-reject"
                  @click="handleReject(selectedApproval?.id)"
                >
                  <i class="ti ti-circle-x"></i> Reject
                </button>
                <button
                  type="button"
                  class="btn-approve"
                  @click="handleApprove(selectedApproval?.id)"
                >
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
import { ref, computed, onMounted, onUnmounted, onBeforeMount } from "vue";
import axios from "axios";

// ============================================================
// STATE MANAGEMENT
// ============================================================

async function fetchApprovals() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/approvals", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    approvals.value = response.data;
    console.log("Approvals:", response.data);
  } catch (error) {
    console.error("Gagal ambil approval:", error);
  }
}

const selectedFilter = ref("all");
const approvals = ref([]);
const isModalOpen = ref(false);
const selectedApproval = ref(null);
const reviewerNotes = ref("");

// ============================================================
// DUMMY DATA
// ============================================================

// Initialize with dummy data

// ============================================================
// FILTER OPTIONS
// ============================================================
const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Approved", value: "approved" },
  { label: "Declined", value: "declined" },
];

// ============================================================
// COMPUTED PROPERTIES
// ============================================================
function normalizeStatus(status = "") {
  const normalized = String(status).trim().toLowerCase();
  return normalized === "rejected" ? "declined" : normalized;
}

function isFinalStatus(status = "") {
  return ["approved", "declined"].includes(normalizeStatus(status));
}

function getApprovalNotes(approval = {}) {
  const candidates = [
    approval?.notes,
    approval?.note,
    approval?.review_notes,
    approval?.reviewer_notes,
    approval?.rejection_notes,
    approval?.declined_notes,
    approval?.review?.notes,
    approval?.approval?.notes,
    approval?.metadata?.notes,
  ];

  const found = candidates.find((value) => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return Boolean(value);
  });

  return typeof found === "string" ? found.trim() : found || "";
}

function hasApprovalNotes(approval = {}) {
  return getApprovalNotes(approval).length > 0;
}

const filteredApprovals = computed(() => {
  if (selectedFilter.value === "all") {
    return approvals.value;
  }

  return approvals.value.filter(
    (item) => normalizeStatus(item.status) === selectedFilter.value,
  );
});

// ============================================================
// FUNCTIONS
// ============================================================

function filterApprovals(status) {
  selectedFilter.value = status;
}

function getStatusIcon(status) {
  const icons = {
    pending: "/icons/status/Pending.png",
    approved: "/icons/status/Approved.png",
    declined: "/icons/status/Declined.png",
    reviewed: "/icons/status/Reviewed.png",
  };

  return icons[normalizeStatus(status)] || "/icons/status/Pending.png";
}

function openModal(approval) {
  selectedApproval.value = approval;
  isModalOpen.value = true;
  reviewerNotes.value = "";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  isModalOpen.value = false;
  selectedApproval.value = null;
  reviewerNotes.value = "";
  document.body.style.overflow = "";
}

function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

function handleKeydown(event) {
  if (event.key === "Escape" && isModalOpen.value) {
    closeModal();
  }
}

async function handleApprove(id) {
  if (!confirm("Apakah Anda yakin ingin menyetujui pengajuan lembur ini?")) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    await axios.post(
      `http://127.0.0.1:8000/api/approvals/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    await fetchApprovals();
    closeModal();
  } catch (error) {
    console.error(error.response?.data || error);
    alert("Gagal approve pengajuan");
  }
}

async function handleReject(id) {
  if (!reviewerNotes.value.trim()) {
    alert("Catatan penolakan wajib diisi");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    await axios.post(
      `http://127.0.0.1:8000/api/approvals/${id}/reject`,
      { notes: reviewerNotes.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    await fetchApprovals();
    closeModal();
  } catch (error) {
    console.log("ERROR REJECT FULL:", error);
    console.log("RESPONSE:", error.response);
    console.log("DATA:", error.response?.data);

    alert(error.response?.data?.message || "Gagal reject pengajuan");
  }
}

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

// ============================================================
// LIFECYCLE HOOKS
// ============================================================
onBeforeMount(() => {
  fetchApprovals();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

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
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");
@import url("https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css");
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.review-approvals {
  background: #f4f5f7;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ============================================================
   HEADER SECTION
   ============================================================ */

.header-title {
  font-size: 26x;
  font-weight: 700;
  color: #fff;
  font-family: "Plus Jakarta Sans", sans-serif;
  margin: 0 0 2px 0;
}

.header-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  font-family: "Plus Jakarta Sans", sans-serif;
  margin: 0;
}

.stats-section {
  background: linear-gradient(135deg, #1d127d, #397cfa);
  padding: 56.5px 56.5px 56.5px 26px;
}

.stats-grid { 
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-family: "Plus Jakarta Sans";
}


/* ============================================================
   FILTER TABS
   ============================================================ */
.filter-tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  padding: 10px 10px 10px 26px;
}

.filter-pill {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.filter-pill:hover {
  background: rgba(59, 91, 219, 0.1);
}

.filter-pill.active {
  background: #1d127d;
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
  margin: 0px 26px;
}

table {
  width: 100%;
  border-collapse: collapse;
  padding: 24px;
}

thead th {
  font-size: 14px;
  font-weight: 700;
  color: #141515;
  text-transform: uppercase;
  font-family: "Plus Jakarta Sans", sans-serif;
  padding: 14px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
}

thead th:nth-child(1) {
  width: 15%;
}
thead th:nth-child(2) {
  width: 15%;
}
thead th:nth-child(3) {
  width: 10%;
}
thead th:nth-child(4) {
  width: 10%;
}
thead th:nth-child(5) {
  width: 15%;
}
thead th:nth-child(6) {
  width: 5%;
}

tbody td {
  font-size: 13px;
  color: #111;
  font-family: "Inter", sans-serif;
  padding: 14px;
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:hover {
  background: #f9fafb;
}

tbody tr:last-child td {
  border-bottom: none;
}

.status-icon-img {
  height: 18px;
  width: auto;
  display: flex;
  nav-right: auto;
}

.modal-status-img {
  height: 18px;
  width: auto;
  display: block;
  margin-left     : auto;
}

.detail-btn {
  background: #1d127d;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.detail-btn:hover {
  background: #2563eb;
}

.text-center {
  text-align: center;
  color: #6b7280;
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
  background: linear-gradient(135deg, #2d3b8f, #4a5fc1);
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
  font-family: "Plus Jakarta Sans", sans-serif;
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
  font-family: "Plus Jakarta Sans", sans-serif;
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
  font-family: "Inter", sans-serif;
}

.field-value {
  font-size: 13px;
  color: #111;
  font-weight: 500;
  background: #f7f7f8;
  border-radius: 7px;
  padding: 10px 12px;
  min-height: 36px;
  line-height: 1.5;
  font-family: "Inter", sans-serif;
}

.detail-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0;
}

.task-item {
  margin-bottom: 12px;
}

.task-title {
  font-size: 12px;
  font-weight: 700;
  color: #1d127d;
  font-family: "Plus Jakarta Sans", sans-serif;
  text-transform: uppercase;
  margin: 0 0 6px 0;
}

.task-description {
  font-size: 13px;
  color: #111;
  line-height: 1.6;
  font-family: "Inter", sans-serif;
  margin: 0;
}

.task-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 12px 0;
}

.reviewer-notes {
  width: 100%;
  min-height: 80px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.15s;
}

.reviewer-notes:focus {
  outline: none;
  border-color: #3b82f6;
}

.reviewer-notes-readonly {
  background: #f3f4f6;
  color: #111;
  cursor: not-allowed;
}

.reviewer-notes-readonly:disabled {
  opacity: 1;
  -webkit-text-fill-color: #111;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
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
  font-family: "Plus Jakarta Sans", sans-serif;
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
  background: #dc2626;
  color: #fff;
}

.btn-approve {
  background: #16a34a;
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
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
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
