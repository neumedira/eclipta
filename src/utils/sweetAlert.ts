import Swal from 'sweetalert2';

export const showSuccessAlert = (message: string) => {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: 3000,
    showConfirmButton: false,
  });
};

export const showErrorAlert = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error!',
    text: message,
  });
};

export const showConfirmAlert = (message: string, onConfirm: () => void) => {
  Swal.fire({
    icon: 'warning',
    title: 'Are you sure?',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};