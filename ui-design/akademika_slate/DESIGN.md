# Design System Documentation: The Academic Atelier

## 1. Overview & Creative North Star: "The Academic Atelier"
This design system is not a mere utility; it is a high-performance editorial environment designed for the modern educational landscape. Moving away from the cluttered, "dashboard-heavy" legacy of school management software, we embrace **The Academic Atelier**—a philosophy that treats data as fine typography and administrative tasks as curated workflows.

### Creative North Star
Our goal is **Intellectual Clarity**. We break the "template" look by using high-contrast typographic scales, intentional asymmetry in layouts, and a sophisticated layering system that replaces rigid structural lines with tonal depth. We prioritize breathing room (whitespace) to reduce cognitive load for educators and administrators, making the complex feel effortless.

---

## 2. Colors & Surface Philosophy
The palette is rooted in an authoritative Blue and Slate foundation, but its execution is what defines its premium nature.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. 
- Use `surface-container-low` for large structural areas.
- Use `surface-container-lowest` (Pure White) for interactive cards.
- Use `surface-container-high` for subtle differentiation in sidebars or footers.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (#f7f9fb)
- **Primary Content Area:** `surface-container-low` (#f2f4f6)
- **Interactive Elements/Cards:** `surface-container-lowest` (#ffffff)
- **Nested Details/Drawers:** `surface-container-high` (#e6e8ea)

### The "Glass & Gradient" Rule
To elevate the "SIM Sekolah" beyond a standard enterprise tool, use **Glassmorphism** for floating elements (Toasts, Breadcrumb bars). Use `surface` colors at 80% opacity with a `24px` backdrop blur. 
**Signature Texture:** Main CTA buttons should utilize a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle to provide a "jewel-like" depth.

---

## 3. Typography: Editorial Authority
We use **Inter** not just for readability, but as a structural element. 

| Level | Token | Size | Weight | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-md` | 2.75rem | 700 (Bold) | Hero stats, "Siswa Total" |
| **Headline** | `headline-sm` | 1.5rem | 600 (Semi) | Page titles (e.g., "Data Guru") |
| **Title** | `title-md` | 1.125rem | 600 (Semi) | Card headers, Modal titles |
| **Body** | `body-md` | 0.875rem | 400 (Reg) | Standard data, descriptions |
| **Label** | `label-md` | 0.75rem | 500 (Med) | Table headers, Metadata |

**Editorial Note:** Always maintain a loose tracking (-0.01em to -0.02em) on Headlines to give them a modern, "tight" feel, while keeping Body text at 0 tracking for maximum legibility.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for this system. We achieve lift through **The Layering Principle**.

- **Ambient Shadows:** When an element must float (like a Modal or Toast), use a shadow color tinted with `on-surface` (#191c1e) at 6% opacity. Blur should be high (32px+) to mimic soft, natural light.
- **The "Ghost Border" Fallback:** If a layout feels too "bleached" and needs a guide, use the `outline_variant` (#c3c6d7) at **15% opacity**. It should be felt, not seen.
- **Micro-Depth:** An "Active" sidebar item should not have a border; it should transition from `surface` to `secondary_container` (#dae2fd) with a subtle vertical "pill" indicator in `primary`.

---

## 5. Components: Refined Interaction

### KPI Cards (Informasi Kunci)
- **Structure:** No borders. `surface-container-lowest` background. 
- **Detail:** Use `display-sm` for the metric. Place the `label-md` (Bahasa Indonesia title) *above* the number in `on-surface-variant`.
- **Asymmetry:** The icon should be placed in the top-right, using a `secondary_container` circular background at 20% opacity.

### Tables (Data Master)
- **Constraint:** Forbid the use of horizontal or vertical divider lines.
- **Spacing:** Use 16px vertical padding per row.
- **Hover State:** Rows should shift to `surface-container-highest` on hover to provide a clear focus guide.
- **Pagination:** Keep it "Ghost" style. Text buttons only, no boxed numbers.

### Buttons & Chips
- **Primary Button:** Gradient-filled (Primary to Primary Container), `xl` (0.75rem) roundedness.
- **Status Badges:** Use `tertiary_container` (Green) for "Aktif" and `error_container` (Red) for "Terlambat". Text must be `on_tertiary_container` or `on_error_container` for accessibility.

### Drawer Details (Detail Siswa/Guru)
- Use a "Slide-over" from the right.
- The background must be `surface_bright` with a heavy backdrop blur on the main content to focus the user's attention entirely on the administrative record.

---

## 6. Do’s and Don’ts (Bahasa Indonesia)

### ✅ Do’s
- **Gunakan Whitespace:** Berikan ruang bernapas antar komponen. Jika ragu, tambahkan padding.
- **Hierarki Tonal:** Gunakan perbedaan warna latar belakang (Tonal Layering) untuk memisahkan konten, bukan garis.
- **Bahasa Baku:** Gunakan label yang jelas seperti "Unduh Laporan" daripada "Download".
- **Konsistensi Radius:** Gunakan `xl` (0.75rem) untuk kontainer besar dan `md` (0.375rem) untuk elemen kecil seperti input fields.

### ❌ Don’ts
- **Jangan gunakan Border Hitam:** Hindari border `#000000` atau border dengan opasitas tinggi.
- **Jangan gunakan Shadow Berat:** Hindari shadow yang gelap dan tajam; ini merusak estetika "Clean Professional".
- **Jangan Menumpuk Informasi:** Jika sebuah tabel memiliki lebih dari 8 kolom, gunakan "Drawer Details" untuk menampilkan data tambahan daripada memaksakan tabel menjadi sempit.

---

## 7. Token Reference Summary
- **Background Utama:** `surface` (#f7f9fb)
- **Kontainer Data:** `surface-container-low` (#f2f4f6)
- **Aksi Utama:** `primary` (#004ac6)
- **Aksen Sukses:** `tertiary` (#006229)
- **Radius Utama:** `xl` (12px / 0.75rem)