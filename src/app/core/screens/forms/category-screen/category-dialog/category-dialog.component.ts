import { Component, Inject, Optional } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
  categoryNameControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(10)]);
  nrOrderControl: FormControl = new FormControl(1, [Validators.required, Validators.maxLength(12)]);

  form!: FormGroup;
  options: FormlyFormOptions = {};
  fields!: FormlyFieldConfig[];
  category_data: Category;

  action: string = 'add'

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    private _snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    if(data){
      this.action = 'edit';
      this.category_data = {...data};
      this.categoryNameControl.setValue(data.categoryName);
    } else {
      this.category_data = new Category({} as Category);
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(this.options);

    this.fields = [
      {
        key: "categoryName",
        props: {
          pattern: '^\S+$'
        },
        formControl: this.categoryNameControl
      },
      {
        key: "nrOrder",
        formControl: this.nrOrderControl
      },
    ]

    this.categoryNameControl.valueChanges
    .subscribe( value => {
    })
  }

  save(){
    console.log("Form => ", this.form.value)
    console.log("Valid => ", this.form.valid)


    if(this.validateFields()){
      console.log("Category data => ", this.category_data)
      this.categoryService.saveCategory(this.category_data).subscribe({
        next: (response: any) => {
          this._snackBar.open("Categoria salva com sucesso!", "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })

          this.dialogRef.close(true);
        },
        error: (response: any) => {
          this._snackBar.open(response.error.message, "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })
          console.log("Sucesso => ERR ", response)
        }
      })
    } else {
      this._snackBar.open("Informe os campos obrigatórios!", "Ok", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    }
  }

  validateFields(): boolean{
    let isValid = true;
    if(this.categoryNameControl.value == null ||
      (this.categoryNameControl.value != null && this.categoryNameControl.value.trim() == ''))
    {
      this.categoryNameControl.setValue('', {emitEvent: false});
      this.categoryNameControl.setErrors(Validators.required);
      this.categoryNameControl.markAsTouched();
      isValid = false;
    }

    return isValid;
  }

  cancel(){
    this.dialogRef.close(false);
  }

  onInput(formControl: FormControl){
    const inputValue = formControl.value;

    const pattern = /^[^\d\s+\-*/]+$/;
    const isValid = pattern.test(inputValue);
    console.log("Valud => ", isValid)
    console.log("Input value => ", inputValue)
    if(!isValid){
      formControl.setValue('');
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    if (key === '-' || key === 'Minus' || key === '+' || key === 'Plus') {
      event.preventDefault();
    }
  }
}
