<template>
  <div class="table-filter">
    <div class="item-filter">
      <div class="searchbar-container">
        <img
          src="/icons/material-symbols_search.png"
          class="search-icon"
          alt=""
        />

        <input
          class="searchbar"
          :value="search"
          @input="emit('update:search', $event.target.value)"
          :placeholder="placeholder"
        />
      </div>

      <div class="filter-wrapper">
        <div class="sort-dropdown">
          <select
            :value="dateSort"
            class="sort-select"
            @change="emit('update:dateSort', $event.target.value)"
          >
            <option value="">Date</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div class="sort-dropdown">
          <select
            :value="durationSort"
            class="sort-select"
            @change="emit('update:durationSort', $event.target.value)"
          >
            <option value="">Duration</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>

        <div class="sort-dropdown">
          <select
            :value="statusFilter"
            class="sort-select"
            @change="emit('update:statusFilter', $event.target.value)"
          >
            <option value="">Status</option>
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: "",
  },
  dateSort: {
    type: String,
    default: "",
  },
  durationSort: {
    type: String,
    default: "",
  },
  statusFilter: {
    type: String,
    default: "",
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Search here...",
  },
});

const emit = defineEmits([
  "update:search",
  "update:dateSort",
  "update:durationSort",
  "update:statusFilter",
]);
</script>

<style scoped>
.table-filter {
  font: 14px "Plus Jakarta Sans", sans-serif;
  background: #fff;
  padding: 20px 22px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 0px;
  margin-top: 10px;
  min-height: 84px;
  display: flex;
  align-items: center;
}

.item-filter {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.searchbar-container {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 520px;
}

.searchbar {
  width: 100%;
  height: 40px;
  padding: 8px 16px 8px 35px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font: 14px "Plus Jakarta Sans", sans-serif;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  object-fit: contain;
  opacity: 0.6;
  pointer-events: none;
}

.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.sort-select {
  height: 40px;
  min-width: 110px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font: 14px "Plus Jakarta Sans", sans-serif;
  background: #fff;
}

@media (max-width: 900px) {
  .item-filter {
    align-items: stretch;
    flex-direction: column;
  }

  .searchbar-container {
    max-width: none;
    width: 100%;
  }

  .filter-wrapper {
    width: 100%;
    margin-left: 0;
    flex-wrap: wrap;
  }
}
</style>
