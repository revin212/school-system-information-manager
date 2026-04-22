CREATE TYPE "public"."active_status" AS ENUM('aktif', 'nonaktif');--> statement-breakpoint
CREATE TYPE "public"."class_level" AS ENUM('X', 'XI', 'XII');--> statement-breakpoint
CREATE TYPE "public"."employee_type" AS ENUM('guru', 'karyawan');--> statement-breakpoint
CREATE TYPE "public"."sdm_status" AS ENUM('aktif', 'cuti', 'nonaktif');--> statement-breakpoint
CREATE TYPE "public"."gradebook_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."schedule_status" AS ENUM('aktif', 'bentrok');--> statement-breakpoint
CREATE TYPE "public"."weekday" AS ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu');--> statement-breakpoint
CREATE TYPE "public"."payroll_status" AS ENUM('draft', 'diproses', 'dibayar');--> statement-breakpoint
CREATE TYPE "public"."spp_invoice_status" AS ENUM('lunas', 'belum_lunas', 'terlambat');--> statement-breakpoint
CREATE TYPE "public"."spp_payment_method" AS ENUM('tunai', 'transfer_bank', 'e_wallet', 'qris');--> statement-breakpoint
CREATE TYPE "public"."school_level" AS ENUM('sd', 'smp', 'sma');--> statement-breakpoint
CREATE TABLE "academic_years" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"status" "active_status" NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL,
	CONSTRAINT "academic_years_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"tingkat" "class_level" NOT NULL,
	"jurusan_id" text,
	"status" "active_status" NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL,
	CONSTRAINT "classes_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "majors" (
	"id" text PRIMARY KEY NOT NULL,
	"kode" text NOT NULL,
	"nama" text NOT NULL,
	"status" "active_status" NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL,
	CONSTRAINT "majors_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" text PRIMARY KEY NOT NULL,
	"nip" text NOT NULL,
	"nama" text NOT NULL,
	"tipe" "employee_type" NOT NULL,
	"no_hp" text NOT NULL,
	"email" text,
	"status" "sdm_status" NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL,
	CONSTRAINT "employees_nip_unique" UNIQUE("nip")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"nis" text NOT NULL,
	"nama" text NOT NULL,
	"kelas_id" text,
	"jurusan_id" text,
	"no_hp" text,
	"status" "sdm_status" NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL,
	CONSTRAINT "students_nis_unique" UNIQUE("nis")
);
--> statement-breakpoint
CREATE TABLE "grade_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"tahun_akademik_id" text NOT NULL,
	"kelas_id" text NOT NULL,
	"mapel_id" text NOT NULL,
	"nama" text NOT NULL,
	"bobot" integer NOT NULL,
	"keterangan" text,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grade_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"tahun_akademik_id" text NOT NULL,
	"kelas_id" text NOT NULL,
	"mapel_id" text NOT NULL,
	"siswa_id" text NOT NULL,
	"status" "gradebook_status" NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grade_scores" (
	"id" text PRIMARY KEY NOT NULL,
	"grade_entry_id" text NOT NULL,
	"category_id" text NOT NULL,
	"score" integer,
	CONSTRAINT "grade_scores_grade_entry_id_category_id_unique" UNIQUE("grade_entry_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"tahun_akademik_id" text NOT NULL,
	"kelas_id" text NOT NULL,
	"hari" "weekday" NOT NULL,
	"mulai" text NOT NULL,
	"selesai" text NOT NULL,
	"mapel_id" text NOT NULL,
	"guru_id" text NOT NULL,
	"ruang" text NOT NULL,
	"status" "schedule_status" NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teaching_slots" (
	"id" text PRIMARY KEY NOT NULL,
	"guru_id" text NOT NULL,
	"hari" "weekday" NOT NULL,
	"mulai" text NOT NULL,
	"selesai" text NOT NULL,
	"keterangan" text NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll_slips" (
	"id" text PRIMARY KEY NOT NULL,
	"periode" text NOT NULL,
	"pegawai_id" text NOT NULL,
	"gaji_pokok" integer NOT NULL,
	"tunjangan" integer NOT NULL,
	"potongan" integer NOT NULL,
	"total" integer NOT NULL,
	"status" "payroll_status" NOT NULL,
	"dibayar_pada" timestamp with time zone,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spp_invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"siswa_id" text NOT NULL,
	"kelas_id" text,
	"bulan" text NOT NULL,
	"jatuh_tempo" text NOT NULL,
	"nominal" integer NOT NULL,
	"dibayar" integer NOT NULL,
	"status" "spp_invoice_status" NOT NULL,
	"lunas_pada" timestamp with time zone,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spp_payments" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text NOT NULL,
	"siswa_id" text NOT NULL,
	"metode" "spp_payment_method" NOT NULL,
	"dibayar_pada" timestamp with time zone NOT NULL,
	"nominal" integer NOT NULL,
	"catatan" text,
	"dibuat_pada" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_identity" (
	"id" text PRIMARY KEY NOT NULL,
	"nama_sekolah" text NOT NULL,
	"npsn" text NOT NULL,
	"jenjang" "school_level" NOT NULL,
	"alamat" text NOT NULL,
	"provinsi" text NOT NULL,
	"kota" text NOT NULL,
	"email" text NOT NULL,
	"telepon" text NOT NULL,
	"logo_data_url" text,
	"status_aktif" boolean NOT NULL,
	"terverifikasi" boolean NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
