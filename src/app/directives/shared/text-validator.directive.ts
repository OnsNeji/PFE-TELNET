import { Directive, HostListener } from '@angular/core';


@Directive({
    selector: '[appTextValidator]'
})

export class TextValidatorDirective {

    constructor() {
        // do nothing
    }

    @HostListener('paste', ['$event']) blockPaste(e: ClipboardEvent) {
        const clipboardData = e.clipboardData;
        const pastedText: any = clipboardData.getData('text');
        let i = 0;
        let find = false;

        while (i < pastedText.length && find !== true) {
            if (this.isSpecialCharacter(pastedText[i].charCodeAt())) {
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
            if (this.isSpecialCharacter(char.charCodeAt())) {
                e.preventDefault();
            }
        }
    }

    isSpecialCharacter(codeAsci: number) {
        if (codeAsci < 32 || (codeAsci > 32 && codeAsci < 38) || codeAsci === 61 || codeAsci === 63 || codeAsci === 64 ||
            (codeAsci > 90 && codeAsci < 95) ||
            codeAsci === 123 || codeAsci === 124 || codeAsci === 125 ||
            codeAsci === 126 || codeAsci === 127 ||
            (codeAsci > 154 && codeAsci !== 224 && codeAsci !== 231 && codeAsci !== 232 && codeAsci !== 233)) {
            return true;
        }
        return false;
    }
}
