# 🛵 Landing Page Form Pengaduan Mitra Driver ShopeeFood (Terintegrasi Google Sheets)

Landing page responsif dan modern dengan tema khas **ShopeeFood** yang dirancang khusus untuk mitra pengemudi (driver) menyampaikan keluhan atau kendala operasional, yang otomatis terhubung dan tersimpan secara real-time ke **Google Sheets**.

---

## 📁 Struktur File Proyek

```text
shopeefood-pengaduan/
├── index.html                  # Halaman utama landing page & formulir pengaduan
├── style.css                   # Gaya kustom tema warna ShopeeFood & animasi
├── app.js                      # Logika form, validasi, dan integrasi Google Apps Script
├── google-apps-script/
│   └── Code.gs                 # Skrip backend Google Apps Script siap pasang di Google Sheets
└── README.md                   # Petunjuk lengkap instalasi dan penggunaan
```

---

## 🚀 Panduan Menghubungkan ke Google Sheets (Hanya 3 Menit)

Integrasi ini menggunakan **Google Apps Script Web App**. Cara ini **100% GRATIS**, tidak memerlukan database pihak ketiga atau server berbayar, dan sangat aman.

### Langkah 1: Buat Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet Anda, misalnya: `Database Pengaduan Driver ShopeeFood`.
3. *(Opsional)* Beri nama tab sheet pertama sebagai `Pengaduan Driver` (skrip juga akan otomatis membuatnya jika belum ada).

### Langkah 2: Buka Apps Script
1. Di menu atas Google Sheet, klik **Extensions (Ekstensi)** &gt; **Apps Script**.
2. Anda akan diarahkan ke halaman editor kode Apps Script.

### Langkah 3: Tempel Kode Skrip
1. Hapus semua teks bawaan (`function myFunction() { ... }`) di dalam file `Code.gs`.
2. Buka file [Code.gs](file:///C:/Users/MP2C8/.gemini/antigravity/scratch/shopeefood-pengaduan/google-apps-script/Code.gs) dari proyek ini.
3. Salin (copy) seluruh kodenya dan tempel (paste) ke editor Google Apps Script.
4. Tekan tombol **Save** (ikon disket) atau tekan `Ctrl + S`.

### Langkah 4: Terapkan (Deploy) sebagai Web App
1. Di pojok kanan atas, klik tombol biru **Deploy (Terapkan)** &gt; pilih **New deployment (Penerapan baru)**.
2. Klik ikon gerigi ⚙️ di samping "Select type" &gt; pilih **Web app**.
3. Isi form konfigurasi sebagai berikut:
   - **Description**: `ShopeeFood Driver API`
   - **Execute as (Jalankan sebagai)**: `Me (email Anda)`
   - **Who has access (Siapa yang memiliki akses)**: **`Anyone (Siapa saja)`** ⚠️ *(PENTING: Harus "Anyone" agar form web bisa mengirim data tanpa login Google).*
4. Klik tombol **Deploy**.
5. Jika muncul jendela otorisasi akun Google:
   - Klik **Authorize access**.
   - Pilih akun Google Anda.
   - Klik **Advanced** &gt; klik **Go to Untitled project (unsafe)**.
   - Klik **Allow**.
6. Google akan memberikan **Web app URL** (URL berakhiran `/exec`). **Salin (Copy) URL tersebut.**

### Langkah 5: Hubungkan ke Web Form
Anda memiliki **2 cara mudah** untuk memasukkan URL tersebut:

#### Cara A: Langsung dari Tampilan Web (Tanpa Edit Kode)
1. Buka `index.html` di browser Anda.
2. Klik tombol **ikon gerigi (⚙️)** di kanan atas navbar.
3. Tempelkan URL Google Apps Script Anda pada kolom input &gt; klik **Simpan & Sambungkan**.
4. Status badge di atas akan otomatis berubah menjadi hijau: **Google Sheet Terhubung**.

#### Cara B: Melalui File `app.js`
1. Buka file [app.js](file:///C:/Users/MP2C8/.gemini/antigravity/scratch/shopeefood-pengaduan/app.js).
2. Temukan baris:
   ```javascript
   const DEFAULT_SCRIPT_URL = "ISI_DENGAN_URL_WEB_APP_GOOGLE_SCRIPT_ANDA";
   ```
3. Ganti `"ISI_DENGAN_URL_WEB_APP_GOOGLE_SCRIPT_ANDA"` dengan URL Web App Anda.

---

## 📊 Kolom Data yang Tersimpan di Google Sheet

Ketika mitra driver menekan tombol submit, baris baru akan otomatis tercatat di Google Sheet dengan kolom-kolom berikut:

| No | Nama Kolom | Deskripsi |
|---|---|---|
| 1 | **Timestamp (Waktu)** | Waktu pengiriman laporan (WIB) |
| 2 | **Nomor Tiket** | ID unik pengaduan (e.g. `SPF-20260918-4921`) |
| 3 | **Nama Lengkap Mitra** | Nama pengemudi pelapor |
| 4 | **ID Driver / Mitra** | ID akun mitra driver |
| 5 | **Nomor WhatsApp** | Nomor kontak aktif pengemudi |
| 6 | **Kota / Area Operasional** | Wilayah bertugas (Jabodetabek, Surabaya, dll) |
| 7 | **Kategori Masalah** | Jenis kendala (Aplikasi, Pesanan Fiktif, Dompet, dll) |
| 8 | **Nomor Pesanan** | Order ID ShopeeFood (jika ada) |
| 9 | **Detail / Kronologi** | Penjelasan lengkap kendala driver |
| 10 | **Link Lampiran Bukti** | Tautan foto struk/chat/tangkapan layar |
| 11 | **Status Penanganan** | Default: `Baru Masuk` |
| 12 | **Catatan Admin** | Kolom catatan untuk tim operasional |

---

## 🌐 Menjalankan & Mempublikasikan Website

### Menjalankan Secara Lokal:
Cukup klik ganda (double-click) file `index.html` atau buka file tersebut melalui browser Google Chrome / Edge Anda.

### Mempublikasikan secara Online:
Anda dapat meng-upload file folder ini ke layanan gratis mana saja:
- **GitHub Pages** (Gratis & Mudah)
- **Netlify** / **Vercel** (Cukup drag-and-drop folder proyek)
- Web hosting cPanel apa pun.
