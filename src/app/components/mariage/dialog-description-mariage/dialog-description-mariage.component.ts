import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-description-mariage',
  templateUrl: './dialog-description-mariage.component.html',
  styleUrls: ['./dialog-description-mariage.component.scss']
})
export class DialogDescriptionMariageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDescriptionMariageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
