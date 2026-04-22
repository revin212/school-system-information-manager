# Frontend Plan — SIM Sekolah (Vite + React Router + Tailwind + TanStack Query)

Tujuan plan ini adalah **mengimplementasikan frontend saja terlebih dulu** dengan **design context dari folder** `[ui-design/](ui-design/)` (ambil style: warna, surface layering, tipografi, bentuk komponen, layout), tanpa generate desain baru.

## Design context yang dipakai (sumber tunggal kebenaran UI)
- **Style guide & token**: `[ui-design/akademika_slate/DESIGN.md](ui-design/akademika_slate/DESIGN.md)`
- **Referensi halaman** (HTML Stitch yang jadi acuan layout/komponen):
  - `[ui-design/login_sim_sekolah/code.html](ui-design/login_sim_sekolah/code.html)`
  - `[ui-design/dashboard_utama/code.html](ui-design/dashboard_utama/code.html)`
  - `[ui-design/master_data_mata_pelajaran/code.html](ui-design/master_data_mata_pelajaran/code.html)`
  - `[ui-design/sdm_guru_karyawan/code.html](ui-design/sdm_guru_karyawan/code.html)`
  - `[ui-design/sdm_data_siswa/code.html](ui-design/sdm_data_siswa/code.html)`
  - `[ui-design/akademik_waktu_mengajar/code.html](ui-design/akademik_waktu_mengajar/code.html)`
  - `[ui-design/akademik_jadwal_pelajaran/code.html](ui-design/akademik_jadwal_pelajaran/code.html)`
  - `[ui-design/akademik_penilaian/code.html](ui-design/akademik_penilaian/code.html)`
  - `[ui-design/keuangan_pembayaran_spp/code.html](ui-design/keuangan_pembayaran_spp/code.html)`
  - `[ui-design/keuangan_penggajian/code.html](ui-design/keuangan_penggajian/code.html)`
  - `[ui-design/sekolah_identitas_sekolah/code.html](ui-design/sekolah_identitas_sekolah/code.html)`
  - `[ui-design/laporan_utama/code.html](ui-design/laporan_utama/code.html)`

## Prinsip UI yang wajib dipertahankan
- **Tonal layering / surface hierarchy** untuk pemisah area (bukan garis).
- **No-line rule**: hindari border 1px solid sebagai pembatas utama (kalau perlu “ghost border” pakai `outline_variant` opasitas rendah).
- **Tipografi Inter** + hierarki editorial (headline ketat, body nyaman).
- **Cards & tables minim garis**, row hover pakai perubahan tonal.
- **CTA utama gradient** (primary → primary-container).
- **Drawer detail** (slide-over kanan) untuk detail record.
- Bahasa UI **Bahasa Indonesia** (label, empty state, error state).

---

## Tech stack frontend
- **Vite + React (TypeScript)**
- **TailwindCSS** (mengadopsi token warna dari Stitch)
- **React Router** (SPA routing)
- **TanStack Query** untuk data fetching/caching
- **Mock data lokal** (tanpa MSW) untuk semua list/detail/form pada tahap awal

Catatan: TanStack Query tetap dipakai dengan fetcher mock supaya transisi ke API backend nanti minimal (cukup ganti base fetcher).

---

## Struktur folder yang akan dibuat (frontend)
Lokasi: `apps/web/` (atau root `web/` bila repo belum monorepo; keputusan final saat scaffold).

Rekomendasi struktur:
- `src/app/`
  - `router.tsx` (React Router routes)
  - `providers.tsx` (QueryClientProvider, theme)
- `src/layouts/`
  - `AppShell.tsx` (Sidebar + Topbar + content container)
  - `AuthLayout.tsx` (layout login)
- `src/components/ui/` (komponen reusable, sesuai Stitch)
  - `Button.tsx`, `Input.tsx`, `Select.tsx`, `Badge.tsx`
  - `Card.tsx`, `Table.tsx`, `Pagination.tsx`
  - `Drawer.tsx`, `Modal.tsx`, `Toast.tsx`
  - `Breadcrumbs.tsx`
  - `Sidebar/Sidebar.tsx`, `Sidebar/SidebarGroup.tsx`, `Sidebar/SidebarItem.tsx`
- `src/features/` (per modul)
  - `auth/` (login UI + guard)
  - `dashboard/`
  - `master/subjects/`, `master/majors/`, `master/classes/`, `master/academic-years/`
  - `sdm/employees/`, `sdm/students/`
  - `akademik/time-slots/`, `akademik/schedules/`, `akademik/grade-categories/`, `akademik/grades/`
  - `keuangan/spp/`, `keuangan/payroll/`
  - `sekolah/profile/`
  - `laporan/`
- `src/lib/`
  - `queryClient.ts`
  - `mockApi/` (mock fetcher + fixtures)
  - `format/` (rupiah, tanggal)
  - `rbac/` (role + util filter menu)
- `src/styles/`
  - `tailwind.css`
  - `tokens.css` (opsional; bila ingin CSS vars untuk surface)

---

## Implementasi design tokens (Tailwind)
Mengadopsi token warna di HTML Stitch (contoh terlihat di `ui-design/**/code.html`):
- `primary`, `primary-container`
- `surface`, `surface-container-low`, `surface-container-lowest`, `surface-container-high`, `surface-container-highest`
- `outline-variant`, `on-surface`, `on-surface-variant`, dll

Plan implementasi:
- Tambah theme colors di `tailwind.config.*` berdasarkan token Stitch.
- Tambah radius skala yang konsisten (mengikuti Stitch: `xl` untuk container besar).
- Gunakan class utilities untuk efek “glass” (backdrop blur + opacity) pada toast/breadcrumb bar.

---

## Sidebar navigation (wajib dropdown submenu, bukan tab)
### Struktur menu (Bahasa Indonesia)
- Dashboard
- Master Data
  - Mata Pelajaran
  - Jurusan
  - Kelas
  - Tahun Akademik
- SDM
  - Data Guru & Karyawan
  - Data Siswa
- Akademik
  - Waktu Mengajar
  - Jadwal Pelajaran
  - Kategori Nilai
  - Penilaian
- Keuangan
  - Pembayaran SPP
  - Penggajian
- Sekolah
  - Identitas Sekolah
- Laporan
  - Data Guru
  - Data Siswa
  - Ledger Nilai
  - Kekurangan SPP

### Behavior
- Sidebar group = **accordion** (expand/collapse).
- Saat route submenu aktif, group terkait **auto-expanded**.
- Active item: pill tonal + indikator vertikal `primary` (tanpa border tegas), selaras dengan Stitch.
- Menu bisa difilter berdasar role (stub RBAC untuk UI):
  - `ADMIN`: semua
  - `TU`: master data, siswa, SPP, laporan
  - `GURU`: jadwal, penilaian
  - `KEPSEK`: read-only + laporan

---

## Routing map (React Router)
- `/login`
- `/` → redirect ke `/dashboard`
- `/dashboard`
- `/master/mata-pelajaran`
- `/master/jurusan`
- `/master/kelas`
- `/master/tahun-akademik`
- `/sdm/guru-karyawan`
- `/sdm/siswa`
- `/akademik/waktu-mengajar`
- `/akademik/jadwal-pelajaran`
- `/akademik/kategori-nilai`
- `/akademik/penilaian`
- `/keuangan/pembayaran-spp`
- `/keuangan/penggajian`
- `/sekolah/identitas`
- `/laporan`
  - `/laporan/data-guru`
  - `/laporan/data-siswa`
  - `/laporan/ledger-nilai`
  - `/laporan/kekurangan-spp`

Guard (frontend-only):
- `RequireAuth`: sementara gunakan auth mock (user tersimpan di localStorage) untuk mengunci halaman selain login.

---

## Data layer: TanStack Query + Mock API lokal
Tujuan: UI bisa jalan “seperti” sudah ada backend.

### Mock API approach
- Buat `src/lib/mockApi/fixtures.ts` berisi data contoh: subjects, majors, classes, academicYears, employees, students, schedules, sppInvoices/payments, payroll, grades.
- Buat `src/lib/mockApi/client.ts`:
  - fungsi `mockFetch(resource, params)` yang mengembalikan Promise + delay (mis. 200–600ms) untuk mensimulasikan network.
  - CRUD operations in-memory (untuk sesi dev) + persist opsional ke localStorage.
- Di setiap feature, definisikan `queries.ts` dan `mutations.ts` memakai TanStack Query agar pola sama dengan real API nanti.

### State UI yang wajib ada
- Loading skeleton
- Empty state (Bahasa Indonesia)
- Error state (simulate error via toggle dev flag)

---

## Implementasi halaman (mengacu `ui-design/**/code.html`)
Prioritas implementasi supaya cepat “demoable”:
1. **Login** (layout & style 1:1 dari Stitch, auth mock)
2. **AppShell**: Topbar + Sidebar accordion + area konten tonal
3. **Dashboard**: KPI cards + widget table + jadwal hari ini (pakai data mock)
4. **Pattern CRUD table + form** (dipakai ulang untuk master data, SDM):
   - Search, filter sederhana, pagination UI
   - Modal/Drawer untuk create/edit
5. **Master Data: Mata Pelajaran** (jadi template untuk Jurusan/Kelas/Tahun Akademik)
6. **SDM: Guru/Karyawan** + **Siswa** (list + drawer detail)
7. **Akademik**: Waktu Mengajar, Jadwal Pelajaran (grid), Penilaian + Kategori Nilai
8. **Keuangan**: Pembayaran SPP (tabs: Transaksi/Riwayat/Kekurangan), Penggajian
9. **Sekolah**: Identitas Sekolah (form + preview)
10. **Laporan**: halaman utama + sublaporan (export placeholder)

---

## Cetak & Export (frontend-only, tahap awal)
Karena backend belum ada:
- Tombol “Cetak” / “Export” dibuat fungsional minimal:
  - Export CSV client-side dari data mock.
  - Cetak: gunakan `window.print()` untuk tampilan ringkas (opsional) atau placeholder.
- Struktur komponen dibuat agar nanti gampang pindah ke PDF server-side.

---

## Acceptance criteria (frontend)
- Semua route bisa dibuka dengan UI konsisten (Bahasa Indonesia).
- Sidebar **accordion dropdown submenu** bekerja (active highlight + auto-expand).
- Dashboard & minimal 1 modul CRUD (Mata Pelajaran) fully interactive dengan mock data (create/edit/delete).
- TanStack Query dipakai konsisten untuk list/detail/mutation (meski masih mock).
- Tidak ada border table/section yang “keras” (mengikuti tonal layering).

---

## Todo implementasi (urutan kerja)
- Scaffold Vite + React + TS + Tailwind, pasang Inter + Material Symbols
- Implement Tailwind tokens dari Stitch (colors/surfaces/radius)
- Buat komponen UI dasar (Button/Input/Select/Card/Badge/Table/Drawer/Toast)
- Buat `AppShell` (Topbar + Sidebar accordion)
- Setup React Router + auth mock + route guards
- Setup TanStack Query + mockApi layer (fixtures + CRUD)
- Implement halaman: Login → Dashboard → Master Data (Mata Pelajaran) → modul lainnya bertahap

