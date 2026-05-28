<template>
  <div class="dashboard-page">
    <section class="stats-section">
      <div class="stats-grid">
        <div v-for="card in statsCards" :key="card.key" class="stat-card">
          <p class="stat-number">{{ card.value }}</p>
          <p class="stat-label">{{ card.label }}</p>
          <p class="stat-period">All Time</p>
        </div>
      </div>
    </section>

    <div class="table-header">
      <div class="overtime-bar">My Overtime</div>

      <SearchFilter 
        v-model:search="searchQuery" 
        v-model:dateSort="selectedDateSort"
        v-model:durationSort="selectedDurationSort"
        v-model:statusFilter="selectedStatusSort"
        :status-options="statusFilterOptions"
      />
    
    </div>

    <div class="anjay">
      <div class="overtime-table-card">
        <div class="overtime-table-wrap">
          <table>
            <thead>
              <tr>
                <th v-if="userRole === 'product_manager'">Name</th>
                <th>Form Title</th>
                <th v-if="userRole === 'employee'">PIC</th>
                <th>Overtime date</th>
                <th>Submit date</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in paginatedData"
                :key="row.id || i"
                class="table-row-clickable"
                @click="openDetailModal(row)"
                tabindex="0"
                @keydown.enter="openDetailModal(row)"
              >
                <td v-if="userRole === 'product_manager'">
                  {{ row.user_name || "Karyawan" }}
                </td>
                <td><span v-html="row.overtime_title"></span></td>
                <td v-if="userRole === 'employee'">
                  {{ row.pm_name || "Karyawan" }}
                </td>
                <td>{{ formatDate(row.date) }}</td>
                <td>{{ formatDateTime(row.created_at) }}</td>
                <td>{{ row.duration }} Hours</td>
                <td>
                  <img
                    :src="getStatusIconPath(row.status)"
                    :alt="row.status"
                    class="status-icon-img"
                  />
                </td>
              </tr>

              <tr v-if="dashboardData.overtime.length === 0">
                <td colspan="6" class="text-center">No overtime requests.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="overtime-table-footer">
          <div class="footer-pagination">
            <Pagination
              :currentPage="currentPage"
              :perPage="perPage"
              :totalRows="filteredData.length"
              @page-changed="onPageChange"
            />
          </div>
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
                <p class="detail-title">OVERTIME SUBMISSION DETAILS</p>
                <img
                  :src="getStatusIconPath(selectedOvertime.status)"
                  :alt="selectedOvertime.status"
                  class="modal-status-img"
                />
              </div>

              <div class="detail-body">
                <div class="detail-section">
                  <p class="section-label">
                    <i class="fa-solid fa-user"></i> Submitter Information
                  </p>
                  <div class="field-grid">
                    <div class="field-group">
                      <span class="field-label">Name</span>
                      <span class="field-value">{{
                        selectedOvertime.user_name
                      }}</span>
                    </div>
                    <div class="field-group">
                      <span class="field-label">Position</span>
                      <span class="field-value">{{
                        selectedOvertime.position
                      }}</span>
                    </div>
                    <div class="field-group full">
                      <span class="field-label">PIC</span>
                      <span class="field-value">{{
                        selectedOvertime.pm_name || "-"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <div class="detail-section">
                  <p class="section-label">
                    <i class="fa-solid fa-clock"></i> overtime Information
                  </p>
                  <div class="field-grid">
                    <div class="field-group full">
                      <span class="field-label">Form Title</span>
                      <span class="field-value">{{
                        selectedOvertime.overtime_title
                      }}</span>
                      <!-- INI MAS JANGAN SAMPE LUPAAA-->
                    </div>

                    <div class="field-group">
                      <span class="field-label">Date</span>
                      <span class="field-value">{{
                        formatDate(selectedOvertime.date)
                      }}</span>
                    </div>
                    <div class="field-group">
                      <span class="field-label">Start Time</span>
                      <span class="field-value"
                        >{{ selectedOvertime.start_time || "" }} WIB</span
                      >
                    </div>
                    <div class="field-group">
                      <span class="field-label">End Time</span>
                      <span class="field-value"
                        >{{ selectedOvertime.end_time || "" }} WIB</span
                      >
                    </div>
                    <div class="field-group">
                      <span class="field-label">Duration</span>
                      <span class="field-value"
                        >{{ selectedOvertime.duration }} Jam</span
                      >
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <div class="detail-section">
                  <p class="section-label">
                    <i class="fa-solid fa-align-left"></i> Task Details
                  </p>
                  <!-- Format iterasi jika ada subtasks -->
                  <div
                    class="field-grid"
                    v-if="
                    Array.isArray(selectedOvertime.detail_task) &&
                    selectedOvertime.detail_task.length > 0
                  "
                  >
                    <div
                      class="field-group full"
                      v-for="(subtask, idx) in selectedOvertime.detail_task"
                      :key="idx"
                    >
                      <span
                        class="field-label"
                        style="color: #1d127d; font-weight: 700"
                        >Task {{ idx + 1 }}: {{ subtask.task_title }}</span
                      >
                      <span class="field-value field-desc">{{
                        subtask.task_description
                      }}</span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="shouldShowReviewerNotes(selectedOvertime)"
                  class="detail-section"
                >
                  <p class="section-label">
                    <i class="fa-solid fa-note-sticky"></i> Reviewer Notes
                  </p>
                  <div class="field-grid">
                    <div class="field-group full">
                      <span class="field-label">Notes</span>
                      <textarea
                        class="notes-textarea"
                        :value="getReviewerNotes(selectedOvertime)"
                        :placeholder="
                          getReviewerNotes(selectedOvertime)
                            ? ''
                            : 'No reviewer notes available.'
                        "
                        rows="4"
                        readonly
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="detail-footer">

                <button 
                    v-if="selectedOvertime.status?.toLowerCase() === 'declined'"
                    class="btn-edit-modal" 
                    @click="handleEdit(selectedOvertime)">
                  <i class="fa-solid fa-pen"></i> Edit
                </button>

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
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeMount,
  onUnmounted,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Pagination from "../assets/Pagination.vue";
import SearchFilter from "../assets/SearchFilter.vue";
// import { useOvertime } from "@/store/useOvertime.js";

const router = useRouter();
const userRole = ref(window.localStorage.getItem("role"));

const props = defineProps({
  account: {
    type: Object,
    required: true,
    default: () => ({ name: "John Doe", position: "Engineer ~ Fullstack" }),
  },
});

// const data = useOvertime(); 


const dashboardData = reactive({
  summary: {
    totalHours: 0,
    totalSubmission: 0,
    totalApproved: 0,
    totalPending: 0,
    totalDeclined: 0,
  },
  overtime: [],
});

// STATS CARD SUMMARIES (Logic Perhitungan Stats Card).
const statsCards = computed(() => {
  return [
    {
      key: "totalJam",
      value: dashboardData.summary.totalHours,
      label: "Overtime Hours",
    },
    {
      key: "pengajuan",
      value: dashboardData.summary.totalSubmission,
      label: "Overtime Submission",
    },
    {
      key: "approved",
      value: dashboardData.summary.totalApproved,
      label: "Overtime Approved",
    },
    {
      key: "pending",
      value: dashboardData.summary.totalPending,
      label: "Overtime Pending",
    },
    {
      key: "declined",
      value: dashboardData.summary.totalDeclined,
      label: "Overtime Declined",
    },
  ];
});

//SearchFilter.vue states 

const searchQuery = ref("")
const selectedDateSort = ref("")
const selectedStatusSort = ref("")
const selectedDurationSort = ref("")

const filters = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Declined", value: "declined" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
]

const statusFilterOptions = filters.filter(
  (filter) => filter.value !== "all"
)

const filteredData = computed(() => {
  let data = [...dashboardData.overtime]

  if (searchQuery.value) {
    data = data.filter(item =>
      (
        item.pm_name +
        " " +
        item.overtime_title
      )
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedStatusSort.value) {
    data = data.filter(item =>
      normalizeStatus(item.status) === selectedStatusSort.value
    )
  }

  // SORT DATE
  if (selectedDateSort.value === "newest") {
    data.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  if (selectedDateSort.value === "oldest") {
    data.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  // SORT DURATION
  if (selectedDurationSort.value === "highest") {
    data.sort((a, b) => b.duration - a.duration)
  }

  if (selectedDurationSort.value === "lowest") {
    data.sort((a, b) => a.duration - b.duration)
  }

  return data
})

watch(
  [
    searchQuery,
    selectedDateSort,
    selectedDurationSort,
    selectedStatusSort,
  ],
  () => {
    currentPage.value = 1
  },
)

// Modal state
const isDetailModalOpen = ref(false);
const selectedOvertime = ref({});


const openDetailModal = (rowData) => {
  selectedOvertime.value = rowData;
  isDetailModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  selectedOvertime.value = {};
  document.body.style.overflow = "";
};


const handleEdit = (rowData) => {
  closeDetailModal();

  router.push(`/form/${rowData.id}`);
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeDetailModal();
  }
};

const handleKeydown = (event) => {
  if (event.key === "Escape" && isDetailModalOpen.value) {
    closeDetailModal();
  }
};

const isFirstLogin = ref(false);

const fetchDashboardData = async () => {
  const token = window.localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/dashboard", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    dashboardData.summary = response.data.summary;
    dashboardData.overtime = response.data.overtime.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    console.log("TESTT", dashboardData.overtime);
  } catch (err) {
    console.error(err);
  }
};

onBeforeMount(() => {
  fetchDashboardData();
});

onMounted(() => {
  isFirstLogin.value = localStorage.getItem("isFirstLogin") === "true";
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Utilities
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

function normalizeStatus(status = "") {
  const normalized = String(status).trim().toLowerCase();
  return normalized === "rejected" ? "declined" : normalized;
}

function getReviewerNotes(entry = {}) {
  const candidates = [entry?.human_resource_notes];

  const found = candidates.find((value) => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return Boolean(value);
  });

  return typeof found === "string" ? found.trim() : found || "";
}

function shouldShowReviewerNotes(entry = {}) {
  return (
    normalizeStatus(entry?.status) === "declined" ||
    getReviewerNotes(entry).length > 0
  );
}

function getStatusIcon(status) {
  const icons = {
    Pending: "/icons/status/Pending.png",
    Approved: "/icons/status/Approved.png",
    Rejected: "/icons/status/Declined.png",
    Reviewed: "/icons/status/Reviewed.png",
  };

  return icons[status] || "/icons/status/Pending.png";
}

function formatDateTime(date) {
  if (!date) return "-";

  const d = new Date(date);

  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2);

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function getStatusIconPath(status) {
  if (!status) return "";
  const statusMap = {
    pending: "Pending",
    approved: "Approved",
    declined: "Declined",
    reviewed: "Reviewed",
    Pending: "Pending",
    Approved: "Approved",
    Declined: "Declined",
    Reviewed: "Reviewed",
  };
  const normalizedStatus = statusMap[status] || status;
  return `/icons/status/${normalizedStatus}.png`;
}

// pagination
const currentPage = ref(1);
const perPage = ref(10);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value

  return filteredData.value.slice(start, end)
})

const onPageChange = (page) => {
  currentPage.value = page;
};

const colSpanValue = computed(() => {
  return userRole.value === "product_manager" ? 6 : 5;
});
</script>

<style scoped>
/* ============================================================
   STYLE KHUSUS DASHBOARD PAGE
   ============================================================ */
.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 4px;
}

.table-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 20px 0 20px;
  flex: 1;
}

.anjay {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
  flex: 1;
}

.stats-section {
  background: linear-gradient(135deg, #1d127d, #397cfa);
  padding: 30px;
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
  font-family: "Plus Jakarta Sans", sans-serif;
}

.stat-label {
  font-size: 13px;
  color: #444;
  font-weight: 500;
  margin: 0 0 0 0;
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
  background: linear-gradient(90deg, #1d127d, #397cfa);
  padding: 11px 20px;
  text-align: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  border-radius: 10px;
  user-select: none;
  font-family: "Plus Jakarta Sans", sans-serif;
  flex-shrink: 0;
}

/* ============================================================
   TABLE
   ============================================================ */
.overtime-table-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 750px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
}

.overtime-table-wrap {
  flex: 1 1 auto;
  display: block;
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  font-size: 14px;
  font-weight: 666;
  color: #000000;
  text-transform: uppercase;
  font-family: "Plus Jakarta Sans", sans-serif;
  padding: 14px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
}

thead th:nth-child(1) {
  width: 20%;
}
thead th:nth-child(2) {
  width: 20%;
}
thead th:nth-child(3) {
  width: 15%;
}
thead th:nth-child(4) {
  width: 15%;
}
thead th:nth-child(5) {
  width: 15%;
}
thead th:nth-child(6) {
  width: 15%;
}

tbody td {
  font-size: 13px;
  color: #111;
  font-family: "Inter", sans-serif;
  padding: 0 14px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

tbody tr {
  height: 60px;
}

.table-row-clickable {
  cursor: pointer;
}

.table-row-clickable:hover {
  background: #f9fafb;
}

.table-row-clickable:focus {
  outline: 2px solid #397cfa;
  outline-offset: -2px;
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

.text-center {
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.overtime-table-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.footer-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

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
  background: linear-gradient(90deg, #1d127d, #397cfa);
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
  font-family: "Plus Jakarta Sans", sans-serif;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin: 0;
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
  font-family: "Plus Jakarta Sans", sans-serif;
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
  font-family: "Inter", sans-serif;
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
  font-family: "Inter", sans-serif;
}

.field-desc {
  min-height: 76px;
  font-size: 12px;
  line-height: 1.65;
  font-weight: 400;
  white-space: pre-wrap;
}

.notes-textarea {
  width: 100%;
  min-height: 110px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.6;
  font-family: "Inter", sans-serif;
  background: #f3f4f6;
  color: #111;
  resize: none;
}

.notes-textarea:disabled {
  opacity: 1;
  cursor: not-allowed;
  -webkit-text-fill-color: #111;
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
  background: #1d127d;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  font-family: "Plus Jakarta Sans", sans-serif;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
  margin-left: 10px;
}

.btn-edit-modal {
  padding: 0 24px;
  height: 36px;
  border-radius: 8px;
  background: #FFC300;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  font-family: "Plus Jakarta Sans", sans-serif;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
  margin-left: 10px;
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
</style>
