import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/services/shared/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  id!: number;
  user: any ;

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
        this.profileForm.patchValue({
          nom: this.user.nom,
          prenom: this.user.prenom,
          email: this.user.email,
          motDePasse: this.user.motDePasse,
          matricule: this.user.matricule,
          tel: this.user.tel,
          role: this.user.role,
          image: this.user.image
        });
      });
    });

    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required, Validators.minLength(6)],
      matricule: ['', Validators.required],
      tel: ['', Validators.required, Validators.minLength(8)],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.userService.editUser(this.id, this.profileForm.value).subscribe(()=>{
      window.location.reload();
    }
    );
  }


}
