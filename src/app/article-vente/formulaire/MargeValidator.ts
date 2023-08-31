import { AbstractControl, ValidationErrors } from '@angular/forms';

export class MargeValidator {
  static margeValidation(couDeFabrication: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const margenValues = control.value;
      const maxMargeValue = couDeFabrication / 3;

      if (margenValues < 5000 || margenValues > maxMargeValue) {
        return { margeValue: true };
      }
      return null;
    };
  }
}
