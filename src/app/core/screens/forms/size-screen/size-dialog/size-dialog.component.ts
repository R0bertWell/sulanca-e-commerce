import { Component, Inject, Optional } from '@angular/core';
import { SizeService } from '../services/size.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Size } from '../models/size.model';

@Component({
  selector: 'app-size-dialog',
  templateUrl: './size-dialog.component.html',
  styleUrls: ['./size-dialog.component.scss']
})
export class SizeDialogComponent {
  sizeNameControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(10)]);

  form!: FormGroup;
  options: FormlyFormOptions = {};
  fields!: FormlyFieldConfig[];
  size_data: Size;

  action: string = 'add'

  constructor(
    private sizeService: SizeService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SizeDialogComponent>,
    private _snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Size
  ) {
    if(data){
      this.action = 'edit';
      this.size_data = {...data};
      this.sizeNameControl.setValue(data.sizeName);
    } else {
      this.size_data = new Size({} as Size);
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(this.options);

    this.fields = [
      {
        key: "sizeName",
        props: {
          pattern: '^\S+$'
        },
        formControl: this.sizeNameControl
      }
    ]

    this.sizeNameControl.valueChanges
    .subscribe( value => {
    })
  }

  save(){
    console.log("Form => ", this.form.value)
    console.log("Valid => ", this.form.valid)


    if(this.validateFields()){
      console.log("Size data => ", this.size_data)
      this.sizeService.saveSize(this.size_data).subscribe({
        next: (response: any) => {
          this._snackBar.open("Tamanho salvo com sucesso!", "Ok", {
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
    if(this.sizeNameControl.value == null ||
      (this.sizeNameControl.value != null && this.sizeNameControl.value.trim() == ''))
    {
      this.sizeNameControl.setValue('', {emitEvent: false});
      this.sizeNameControl.setErrors(Validators.required);
      this.sizeNameControl.markAsTouched();
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
