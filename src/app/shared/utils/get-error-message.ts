import { AbstractControl } from '@angular/forms'

export const getErrorMessage = (control: AbstractControl): string => {
  if (control.hasError('required')) {
    return 'Field is required'
  } else if (control.hasError('email')) {
    return 'Not a valid email'
  } else if (control.errors['minlength']) {
    return `Should be min ${control.errors['minlength'].requiredLength} digits`
  } else {
    return ''
  }
}
