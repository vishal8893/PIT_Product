import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    public exportASExcelFile(json: any[], excelFileName: string): void {
        const exportData: any[] = [];
        json.forEach(function (value) {
            const rowdata: any = {};
            for (const prop in value) {
                if (prop !== 'Id' && prop !== 'StatusId' && prop !== 'CreatedBy') {
                    rowdata[prop] = value[prop];
                }
            }
            exportData.push(rowdata);
        });
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const workbook: XLSX.WorkBook = { Sheets: { 'Export': worksheet }, SheetNames: ['Export'], };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}