import { NAV, type NavGroup, type NavItem } from '../../components/ui/Sidebar/nav'
import type { UserRole } from './authStore'

/**
 * Hak akses rute (selaras menu sidebar).
 *
 * - ADMIN & KEPSEK: penuh (operasional & pengawasan).
 * - TU: administrasi umum & keuangan; tanpa modul Akademik & tanpa Ledger Nilai (nilai).
 * - Guru: akademik, siswa, laporan akademik; tanpa master data, keuangan, identitas sekolah.
 */

function pathSet(paths: readonly string[]): Set<string> {
  return new Set(paths)
}

/** Tata usaha: tanpa modul Akademik & tanpa Ledger Nilai. */
const TU_PATHS: readonly string[] = [
  '/dashboard',
  '/master/mata-pelajaran',
  '/master/jurusan',
  '/master/kelas',
  '/master/tahun-akademik',
  '/sdm/guru-karyawan',
  '/sdm/siswa',
  '/akademik/jadwal-administratif',
  '/keuangan/pembayaran-spp',
  '/keuangan/penggajian',
  '/sekolah/identitas',
  '/laporan/data-guru',
  '/laporan/data-siswa',
  '/laporan/kekurangan-spp',
]

const ROLE_PATHS: Record<UserRole, 'all' | Set<string>> = {
  ADMIN: 'all',
  KEPSEK: 'all',
  TU: pathSet(TU_PATHS),
  GURU: pathSet([
    '/dashboard',
    '/sdm/siswa',
    '/akademik/waktu-mengajar',
    '/akademik/jadwal-pelajaran',
    '/akademik/kategori-nilai',
    '/akademik/penilaian',
    '/laporan/data-siswa',
    '/laporan/ledger-nilai',
  ]),
}

export function normalizeAppPath(pathname: string): string {
  if (!pathname) return '/dashboard'
  const p = pathname.replace(/\/+$/, '') || '/'
  return p
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const p = normalizeAppPath(pathname)
  if (p === '/dashboard') return true

  const rule = ROLE_PATHS[role]
  if (rule === 'all') return true
  return rule.has(p)
}

export function navigationForRole(role: UserRole): Array<NavItem | NavGroup> {
  const out: Array<NavItem | NavGroup> = []
  for (const entry of NAV) {
    if ('items' in entry) {
      const items = entry.items.filter((it) => canAccessPath(role, it.to))
      if (items.length === 0) continue
      out.push({ ...entry, items })
    } else if (canAccessPath(role, entry.to)) {
      out.push(entry)
    }
  }
  return out
}
