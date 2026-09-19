/**
 * PUSAT PENGADUAN MITRA DRIVER SHOPEEFOOD
 * Logika Pengiriman Form & Integrasi Google Apps Script
 */

// ============================================================================
// KONFIGURASI GOOGLE APPS SCRIPT WEB APP URL
// ============================================================================
// Ganti URL di bawah ini dengan URL Deployment Google Apps Script Anda (akhiran /exec)
// Atau gunakan fitur "Atur URL Google Sheet" langsung di tampilan web.
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxP9pmGXuzNnO43sAMxcfkb-MnssRPyZEp_l3iUUpSfwlb606i19cQHg5oLV2vqkYFc/exec";

// Cek jika ada URL yang disimpan di browser (localStorage)
function getActiveScriptUrl() {
  const savedUrl = localStorage.getItem("shopeefood_gas_url");
  if (savedUrl && savedUrl.trim() !== "") {
    return savedUrl.trim();
  }
  return DEFAULT_SCRIPT_URL;
}

// ============================================================================
// INISIALISASI HALAMAN
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initLucideIcons();
  initFormHandler();
  initSettingsModal();
  updateEndpointStatusUI();
  updateLiveTicketPreview();
});

function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Generate Nomor Tiket Pengaduan Unik (SPF-YYYYMMDD-XXXX)
function generateTicketId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SPF-${year}${month}${date}-${randomNum}`;
}

function updateLiveTicketPreview() {
  const previewElem = document.getElementById("ticketPreviewId");
  if (previewElem) {
    previewElem.textContent = generateTicketId();
  }
}

// ============================================================================
// HANDLER FORM PENGADUAN
// ============================================================================
function initFormHandler() {
  const form = document.getElementById("complaintForm");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnSubmitText = document.getElementById("btnSubmitText");
  const submitSpinner = document.getElementById("submitSpinner");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Ambil data dari form
    const ticketId = document.getElementById("ticketPreviewId")?.textContent || generateTicketId();
    const fullName = document.getElementById("fullName").value.trim();
    const driverId = document.getElementById("driverId").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const operationalCity = document.getElementById("operationalCity").value;
    const category = document.getElementById("category").value;
    const orderId = document.getElementById("orderId").value.trim();
    const description = document.getElementById("description").value.trim();
    const attachmentLink = document.getElementById("attachmentLink").value.trim();

    // 2. Validasi Form Frontend
    if (!fullName || !driverId || !phoneNumber || !operationalCity || !category || !description) {
      showToast("Harap lengkapi semua kolom wajib bertanda bintang (*)", "error");
      return;
    }

    if (description.length < 15) {
      showToast("Mohon tuliskan detail kronologi minimal 15 karakter agar mudah ditindaklanjuti.", "warning");
      return;
    }

    // Persiapkan payload
    const payload = {
      ticketId: ticketId,
      fullName: fullName,
      driverId: driverId,
      phoneNumber: phoneNumber,
      operationalCity: operationalCity,
      category: category,
      orderId: orderId || "-",
      description: description,
      attachmentLink: attachmentLink || "-",
      submittedAt: new Date().toISOString()
    };

    const targetUrl = getActiveScriptUrl();
    const isDemoMode = !targetUrl || targetUrl.includes("ISI_DENGAN_URL") || !targetUrl.startsWith("https://script.google.com");

    // 3. UI State: Loading
    setLoadingState(true);

    try {
      if (isDemoMode) {
        // Simulasi pengiriman jika user belum memasukkan URL Google Script
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("[SIMULASI PENGIRIMAN DATA KE GOOGLE SHEET]:", payload);
        openSuccessModal(payload, true);
        form.reset();
        updateLiveTicketPreview();
      } else {
        // Pengiriman Riil ke Google Apps Script Web App
        // Menggunakan mode 'no-cors' dengan payload text/plain untuk bypass proteksi CORS browser
        await fetch(targetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        openSuccessModal(payload, false);
        form.reset();
        updateLiveTicketPreview();
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      showToast("Gagal mengirim pengaduan. Periksa koneksi internet Anda atau coba lagi.", "error");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      btnSubmit.disabled = true;
      btnSubmit.classList.add("opacity-75", "cursor-not-allowed");
      btnSubmitText.textContent = "Mengirim Pengaduan...";
      submitSpinner.classList.remove("hidden");
    } else {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-75", "cursor-not-allowed");
      btnSubmitText.textContent = "Kirim Pengaduan Sekarang";
      submitSpinner.classList.add("hidden");
    }
  }
}

// ============================================================================
// MODAL SUKSES PENGADUAN
// ============================================================================
function openSuccessModal(data, isDemo = false) {
  const modal = document.getElementById("successModal");
  const modalTicketId = document.getElementById("modalTicketId");
  const modalDriverName = document.getElementById("modalDriverName");
  const modalCategory = document.getElementById("modalCategory");
  const demoBanner = document.getElementById("modalDemoBanner");

  if (modalTicketId) modalTicketId.textContent = data.ticketId;
  if (modalDriverName) modalDriverName.textContent = data.fullName;
  if (modalCategory) modalCategory.textContent = data.category;

  if (demoBanner) {
    if (isDemo) {
      demoBanner.classList.remove("hidden");
    } else {
      demoBanner.classList.add("hidden");
    }
  }

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// Salin Nomor Tiket ke Clipboard
function copyTicketNumber() {
  const ticketElem = document.getElementById("modalTicketId");
  if (!ticketElem) return;
  const text = ticketElem.textContent;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Nomor tiket berhasil disalin ke clipboard!", "success");
  }).catch(() => {
    showToast("Gagal menyalin nomor tiket.", "error");
  });
}

// ============================================================================
// MODAL & FITUR ATUR URL GOOGLE SCRIPT
// ============================================================================
function initSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const inputUrl = document.getElementById("gasUrlInput");
  const currentUrl = getActiveScriptUrl();

  if (inputUrl && currentUrl && !currentUrl.includes("ISI_DENGAN_URL")) {
    inputUrl.value = currentUrl;
  }
}

function openSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const inputUrl = document.getElementById("gasUrlInput");
  const currentUrl = getActiveScriptUrl();

  if (inputUrl) {
    inputUrl.value = (!currentUrl.includes("ISI_DENGAN_URL")) ? currentUrl : "";
  }

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function saveGasUrl() {
  const inputUrl = document.getElementById("gasUrlInput");
  const urlVal = inputUrl ? inputUrl.value.trim() : "";

  if (urlVal !== "" && !urlVal.startsWith("https://script.google.com")) {
    showToast("Format URL salah! URL harus diawali dengan https://script.google.com/macros/s/.../exec", "warning");
    return;
  }

  if (urlVal === "") {
    localStorage.removeItem("shopeefood_gas_url");
    showToast("URL dikosongkan. Kembali ke Mode Demo.", "info");
  } else {
    localStorage.setItem("shopeefood_gas_url", urlVal);
    showToast("URL Google Apps Script berhasil disimpan!", "success");
  }

  closeSettingsModal();
  updateEndpointStatusUI();
}

function updateEndpointStatusUI() {
  const statusBadge = document.getElementById("endpointStatusBadge");
  const currentUrl = getActiveScriptUrl();
  const isConnected = currentUrl && !currentUrl.includes("ISI_DENGAN_URL") && currentUrl.startsWith("https://script.google.com");

  if (statusBadge) {
    if (isConnected) {
      statusBadge.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Google Sheet Terhubung
        </span>
      `;
    } else {
      statusBadge.innerHTML = `
        <button onclick="openSettingsModal()" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-colors">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          Mode Demo (Klik untuk Hubungkan Sheet)
        </button>
      `;
    }
  }
}

// ============================================================================
// TOAST NOTIFIKASI
// ============================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  let bgClass = "bg-slate-800 text-white";
  let iconName = "info";

  if (type === "success") {
    bgClass = "bg-emerald-600 text-white";
    iconName = "check-circle";
  } else if (type === "error") {
    bgClass = "bg-rose-600 text-white";
    iconName = "alert-circle";
  } else if (type === "warning") {
    bgClass = "bg-amber-600 text-white";
    iconName = "alert-triangle";
  }

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 ease-out translate-y-4 opacity-0 text-sm font-medium ${bgClass}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  initLucideIcons();

  // Animasi masuk
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
  });

  // Otomatis hilang setelah 4 detik
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
