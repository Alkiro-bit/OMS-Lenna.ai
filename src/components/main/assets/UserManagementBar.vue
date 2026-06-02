<template>
  <div class="table-filter">
    <div class="item-filter">

      <!-- SEARCH -->
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

      <!-- ACTION BUTTON -->
      <button
        class="add-user-btn"
        @click="emit('add-user')"
      >
        <i class="ti ti-plus"></i>
        Add User
      </button>

    </div>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: "",
  },

  placeholder: {
    type: String,
    default: "Search user...",
  },
})

const emit = defineEmits([
  "update:search",
  "add-user",
])
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css");

.table-filter {
  font: 14px "Plus Jakarta Sans", sans-serif;
  background: #fff;

  padding: 20px 22px;

  border-radius: 12px;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  margin-bottom: 24px;

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
}

.searchbar {
  width: 600px;

  height: 42px;

  padding: 8px 16px 8px 38px;

  border-radius: 8px;

  border: 1px solid #d1d5db;

  font: 14px "Plus Jakarta Sans", sans-serif;

  transition: border-color 0.15s;
}

.searchbar:focus {
  outline: none;

  border-color: #2563eb;
}

.search-icon {
  position: absolute;

  left: 14px;

  width: 16px;
  height: 16px;

  object-fit: contain;

  opacity: 0.6;

  pointer-events: none;
}

.add-user-btn {
  height: 42px;

  padding: 0 18px;

  border: none;

  border-radius: 8px;

  background: #1d127d;

  color: #fff;

  font-size: 13px;
  font-weight: 600;

  font-family: "Plus Jakarta Sans", sans-serif;

  display: flex;
  align-items: center;
  gap: 6px;

  cursor: pointer;

  transition:
    background 0.15s,
    transform 0.15s;
}

.add-user-btn:hover {
  background: #2563eb;
}

.add-user-btn:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .item-filter {
    flex-direction: column;

    align-items: stretch;
  }

  .add-user-btn {
    width: 100%;

    justify-content: center;
  }
}
</style>