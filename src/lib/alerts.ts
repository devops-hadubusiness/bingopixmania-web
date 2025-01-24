// packages
import Swal from 'sweetalert2'

export const showLoading = (message: string) => {
  Swal.fire({
    title: 'Carregando ...',
    text: message,
    // icon: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    // allowEnterKey: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

export const closeLoading = () => {
  Swal.close() // Fecha o alerta manualmente
}

export const showError = (message: string) => {
  return Swal.fire({
    title: 'Ops ...',
    text: message,
    icon: 'error',
    confirmButtonColor: '#410061'
  })
}

export const showSuccess = (message: string) => {
  return Swal.fire({
    title: 'Sucesso',
    text: message,
    icon: 'success',
    confirmButtonColor: '#410061'
  })
}

export const showConfirm = async (message: string) => {
  const [result] = await Promise.all([
    Swal.fire({
      title: 'Confirmar?',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#410061',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }),
    (document.body.style.pointerEvents = 'auto')
  ])

  return result
}
