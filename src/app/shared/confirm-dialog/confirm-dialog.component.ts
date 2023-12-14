import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  message: string = 'Mensagem padrão'
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {
    if(data){
      this.message = data.message || this.message;

      if(data.invertButtons){
        
      }
    }
  }

  confirmClick(){
    this.dialogRef.close(true)
  }

  cancelClick(){
    this.dialogRef.close(false)
  }
}
