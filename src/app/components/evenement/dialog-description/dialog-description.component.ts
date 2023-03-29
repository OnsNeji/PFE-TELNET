import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-description',
  templateUrl: './dialog-description.component.html',
  styleUrls: ['./dialog-description.component.scss']
})
export class DialogDescriptionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
