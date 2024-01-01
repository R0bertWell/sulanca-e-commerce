import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Color } from '../../product-screen/models/product-info.model';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ColorService } from '../services/color.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-color-dialog',
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.scss']
})
export class ColorDialogComponent {
  colorNameControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  colorHexControl: FormControl = new FormControl('#ffffff', [Validators.required])

  form!: FormGroup;
  options: FormlyFormOptions = {};
  fields!: FormlyFieldConfig[];
  color_data: Color;

  action: string = 'add'

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ColorDialogComponent>,
    private _snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Color
  ) {
    if(data){
      this.action = 'edit';
      this.color_data = {...data};
      this.colorNameControl.setValue(data.colorName);
      this.colorHexControl.setValue(data.colorHex);
    } else {
      this.color_data = new Color({} as Color);
      this.color_data.colorHex = '#ffffff';
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(this.options);

    this.fields = [
      {
        key: "colorName",
        props: {
          pattern: '^\S+$'
        },
        formControl: this.colorNameControl
      },
      {
        key: "colorHex",
        formControl: this.colorHexControl
      }
    ]

    this.colorNameControl.valueChanges
    .subscribe( value => {
    })
  }

  save(){
    console.log("Form => ", this.form.value)
    console.log("Valid => ", this.form.valid)


    if(this.validateFields()){
      this.colorService.saveColor(this.color_data).subscribe({
        next: (response: any) => {
          this._snackBar.open("Cor salva com sucesso!", "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })

          this.dialogRef.close(true);
        },
        error: (error: any) => {
          this._snackBar.open(error, "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })
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
    if(this.colorNameControl.value == null ||
      (this.colorNameControl.value != null && this.colorNameControl.value.trim() == ''))
    {
      this.colorNameControl.setValue('', {emitEvent: false});
      this.colorNameControl.setErrors(Validators.required);
      this.colorNameControl.markAsTouched();
      isValid = false;
    }

    if(this.colorHexControl.value == null)
    {
      this.colorHexControl.setErrors(Validators.required);
      this.colorHexControl.markAsTouched();
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
