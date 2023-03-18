import { Injectable } from '@angular/core';
@Injectable()
export class NumberFormatter {
    round(value: number, fractionalNumber) {
        const coff = Math.pow(10, fractionalNumber);
        return Math.round(value * coff) / coff;
    }
}
