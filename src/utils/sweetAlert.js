import Swal from "sweetalert2";

const baseOptions = {
  background: "#ffffff",
  color: "#0f172a",
  reverseButtons: true,
  buttonsStyling: false,
  customClass: {
    popup: "app-swal-popup",
    title: "app-swal-title",
    htmlContainer: "app-swal-text",
    confirmButton: "app-swal-confirm",
    cancelButton: "app-swal-cancel",
  },
};

const modalSwal = Swal.mixin(baseOptions);

const toastSwal = Swal.mixin({
  ...baseOptions,
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  customClass: {
    ...baseOptions.customClass,
    popup: "app-swal-toast",
    title: "app-swal-toast-title",
  },
});

export function showSuccessAlert(message, options = {}) {
  return modalSwal.fire({
    icon: "success",
    title: options.title || "Berhasil",
    text: message,
    confirmButtonText: options.confirmButtonText || "Oke",
    ...options,
  });
}

export function showErrorAlert(message, options = {}) {
  return modalSwal.fire({
    icon: "error",
    title: options.title || "Terjadi kesalahan",
    text: message,
    confirmButtonText: options.confirmButtonText || "Tutup",
    ...options,
  });
}

export function showWarningAlert(message, options = {}) {
  return modalSwal.fire({
    icon: "warning",
    title: options.title || "Perlu diperhatikan",
    text: message,
    confirmButtonText: options.confirmButtonText || "Mengerti",
    ...options,
  });
}

export function showInfoAlert(message, options = {}) {
  return modalSwal.fire({
    icon: "info",
    title: options.title || "Informasi",
    text: message,
    confirmButtonText: options.confirmButtonText || "Oke",
    ...options,
  });
}

export function showSuccessToast(message, options = {}) {
  return toastSwal.fire({
    icon: "success",
    title: options.title || message,
    text: options.text,
    timer: options.timer || 2200,
    ...options,
  });
}

export async function showConfirmDialog(options = {}) {
  const result = await modalSwal.fire({
    icon: options.icon || "warning",
    title: options.title || "Apakah Anda yakin?",
    text: options.text || "Tindakan ini akan diproses.",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || "Ya, lanjutkan",
    cancelButtonText: options.cancelButtonText || "Batal",
    ...options,
  });

  return result.isConfirmed;
}
