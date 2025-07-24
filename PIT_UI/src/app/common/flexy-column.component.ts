import {Renderer2 } from '@angular/core';
import {Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-flexy-column',
    template: ''
})

export class FlexyColumnComponent implements OnInit, OnDestroy {

    constructor(private rederer: Renderer2){ }

    colObj: any;
    pressed = false;
    currentResizeIndex : number = 0;
    startX: number = 0;
    startWidth: number = 0;
    isResizingRight: boolean =false;
    // resizableMousemove: () => void;
    // resizableMouseup: () => void;
    resizableMousemove() {} ;
    resizableMouseup() {};
    displayedColumns : string[] = [];

    ngOnInit(){

    }

    ngOnDestroy(){}

    setTableResize( tableWidth: number, columns: any){
        this.colObj = columns;
        let totWidth = 0;
        columns.forEach((column:any) => {
            totWidth += columns.width;
        });

        const scale = (tableWidth - 5) /totWidth;
        columns.forEach((column:any) => {
            column.width *= scale;
            this.setColumnWidth(column);
        });
    }

    setDisplayedColumns(columns:any ) {
        this.colObj = columns;
        columns.forEach((column:any, index:any) => {
        column.index = index;
        this.displayedColumns[index] = column.field;        
        });
        return this.displayedColumns;
    }

    public onResizeColumn (event: any, index: number, matTableRef: any){
        this.checkResizing(event, index, matTableRef);
        this.currentResizeIndex = index;
        this.pressed = true;
        this.startX = event.pageX;
        this.startWidth = event.target.clientWidth;
        event.preventDefault();
        this.mouseMove(index);
    }

    checkResizing(event:any, index:any, matTableRef: any) {
        const cellData = this.getCellData(index, matTableRef);
        if((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.colObj.length - 1)){
            this.isResizingRight = true;
        }else{
            this.isResizingRight = false;
        }
    }

    getCellData(index: number, matTableRef: any){
        const headerRow = matTableRef.nativeElement.children[0];
        const cell = headerRow.children[index];
        return cell.getBoundingClientRect();
    }

    mouseMove(index: number){
        this.resizableMousemove = this.rederer.listen('document', 'mousemove', (event) => {
            if(this.pressed && event.buttons){
                const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
                const width = this.startWidth + dx;
                if(this.currentResizeIndex === index && width > 50){
                    this.setColumnWidthChanges(index, width);
                }
            }
        });
        this.resizableMouseup = this.rederer.listen('document', 'mouseup', (event) => {
            if(this.pressed){
                this.pressed = false;
                this.currentResizeIndex = -1;
                this.resizableMousemove();
                this.resizableMouseup();
            }
        });
    }

    setColumnWidthChanges(index: number, width: number) {

        const orgWidth = this.colObj[index].width;
        const dx = width = orgWidth;
        if(dx !== 0){
            const j = (this.isResizingRight) ? index + 1 : index - 1;
            const newWidth = this.colObj[j].width - dx;
            if(newWidth > 50){
                this.colObj[index].width = width;
                this.setColumnWidth(this.colObj[j]);
            }
        }
    }

    setColumnWidth(column: any){
        const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.field));
        columnEls.forEach((el:any) => {
            el.style.width = column.width + 'px';
        });
    }
}