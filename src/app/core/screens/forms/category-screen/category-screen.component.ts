import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Category } from './../product-screen/models/category.model';
import { Component } from '@angular/core';
import { CategoryService } from './services/category.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CategoryRequired } from './models/category.model';

@Component({
  selector: 'app-category-screen',
  templateUrl: './category-screen.component.html',
  styleUrls: ['./category-screen.component.scss']
})
export class CategoryScreenComponent {
  SIZE_DATA: Category[] = [];
  dataSourceCategories: MatTableDataSource<Category> = new MatTableDataSource<Category>(this.SIZE_DATA);

  filter: string = '';

  pageHandlerCategory = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 10,
    options: [10,25,100]
  }

  displayedCategoryColumns: string[] = ["category", "nrOrder", "edit", "delete"];

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ){
    this.getCategories();
  }

  ngOnInit(): void {

  }

  getCategories(){
    console.log("Get categorys => ")
    this.categoryService.getCategories(this.pageHandlerCategory.pageIndex, this.pageHandlerCategory.pageSize, this.filter).subscribe({
      next: (response: any) => {
        console.log("Response => ", response)
        this.SIZE_DATA = response.content as Category[];

        this.dataSourceCategories = new MatTableDataSource<Category>(this.SIZE_DATA);

        this.pageHandlerCategory.totalSize = response.totalElements;
        this.pageHandlerCategory.pageIndex = response.pageable.pageNumber;
        this.pageHandlerCategory.pageSize = response.pageable.pageSize;
      },
      error: (response: any) => {
        console.log("Response ERR => ", response)

      }
    })
  }

  handlePageCategory(event: any){
    this.pageHandlerCategory.pageIndex = event.pageIndex;
    this.pageHandlerCategory.pageSize = event.pageSize;
    this.getCategories();
  }

  editCategory(category: Category){
    let dialogRed = this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      height: 'auto',
      data: category
    });

    dialogRed.afterClosed().subscribe( result => {
      if(result){
        this.getCategories();
      }
    })
  }

  askRemoveCategory(category: CategoryRequired){
    this.removeCategory(category);
  }

  removeCategory(category: CategoryRequired){
    let confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Tem certeza que deseja remover esta Categoria?"
      }
    })

    confirmDialog.afterClosed().subscribe( result => {
      if(result){
        this.categoryService.removeCategory(category.categoryId).subscribe({
          next: (response: any) => {
            this._snackBar.open("Categoria removida com sucesso!", "Ok", {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            })
            this.pageHandlerCategory.pageIndex = 0;
            this.getCategories();
          },
          error: (response: any) => {
            this._snackBar.open(response.error.message, "Ok", {
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
    let dialogRed = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      height: '200px',
    });

    dialogRed.afterClosed().subscribe( result => {
      if(result){
        this.pageHandlerCategory.pageIndex = 0;
        this.getCategories();
      }
      console.log("Result => ", result)
    })
  }
}
