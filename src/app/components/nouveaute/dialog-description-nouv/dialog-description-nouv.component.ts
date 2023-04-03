import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-description-nouv',
  templateUrl: './dialog-description-nouv.component.html',
  styleUrls: ['./dialog-description-nouv.component.scss']
})
export class DialogDescriptionNouvComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDescriptionNouvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
