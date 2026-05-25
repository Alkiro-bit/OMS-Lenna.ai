<template>
  <div class="pagination-container">

    <div class="pagination-info">
      Showing {{ startItem }} - {{ endItem }} of {{ totalRows }}
    </div>

    <div class="pagination-wrapper">

      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      > < Previous </button>

      <button
        v-for="page in totalPages"
        :key="page"
        class="pagination-number"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next >
      </button>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: Number,
  perPage: Number,
  totalRows: Number,
});

const emit = defineEmits(["page-changed"]);

const totalPages = computed(() => {
  return Math.ceil(props.totalRows / props.perPage);
});

const startItem = computed(() => {
  if (props.totalRows === 0) return 0;

  return (props.currentPage - 1) * props.perPage + 1;
});

const endItem = computed(() => {
  return Math.min(
    props.currentPage * props.perPage,
    props.totalRows
  );
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;

  emit("page-changed", page);
};
</script>

<style scoped>
.pagination-container {
  margin-top: auto;


  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: "Plus Jakarta Sans";

}

.pagination-info {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
  margin-right: 16px;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn,
.pagination-number {
  min-width: 38px;
  height: 38px;

  padding: 0 14px;

  border: none;
  border-radius: 10px;

  background: #FFFFFF;
  color: #111827;

  font-size: 14px;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.2s ease;
  font-family: "Plus Jakarta Sans";
}

.pagination-btn:hover,
.pagination-number:hover {
  background: #F3F4F6;
}

.pagination-number.active {
  background: linear-gradient(135deg, #1d127d, #397cfa);
  color: #FFFFFF;
}

.pagination-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination-btn:disabled:hover {
  background: #FFFFFF;
}
</style>