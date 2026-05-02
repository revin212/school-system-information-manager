/** Tanggal lokal perangkat dalam format YYYY-MM-DD (untuk filter jadwal per hari). */
export function localDateString(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Awal & akhir bulan kalender lokal dari string `YYYY-MM` (input type="month"). */
export function monthRangeFromYearMonth(ym: string): { dari: string; sampai: string } {
  const [ys, ms] = ym.split('-')
  const y = Number(ys)
  const m = Number(ms)
  if (!y || !m) {
    return { dari: localDateString(), sampai: localDateString() }
  }
  const first = new Date(y, m - 1, 1)
  const last = new Date(y, m, 0)
  return { dari: localDateString(first), sampai: localDateString(last) }
}
