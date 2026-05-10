import Swal from 'sweetalert2'

export async function confirmDelete(message: string) {
  const result = await Swal.fire({
    title: 'Hapus data?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    focusCancel: true,
    confirmButtonColor: '#b3261e',
    cancelButtonColor: '#5f6368',
  })
  return result.isConfirmed
}
