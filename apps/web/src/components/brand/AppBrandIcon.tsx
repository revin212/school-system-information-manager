import ikonSekolah from '../../assets/ikon-sekolah.png'

/** Ikon utama aplikasi (tab browser + logo merek). */
export function AppBrandIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <img
      src={ikonSekolah}
      alt=""
      width={32}
      height={32}
      className={`object-contain shrink-0 ${className}`}
      decoding="async"
    />
  )
}
