import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/shared';

@Component({
  selector: 'app-expiration-session',
  templateUrl: './expiration-session.component.html',
  styleUrls: []
})

export class ExpirationSessionComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ExpirationSessionComponent>,
    private router: Router,
    private authService: AuthenticationService  ) { }

  ngOnInit() {
    // do nothing
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.dialogRef.close();
  }

}
