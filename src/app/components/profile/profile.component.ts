import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/services/shared/user.service';
import { data } from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  id!: number;
  user: any ;
  imageUrl: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));

      this.userService.getUser(this.id).subscribe(data => {
        this.user = data;
        this.profileForm.patchValue(data);
      });
    });

    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      motDePasse: ['', Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')],
      matricule: ['', Validators.required],
      tel: ['', Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.profileForm.value.image  = this.user.image;
    if (this.profileForm.valid) {
    this.userService.editUser(this.id, this.profileForm.value).subscribe(()=>{
      window.location.reload();
    }
    );
  }
  }

  
  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imageUrl = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);

  // }
}
