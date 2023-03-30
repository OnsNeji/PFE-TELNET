import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-desc',
  templateUrl: './dialog-desc.component.html',
  styleUrls: ['./dialog-desc.component.scss']
})
export class DialogDescComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDescComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
