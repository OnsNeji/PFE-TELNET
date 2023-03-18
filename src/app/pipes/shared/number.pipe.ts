import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberForm'
})
export class NumberPipe implements PipeTransform {
    constructor() {
        // do nothing
    }

    transform(value: number): any {
        if (value) {
            const number = value.toString().replace(',', '.');
            return +number;
        }
    }
}
