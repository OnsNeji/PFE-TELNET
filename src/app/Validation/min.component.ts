import { ValidatorFn, AbstractControl } from '@angular/forms';
export function min(minValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const input = control.value,
            isValid = input < minValue;
        if (isValid) {
            return { 'minValue': { minValue } };
        } else {
            return null;
        }
    };
}
