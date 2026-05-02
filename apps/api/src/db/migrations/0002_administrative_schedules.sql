CREATE TABLE "administrative_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"tanggal" date NOT NULL,
	"jam" text NOT NULL,
	"judul" text NOT NULL,
	"lokasi" text NOT NULL,
	"dibuat_pada" timestamp with time zone NOT NULL,
	"diubah_pada" timestamp with time zone NOT NULL
);
