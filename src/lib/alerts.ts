// packages
import Swal from 'sweetalert2';

export const showError = (message: string) => {
  return Swal.fire({
    title: 'Ops ...',
    text: message,
    icon: 'error',
    confirmButtonColor: '#410061',
  });
};

export const showSuccess = (message: string) => {
  return Swal.fire({
    title: 'Sucesso',
    text: message,
    icon: 'success',
    confirmButtonColor: '#410061',
  });
};

export const showConfirm = (message: string) => {
  return Swal.fire({
    title: 'Confirmar?',
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#410061',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
  });
};