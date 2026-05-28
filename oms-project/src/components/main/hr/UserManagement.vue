<template>
  <div class="user-management">
    <section class="hero-section">
      <div class="hero-grid">
        <h1 class="header-title">User Management</h1>
        <p class="header-subtitle">View, create, and update user accounts and their hierarchical roles</p>
      </div>
    </section>

    <!-- TABLE -->
    <div class="anjay">
      
      <UserManagementBar
        @add-user="openCreateModal"
        v-model:search="searchQuery"
        :status-options="statusFilterOptions"
      />

      <div class="table-container">

        <div class="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="table-row"
              >

                <td>{{ user.name }}</td>

                <td>{{ user.position }}</td>

                <td>{{ user.role }}</td>

                <td>
                  <img
                    :src="getStatusIcon(user.status)"
                    :alt="user.status"
                    class="status-icon-img"
                  />
                </td>

                <td>
                  <button
                    class="detail-btn"
                    @click="openModal(user)"
                  >
                    Edit User
                  </button>
                </td>

              </tr>

              <tr v-if="filteredUsers.length === 0">
                <td colspan="4" class="text-center-status">
                  No users found.
                </td>
              </tr>

            </tbody>
          </table>

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

                    <!-- HEADER -->
                    <div class="modal-header">

                      <p class="modal-title">
                        {{ selectedUser?.id ? "EDIT USER" : "CREATE USER" }}
                      </p>

                      <button
                        class="close-btn"
                        @click="closeModal"
                      >
                        <i class="ti ti-x"></i>
                      </button>

                    </div>

                    <!-- BODY -->
                    <div class="modal-body">

                      <div class="field-grid">

                        <!-- NAME -->
                        <div class="field-group">

                          <p class="section-label"> User Information </p>
                            <span class="field-label">Name</span>
                              <input
                                type="text"
                                class="input-field"
                                v-model="selectedUser.name"
                                placeholder="Enter full name"
                              />

                      

                        <!-- EMAIL -->
                        <div class="field-group">
                          <span class="field-label">Email</span>

                          <input
                            type="email"
                            class="input-field"
                            v-model="selectedUser.email"
                            placeholder="Enter email address"
                          />
                        </div>

                        <!-- PASSWORD -->
                        <div class="field-group">
                          <span class="field-label">Password</span>

                          <input
                            type="password"
                            class="input-field"
                            v-model="selectedUser.password"
                            placeholder="Enter user password"
                          />
                        </div>

                        <!-- POSITION -->
                        <div class="field-group">
                          <span class="field-label">Position</span>

                          <input
                            type="text"
                            class="input-field"
                            v-model="selectedUser.position"
                          />
                        </div>

                        <!-- ROLE -->
                        <div class="field-group">
                          <span class="field-label">Role</span>

                          <select
                            class="input-field"
                            v-model="selectedUser.role"
                          >
                            <option value="employee">
                              Employee
                            </option>

                            <option value="pm">
                              PM
                            </option>

                            <option value="hr">
                              HR
                            </option>
                          </select>
                        </div>

                        <!-- STATUS -->
                        <div class="field-group">
                          <span class="field-label">Status</span>

                          <select
                            class="input-field"
                            v-model="selectedUser.status"
                          >
                            <option value="active">
                              Active
                            </option>

                            <option value="inactive">
                              Inactive
                            </option>
                          </select>
                        </div>
                        </div> 

                        <div class="modal-footer">

                          <button
                            type="button"
                            class="btn-confirm"
                            @click="handleConfirmEdit"
                          >
                            <i class="ti ti-check"></i>
                            {{  selectedUser?.id ? "Save Changes" : "Create User" }}
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </Transition>

              </div>

            </Transition>

          </Teleport>

        </div>

        <!-- PAGINATION -->
        <div>
          <div class="overtime-table-footer">
            <div class="footer-pagination fill">

              <Pagination
                :currentPage="currentPage"
                :perPage="perPage"
                :totalRows="filteredUsers.length"
                @page-changed="onPageChange"
              />
            
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import Pagination from "../assets/Pagination.vue"
import UserManagementBar from "../assets/UserManagementBar.vue"
import axios from "axios"

const searchQuery = ref("")
const users = ref([])

async function fetchUsers() {

  try {

    const token = localStorage.getItem("token")

    const response = await axios.get(
      "http://127.0.0.1:8000/api/hr/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    users.value = response.data

    console.log("USERS :", response.data)

  } catch (error) {

    console.error(error)

  }
}

onMounted(() => {
  fetchUsers()
})

const filteredUsers = computed(() => {
  const search = searchQuery.value.toLowerCase()

  return users.value.filter((user) =>
    user.name.toLowerCase().includes(search)
  )
})

const currentPage = ref(1)

const perPage = ref(10)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value

  const end = start + perPage.value

  return filteredUsers.value.slice(start, end)
})

function onPageChange(page) {
  currentPage.value = page
}

// ======================= MODAL STATE ====================

const isModalOpen = ref(false)
const selectedUser = ref({
  id: null,
  name: "",
  email: "",
  password: "",
  position: "",
  role: "employee",
  status: "active",
})

function openModal(user) {
  selectedUser.value = { ...user }

  isModalOpen.value = true

  document.body.style.overflow = "hidden"
}

function openCreateModal() {

  selectedUser.value = {
    id: null,
    name: "",
    email: "",
    password: "",
    position: "",
    role: "employee",
    status: "active",
  }

  isModalOpen.value = true

  document.body.style.overflow = "hidden"
}

async function handleConfirmEdit() {

  try {

    const token = localStorage.getItem("token")

    // ================= CREATE =================
    if (!selectedUser.value.id) {

      await axios.post(
        "http://127.0.0.1:8000/api/hr/users",
        {
          name: selectedUser.value.name,
          email: selectedUser.value.email,
          password: selectedUser.value.password,
          position: selectedUser.value.position,
          role: selectedUser.value.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("USER CREATED")
    }

    // ================= UPDATE =================
    else {

      await axios.put(
        `http://127.0.0.1:8000/api/hr/users/${selectedUser.value.id}`,
        {
          name: selectedUser.value.name,
          email: selectedUser.value.email,
          position: selectedUser.value.position,
          role: selectedUser.value.role,
          status: selectedUser.value.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("USER UPDATED")
    }

    await fetchUsers()

    closeModal()

  } catch (error) {

    console.error(error)

    alert(
      error.response?.data?.message ||
      "Terjadi kesalahan"
    )
  }
}

function closeModal() {
  isModalOpen.value = false

  selectedUser.value = null

  document.body.style.overflow = ""
}

function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function getStatusIcon(status) {
  const icons = {
    active: "/icons/status/Active.png",
    inactive: "/icons/status/Inactive.png",
  }

  return icons[status]
}


</script>

<style scoped>
.user-management {
  background: #f4f5f7;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.anjay {
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin: 0px 20px 20px 20px;
  flex: 1;
}

/*HEADER SECTION*/
.hero-section {
  background: linear-gradient(135deg, #1d127d, #397cfa);
  padding: 56.5px 56.5px 56.5px 26px;
}

.hero-grid {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-family: "Plus Jakarta Sans";
}

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

 /*.====================== TABLE CONTAINER ==================*/ 
.table-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 750px;
  margin-bottom: 50px;

  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1 1 auto;
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
  font-weight: 700;
  color: #141515;
  text-transform: uppercase;
  font-family: "Plus Jakarta Sans", sans-serif;
  padding: 14px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
}

thead th:nth-child(1) { width: 10%;}
thead th:nth-child(2) { width: 10%;}
thead th:nth-child(3) { width: 10%; }
thead th:nth-child(4) { width: 10%; }
thead th:nth-child(5) { width: 5%; }

tbody td {
  font-size: 13px;
  color: #111;
  font-family: "Inter", sans-serif;
  padding: 14px;
}

tbody tr:hover {
  background: #f9fafb;
}

.overtime-table-footer {
  margin-top: auto;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.footer-pagination {
  margin-top: auto;
  /* padding-top: 20px;  */
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.status-icon-img {
  height: 18px;
  width: auto;
  display: flex;
  nav-right: auto;
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

.text-center-status {
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

/* =================================================================
    MODAL
   ================================================================*/ 

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
  font: 14px "Plus Jakarta Sans"; 
}
.field-grid {
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  gap: 10px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-label {
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
}

.detail-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0;
}

.section-label {
  font-size: 10px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-family: "Plus Jakarta Sans", sans-serif;
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.input-field {
  width: 100%;
  height: 42px;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 0 12px;
  font-size: 13px;
  font-family: "Inter", sans-serif;
  background: #f7f7f8;
  transition: border-color 0.15s;
}

.input-field:focus {
  outline: none;
  border-color: #2563eb;
}


.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.btn-confirm {
  height: 42px;
  padding: 0 24px;
  border: none;
  border-radius: 8px;
  background: #1d127d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: "Plus Jakarta Sans", sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-confirm:hover {
  background: #2563eb;
}

.modal-footer {
  padding: 16px 24px;

  border-top: 1px solid #e5e7eb;

  display: flex;

  justify-content: flex-end;
}

.btn-confirm {
  height: 42px;

  padding: 0 24px;

  border: none;

  border-radius: 8px;

  background: #1d127d;

  color: #fff;

  font-size: 13px;

  font-weight: 700;

  font-family: "Plus Jakarta Sans", sans-serif;

  display: flex;

  align-items: center;

  gap: 6px;

  cursor: pointer;

  transition:
    background 0.15s,
    transform 0.15s;
}

.btn-confirm:hover {
  background: #2563eb;
}

.btn-confirm:active {
  transform: scale(0.98);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

</style>
