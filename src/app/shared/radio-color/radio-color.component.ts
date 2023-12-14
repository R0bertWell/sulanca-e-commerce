import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColorRequired } from 'src/app/core/screens/forms/color-screen/models/color.model';

@Component({
  selector: 'app-radio-color',
  templateUrl: './radio-color.component.html',
  styleUrls: ['./radio-color.component.scss']
})
export class RadioColorComponent {
  colorPicker: any;
  @Input() colorArray: ColorRequired[] = [];
  @Input() formControl: FormControl = new FormControl('');

  constructor(){
    console.log("Color array =>", this.colorArray)
  }
}
