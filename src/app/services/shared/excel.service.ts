import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs.min.js';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() {
    // do nothing
  }

  public generateExcel(header: any, rows: any[], merges: string[], styles: any[], name: string): void {
    const options = {
      filename: './streamed-workbook.xlsx',
      useStyles: true,
      useSharedStrings: true
    };
    const workbook = new Excel.Workbook(options);
    this.buildWorksheet(workbook, header, rows, merges, styles, name);

    this.saveWorkbook(workbook, name);
  }

  public generateExcelMultiSheets(sheets: {
    header: any, rows: any[], merges: string[], styles: any[], name: string
  }[], filename: string): void {
    const options = {
      filename: './streamed-workbook.xlsx',
      useStyles: true,
      useSharedStrings: true
    };
    const workbook = new Excel.Workbook(options);
    sheets.forEach(sheet => {
      this.buildWorksheet(workbook, sheet.header, sheet.rows, sheet.merges, sheet.styles, sheet.name);
    });

    this.saveWorkbook(workbook, filename);
  }

  public buildWorksheet(workbook: any, header: any, rows: any[], merges: string[], styles: any[], name: string) {
    const worksheet = workbook.addWorksheet(name, {
      properties: { tabColor: { argb: 'FFC0000' } }
    });

    worksheet.columns = header;
    if (rows !== null) {
      rows.forEach(row => {
        worksheet.addRow(row);
      });
    }

    if (merges !== null) {
      merges.forEach(merge => {
        worksheet.mergeCells(merge);
      });
    }

    if (styles !== null) {
      styles.forEach(style => {
        worksheet.getCell(style.cell).font = style.font;
        worksheet.getCell(style.cell).alignment = style.alignment;
        worksheet.getCell(style.cell).fill = style.fill;
        worksheet.getCell(style.cell).border = style.border;
      });
    }
  }

  public saveWorkbook(workbook: any, filename: string) {
    workbook.xlsx.writeBuffer().then(function (buffer) {
      // done buffering
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, filename + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }
}
