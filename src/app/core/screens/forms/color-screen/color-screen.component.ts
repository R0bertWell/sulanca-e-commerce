import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Color } from '../product-screen/models/product-info.model';
import { ColorService } from './services/color.service';
import { MatDialog } from '@angular/material/dialog';
import { ColorDialogComponent } from './color-dialog/color-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ColorRequired } from './models/color.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-color-screen',
  templateUrl: './color-screen.component.html',
  styleUrls: ['./color-screen.component.scss']
})
export class ColorScreenComponent {
  COLOR_DATA: Color[] = [];
  dataSourceColors: MatTableDataSource<Color> = new MatTableDataSource<Color>(this.COLOR_DATA);

  colorControl: FormControl = new FormControl('');

  filter: string = '';

  pageHandlerColor = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 10,
    options: [10,25,100]
  }

  displayedColorColumns: string[] = ["color", "hex", "edit", "delete"];

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private colorService: ColorService
  ){
    this.getColors();
  }

  ngOnInit(): void {

  }

  getColors(){
    console.log("Get colors => ")
    this.colorService.getColors(this.pageHandlerColor.pageIndex, this.pageHandlerColor.pageSize, this.filter).subscribe({
      next: (response: any) => {
        console.log("Response => ", response)
        this.COLOR_DATA = response.content as Color[];

        this.dataSourceColors = new MatTableDataSource<Color>(this.COLOR_DATA);

        this.pageHandlerColor.totalSize = response.totalElements;
        this.pageHandlerColor.pageIndex = response.pageable.pageNumber;
        this.pageHandlerColor.pageSize = response.pageable.pageSize;
      },
      error: (response: any) => {
        console.log("Response ERR => ", response)

      }
    })
  }

  handlePageColor(event: any){
    this.pageHandlerColor.pageIndex = event.pageIndex;
    this.pageHandlerColor.pageSize = event.pageSize;
    this.getColors();
  }

  editColor(color: Color){
    let dialogRed = this.dialog.open(ColorDialogComponent, {
      width: '500px',
      height: '200px',
      data: color
    });

    dialogRed.afterClosed().subscribe( result => {
      if(result){
        this.getColors();
      }
    })
  }

  askRemoveColor(color: ColorRequired){
    this.removeColor(color);
  }

  removeColor(color: ColorRequired){
    let confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Tem certeza que deseja remover esta cor?"
      }
    })

    confirmDialog.afterClosed().subscribe( result => {
      if(result){
        this.colorService.removeColor(color.colorId).subscribe({
          next: (response: any) => {
            this._snackBar.open("Cor removida com sucesso!", "Ok", {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            })
            this.pageHandlerColor.pageIndex = 0;
            this.getColors();
          },
          error: (error: any) => {
            this._snackBar.open(error, "Ok", {
              duration: 10000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            })

          }
        });
      }
    })
  }

  chamadaDialog(){
    let dialogRed = this.dialog.open(ColorDialogComponent, {
      width: '500px',
      height: '200px',
    });



    dialogRed.afterClosed().subscribe( result => {
      if(result){
        this.pageHandlerColor.pageIndex = 0;
        this.getColors();
      }
      console.log("Result => ", result)
    })
  }
}
