import { Component } from '@angular/core';
import { Size } from '../product-screen/models/product-info.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { SizeService } from './services/size.service';
import { SizeRequired } from './models/size.model';
import { SizeDialogComponent } from './size-dialog/size-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-size-screen',
  templateUrl: './size-screen.component.html',
  styleUrls: ['./size-screen.component.scss']
})
export class SizeScreenComponent {
  SIZE_DATA: Size[] = [];
  dataSourceSizes: MatTableDataSource<Size> = new MatTableDataSource<Size>(this.SIZE_DATA);

  sizeControl: FormControl = new FormControl('');

  filter: string = '';

  pageHandlerSize = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 10,
    options: [10,25,100]
  }

  displayedSizeColumns: string[] = ["size", "edit", "delete"];

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private sizeService: SizeService
  ){
    this.getSizes();
  }

  ngOnInit(): void {

  }

  getSizes(){
    console.log("Get sizes => ")
    this.sizeService.getSizes(this.pageHandlerSize.pageIndex, this.pageHandlerSize.pageSize, this.filter).subscribe({
      next: (response: any) => {
        console.log("Response => ", response)
        this.SIZE_DATA = response.content as Size[];

        this.dataSourceSizes = new MatTableDataSource<Size>(this.SIZE_DATA);

        this.pageHandlerSize.totalSize = response.totalElements;
        this.pageHandlerSize.pageIndex = response.pageable.pageNumber;
        this.pageHandlerSize.pageSize = response.pageable.pageSize;
      },
      error: (response: any) => {
        console.log("Response ERR => ", response)

      }
    })
  }

  handlePageSize(event: any){
    this.pageHandlerSize.pageIndex = event.pageIndex;
    this.pageHandlerSize.pageSize = event.pageSize;
    this.getSizes();
  }

  editSize(size: Size){
    let dialogRed = this.dialog.open(SizeDialogComponent, {
      width: '250px',
      height: 'auto',
      data: size
    });

    dialogRed.afterClosed().subscribe( result => {
      if(result){
        this.getSizes();
      }
    })
  }

  askRemoveSize(size: SizeRequired){
    this.removeSize(size);
  }

  removeSize(size: SizeRequired){
    let confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Tem certeza que deseja remover este Tamanho?"
      }
    })

    confirmDialog.afterClosed().subscribe( result => {
      if(result){
        this.sizeService.removeSize(size.sizeId).subscribe({
          next: (response: any) => {
            this._snackBar.open("Tamanho removido com sucesso!", "Ok", {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            })
            this.pageHandlerSize.pageIndex = 0;
            this.getSizes();
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
    let dialogRed = this.dialog.open(SizeDialogComponent, {
      width: '500px',
      height: '200px',
    });

    dialogRed.afterClosed().subscribe( result => {
      if(result){
        this.pageHandlerSize.pageIndex = 0;
        this.getSizes();
      }
      console.log("Result => ", result)
    })
  }
}
