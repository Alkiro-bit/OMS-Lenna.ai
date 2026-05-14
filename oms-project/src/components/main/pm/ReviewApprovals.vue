<template>
  <div class="review-approvals">
    <div class="header">
      <h2>Review Approvals</h2>
      <p>Approve or decline overtime requests from your team.</p>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(request, index) in pendingRequests" :key="index">
            <td>{{ request.name }}</td>
            <td>{{ request.date }}</td>
            <td>{{ request.duration }} hours</td>
            <td>{{ request.reason }}</td>
            <td><span class="status pending">{{ request.status }}</span></td>
            <td class="actions">
              <button class="approve-btn" @click="approve(request)">Approve</button>
              <button class="decline-btn" @click="decline(request)">Decline</button>
            </td>
          </tr>
          <tr v-if="pendingRequests.length === 0">
            <td colspan="6" class="text-center">No pending overtime requests.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dummy data for now
const pendingRequests = ref([
  { id: 1, name: 'Alice Smith', date: '2026-05-15', duration: 2, reason: 'Project Deadline', status: 'Pending' },
  { id: 2, name: 'Bob Johnson', date: '2026-05-16', duration: 3, reason: 'Server Maintenance', status: 'Pending' }
]);

const approve = (request) => {
  request.status = 'Approved';
  alert(`Approved overtime for ${request.name}`);
};

const decline = (request) => {
  request.status = 'Declined';
  alert(`Declined overtime for ${request.name}`);
};
</script>

<style scoped>
.review-approvals {
  padding: 24px;
  background: #f4f5f7;
  min-height: 100%;
}

.header {
  margin-bottom: 24px;
}

.header h2 {
  font-size: 24px;
  color: #111;
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin-bottom: 8px;
}

.header p {
  color: #666;
}

.table-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #444;
  background-color: #fafafa;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.actions {
  display: flex;
  gap: 8px;
}

.approve-btn, .decline-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.approve-btn {
  background-color: #28a745;
  color: white;
}

.decline-btn {
  background-color: #dc3545;
  color: white;
}

.text-center {
  text-align: center;
}
</style>
