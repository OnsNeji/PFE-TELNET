import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-desc-demande',
  templateUrl: './dialog-desc-demande.component.html',
  styleUrls: ['./dialog-desc-demande.component.scss']
})
export class DialogDescDemandeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDescDemandeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
