<template>
  <div class="page-body">
    <!-- SUCCESS MESSAGE (muncul setelah submit berhasil) -->
    <Transition name="alert-slide">
      <div v-if="showSuccessAlert" class="success-alert">
        <i class="fa-solid fa-circle-check"></i>
        <span
          >Pengajuan lembur berhasil dikirim! Status:
          <strong>Pending Approval</strong></span
        >
        <button class="alert-close" @click="showSuccessAlert = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </Transition>

    <!-- FORM CARD -->
    <div class="form-card">
      <!-- HEADER -->
      <div class="form-header">
        <h1 class="form-title">FORM PENGAJUAN LEMBUR</h1>
      </div>

      <!-- FORM BODY -->
      <div class="form-body">
        <form @submit.prevent="handleSubmit">
          <!-- Nama & Tim (read-only) -->
          <div class="form-group full">
            <label class="form-label">Nama & Tim</label>
            <input
              type="text"
              class="form-input"
              :value="`${account.name} - ${account.position}`"
              readonly
            />
          </div>

          <!-- Tanggal & Durasi (2 kolom) -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">Tanggal</label>
              <input
                type="date"
                class="form-input"
                v-model="formData.tanggal"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Durasi</label>
              <input
                type="text"
                class="form-input"
                :value="calculatedDuration"
                readonly
                placeholder="Auto calculate"
              />
            </div>
          </div>

          <!-- Jam Mulai & Jam Selesai (2 kolom) -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">Jam Mulai</label>
              <input
                type="time"
                class="form-input"
                v-model="formData.jamMulai"
                @change="validateTime"
                required
              />
              <span v-if="timeError" class="form-error">{{ timeError }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">Jam Selesai</label>
              <input
                type="time"
                class="form-input"
                v-model="formData.jamSelesai"
                @change="validateTime"
                required
              />
            </div>
          </div>

          <!-- PIC / Project Manager -->
          <div class="form-group full">
            <label class="form-label required">PIC / Project Manager</label>
            <select class="form-select" v-model="formData.pic" required>
              <option value="" disabled>Pilih Project Manager</option>
              <option v-for="pm in pmList" :key="pm.id" :value="pm.id">
                {{ pm.name }}
              </option>
            </select>
          </div>

          <!-- TASK LIST (dynamic) -->
          <div class="task-section">
            <div
              v-for="(task, index) in formData.tasks"
              :key="task.id"
              class="task-item"
            >
              <div class="task-header">
                <span class="task-number">Task {{ index + 1 }}</span>
                <button
                  v-if="formData.tasks.length > 1"
                  type="button"
                  class="btn-remove-task"
                  @click="removeTask(index)"
                  title="Hapus task"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>

              <div class="form-group full">
                <label class="form-label required">Task</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="task.name"
                  placeholder="Contoh: Debugging, Deployment, Testing"
                  required
                />
              </div>

              <div class="form-group full">
                <label class="form-label required">Deskripsi</label>
                <textarea
                  class="form-textarea"
                  v-model="task.description"
                  rows="4"
                  placeholder="Jelaskan detail pekerjaan yang akan dilakukan..."
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <!-- FORM FOOTER BUTTONS -->
          <div class="form-footer">
            <button
              type="button"
              class="btn-add-task"
              @click="addTask"
              title="Tambah task baru"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
            <button
              type="submit"
              class="btn-submit"
              :disabled="!isFormValid"
              :class="{ 'btn-disabled': !isFormValid }"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="showDeleteModal"
        class="delete-overlay"
        @click="closeDeleteModal"
      >
        <Transition name="modal-slide">
          <div v-if="showDeleteModal" class="delete-modal" @click.stop>
            <div class="delete-header">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <h3>Hapus Task</h3>
            </div>

            <p class="delete-text">
              Apakah Anda yakin ingin menghapus task ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>

            <div class="delete-actions">
              <button class="btn-cancel" @click="closeDeleteModal">
                Batal
              </button>

              <button class="btn-delete" @click="confirmDeleteTask">
                Hapus
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { pmList } from "../../../store/overtimeStore";
import axios from "axios";

console.log(pmList.value);
const router = useRouter();
const route = useRoute();

// ── SIDEBAR STATE ──────────────────────────────────────────────────────
const sidebarExpanded = ref(false);

// ── USER DATA ──────────────────────────────────────────────────────────
const account = ref({
  name: "",
  position: "",
});
async function fetchUserData() {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("DATA USER:", response.data);

    account.value = {
      name: response.data.data.name || "Unknown User",
      position: response.data.data.position || "No Position",
    };
  } catch (error) {
    console.error("Gagal ambil data user:", error);
  }
}

onMounted(() => {
  fetchUserData();
});

// ── NAVIGATION ─────────────────────────────────────────────────────────
const navItems = ref([
  {
    name: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: "ti ti-layout-dashboard",
  },
  { name: "form", label: "Form", path: "/form", icon: "ti ti-file-text" },
]);

const currentRoute = computed(() => route.path);

// ── FORM DATA ──────────────────────────────────────────────────────────
const formData = ref({
  tanggal: "",
  jamMulai: "",
  jamSelesai: "",
  pic: "",
  tasks: [{ id: Date.now(), name: "", description: "" }],
});

const timeError = ref("");
const showSuccessAlert = ref(false);

// ── TASK MANAGEMENT ────────────────────────────────────────────────────

function addTask() {
  formData.value.tasks.push({
    id: Date.now(),
    name: "",
    description: "",
  });
}

const showDeleteModal = ref(false);
const taskToDelete = ref(null);
function removeTask(index) {
  if (formData.value.tasks.length === 1) {
    alert("Minimal harus ada 1 task.");
    return;
  }

  taskToDelete.value = index;
  showDeleteModal.value = true;
}

function confirmDeleteTask() {
  if (taskToDelete.value !== null) {
    formData.value.tasks.splice(taskToDelete.value, 1);
  }

  closeDeleteModal();
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  taskToDelete.value = null;
}

// ── TIME VALIDATION ────────────────────────────────────────────────────

// Helper untuk menghitung menit absolut (menganggap jam < 12 ada di hari berikutnya)
function getAbsoluteMinutes(h, m) {
  const adjustedH = h < 12 ? h + 24 : h;
  return adjustedH * 60 + m;
}

// Hitung durasi otomatis
const calculatedDuration = computed(() => {
  const { jamMulai, jamSelesai } = formData.value;
  if (!jamMulai || !jamSelesai) return "";

  const [startH, startM] = jamMulai.split(":").map(Number);
  const [endH, endM] = jamSelesai.split(":").map(Number);

  const startAbs = getAbsoluteMinutes(startH, startM);
  const endAbs = getAbsoluteMinutes(endH, endM);

  if (endAbs <= startAbs) return "";

  const durationMinutes = endAbs - startAbs;
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;

  if (hours === 0 && mins === 0) return "";
  return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
});

// Validasi jam minimal 19:00 & durasi minimal 4 jam
function validateTime() {
  timeError.value = "";

  const { jamMulai, jamSelesai } = formData.value;
  if (!jamMulai || !jamSelesai) return;

  const [startHour, startMin] = jamMulai.split(":").map(Number);
  const [endHour, endMin] = jamSelesai.split(":").map(Number);

  const startAbs = getAbsoluteMinutes(startHour, startMin);
  const endAbs = getAbsoluteMinutes(endHour, endMin);

  // Waktu buka lembur: 19:00 (1140 min) s/d 08:30 esok hari (32.5 * 60 = 1950 min)
  const minAllowed = 19 * 60;
  const maxAllowed = 24 * 60 + 8 * 60 + 30;

  if (
    startAbs < minAllowed ||
    startAbs > maxAllowed ||
    endAbs < minAllowed ||
    endAbs > maxAllowed
  ) {
    timeError.value = "Waktu lembur hanya diperbolehkan antara 19:00 s.d 08:30";
    return;
  }

  if (endAbs <= startAbs) {
    timeError.value = "Jam selesai harus lebih besar dari jam mulai";
    return;
  }

  const durationMinutes = endAbs - startAbs;
  const hours = durationMinutes / 60;

  if (hours < 4) {
    timeError.value = "Durasi lembur minimal 4 jam";
    return;
  }
}

const isFormValid = computed(() => {
  const data = formData.value;
  // 1. Cek semua input telah terisi
  if (!data.tanggal || !data.jamMulai || !data.jamSelesai || !data.pic)
    return false;

  // 2. Cek semua subtask terisi
  const hasEmptyTasks = data.tasks.some(
    (t) => !t.name.trim() || !t.description.trim(),
  );
  if (hasEmptyTasks) return false;

  // 3. Cek validasi jam sesuai aturan OMS (19:00 - 08:30) & Minimal 4 jam
  const [startHour, startMin] = data.jamMulai.split(":").map(Number);
  const [endHour, endMin] = data.jamSelesai.split(":").map(Number);
  const startAbs = getAbsoluteMinutes(startHour, startMin);
  const endAbs = getAbsoluteMinutes(endHour, endMin);

  const minAllowed = 19 * 60;
  const maxAllowed = 24 * 60 + 8 * 60 + 30;

  if (
    startAbs < minAllowed ||
    startAbs > maxAllowed ||
    endAbs < minAllowed ||
    endAbs > maxAllowed
  )
    return false;
  if (endAbs <= startAbs) return false;
  if ((endAbs - startAbs) / 60 < 4) return false;

  return true;
});

// ── FORM SUBMIT ────────────────────────────────────────────────────────

async function handleSubmit() {
  validateTime();

  if (timeError.value) {
    alert(timeError.value);
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired, login ulang");
    return;
  }

  const payload = {
    date: formData.value.tanggal,
    start_time: formData.value.jamMulai,
    end_time: formData.value.jamSelesai,
    product_manager_id: Number(formData.value.pic),
    tasks: formData.value.tasks.map((task) => ({
      name: task.name,
      description: task.description,
    })),
  };

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/form",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    console.log("Submit success:", response.data);

    showSuccessAlert.value = true;
    resetForm();

    setTimeout(() => {
      showSuccessAlert.value = false;
      router.push("/dashboard");
    }, 1500);
  } catch (error) {
    console.error(error.response?.data || error);
    alert(error.response?.data?.message || "Submit gagal");
  }
}

function resetForm() {
  formData.value = {
    tanggal: "",
    jamMulai: "",
    jamSelesai: "",
    pic: "",
    tasks: [{ id: Date.now(), name: "", description: "" }],
  };
  timeError.value = "";
}

// ── HELPERS ────────────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return "";
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function handleLogout() {
  router.push("/login");
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
/* ── PAGE BODY ──────────────────────────────────────────────────────── */
.page-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #1d127d, #397cfa);
}

/* ── SUCCESS ALERT ──────────────────────────────────────────────────── */
.success-alert {
  width: 100%;
  max-width: 720px;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  border: 1.5px solid #66bb6a;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1b5e20;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
}
.success-alert i:first-child {
  font-size: 20px;
  flex-shrink: 0;
}
.alert-close {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #1b5e20;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s;
}
.alert-close:hover {
  background: rgba(27, 94, 32, 0.1);
}

.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.3s ease;
}
.alert-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ── FORM CARD ──────────────────────────────────────────────────────── */
.form-card {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 720px;
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.25);
  overflow: hidden;
}

.form-header {
  background: linear-gradient(90deg, #1d127d, #397cfa);
  padding: 16px 24px;
  text-align: center;
  margin: 20px 24px 0 24px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(29, 18, 125, 0.25);
}
.form-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  font-family: "Plus Jakarta Sans", sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
}

.form-body {
  padding: 28px 24px 24px;
}

/* ── FORM ELEMENTS ──────────────────────────────────────────────────── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.form-group.full {
  grid-column: 1 / -1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 0;
}

.form-label {
  font-size: 11px;
  color: #0d0d0d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}
.form-label.required::after {
  content: " *";
  color: #e57373;
}

.form-input,
.form-select {
  width: 100%;
  height: 42px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  color: #595757;
  font-family: "Inter", sans-serif;
  background: #fff;
  transition: border-color 0.15s;
}
.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #397cfa;
}
.form-input:read-only {
  background: #f7f7f8;
  color: #666;
  cursor: not-allowed;
}

.form-select {
  cursor: pointer;
  background-image: none;
  padding-right: 16px;
  appearance: auto;
}

.form-textarea {
  width: 100%;
  min-height: 100px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #111;
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.15s;
}
.form-textarea:focus {
  outline: none;
  border-color: #397cfa;
}

.form-error {
  font-size: 11px;
  color: #e57373;
  font-weight: 500;
  margin-top: -2px;
}

/* ── TASK SECTION ───────────────────────────────────────────────────── */
.task-section {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.task-number {
  font-size: 12px;
  font-weight: 600;
  color: #1d127d;
  font-family: "Plus Jakarta Sans", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-remove-task {
  background: transparent;
  border: none;
  color: #e57373;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s;
}
.btn-remove-task:hover {
  background: rgba(229, 115, 115, 0.1);
}

/* ── FORM FOOTER ────────────────────────────────────────────────────── */
.form-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-add-task {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  transition:
    background 0.15s,
    transform 0.1s;
}
.btn-add-task:hover {
  background: #2563eb;
  transform: scale(1.05);
}
.btn-add-task:active {
  transform: scale(0.98);
}

.btn-submit {
  padding: 0 32px;
  height: 48px;
  border-radius: 10px;
  background: #4caf50;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-family: "Plus Jakarta Sans", sans-serif;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  transition:
    background 0.15s,
    transform 0.1s;
}
.btn-submit:hover {
  background: #43a047;
  transform: translateY(-1px);
}
.btn-submit:active {
  transform: translateY(0);
}
.btn-submit.btn-disabled {
  background: #bbbbbb;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
.btn-submit.btn-disabled:hover {
  background: #bbbbbb;
  transform: none;
}

.delete-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.delete-modal {
  width: 400px;
  max-width: 92%;
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.delete-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.delete-header i {
  font-size: 22px;
  color: #ffaa00;
}

.delete-header h3 {
  margin: 0;
  font-size: 18px;
  color: #de1c1c;
  font-weight: 700;
  font-family: Poppins;
}

.delete-text {
  font-size: 14px;
  color: #161515;
  line-height: 1.6;
  margin-bottom: 24px;
  font-family: Poppins;
}

.delete-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel,
.btn-delete {
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #f1f3f5;
  color: #555;
  font-family: Poppins;
}

.btn-delete {
  background: #e57373;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
  font-family: Poppins;
}
</style>
