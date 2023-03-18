import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appNumberValidator]'
})

export class NumbrerValidatorDirective {
    @Input() inputValue: string;

    constructor() {
        // do nothing
    }

    @HostListener('paste', ['$event']) blockPaste(e: ClipboardEvent) {
        const clipboardData = e.clipboardData;
        const pastedText: any = clipboardData.getData('text');
        let i = 0;
        let find = false;

        while (i < pastedText.length && find !== true) {
            if (this.isNotNumber(pastedText[i].charCodeAt())) {
                find = true;
                e.preventDefault();
            } else {
                i++;
            }
        }
    }

    @HostListener('keydown', ['$event'])
    public onKeydownHandler(e: KeyboardEvent): void {
        const char: any = e.key;
        if (char !== undefined) {
            if ((this.isNotNumber(char.charCodeAt()) && char !== 'Backspace' && char !== 'Delete' &&
                char !== 'ArrowLeft' && char !== 'ArrowRight' && char !== 'Tab')) {
                e.preventDefault();
            }
            if (this.inputValue !== undefined && this.inputValue !== null) {
                if ((this.inputValue.toString().indexOf('.') !== -1 || this.inputValue.toString().indexOf(',') !== -1) &&
                    (char.charCodeAt() === 46 ||
                        char.charCodeAt() === 44)) {
                    e.preventDefault();
                }
            }
        }
    }

    isNotNumber(codeAsci: number) {
        if (codeAsci < 44 || codeAsci > 57 || codeAsci === 45 || codeAsci === 47) {
            return true;
        }
        return false;
    }

}
