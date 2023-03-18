import { Injectable } from '@angular/core';

@Injectable()
export class FileService {

    constructor() {
        // do nothing
    }

    FromFileToDbFormat(fileData: string) {
      return atob(fileData);
    }

    FromDbToFileFormat(fileData: string, fileType: string): Blob {
        const byteCharacters = atob(fileData);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Blob([byteNumbers],
            { type: fileType });
    }
}
