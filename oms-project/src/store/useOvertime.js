import { defineStore } from "pinia";

const defaultValue = { 
    user_name: "",
    overtime_title: "",
    date: "",
    start_time: "",
    end_time: "",
    duration: "",
    pm_name: "",
    detail_task: [],
  }

export const useOvertime = defineStore('overtime', {
  state: () => ({ 
    overtimeData: null,
  }),
  actions: {
    setOvertimeValue(payload) {
      this.overtimeData = { ...payload }
    },
    resetOvertime() {
      this.overtimeData = null
    }
  },
})