import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent {
  loginForm!: FormGroup;
  signIn: boolean = true;
  loading = false;
  submitted = false;
  returnUrl: string = '';
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private _snackBar: MatSnackBar,
      private authenticationService: AuthenticationService
  ) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
          this.router.navigate([''], {skipLocationChange: true});
      }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      // get return url from route parameters or default to '/home'
      console.log("This route => ", this.route)
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  // convenience getter for easy access to form fields
  get f() {
      return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    if(this.signIn){
      this.authenticationService.login(this.f['username'].value, this.f['password'].value).subscribe({
        next: (response: any) => {
          console.log("Return url => ", this.returnUrl)
          window.scrollTo({ top: 0, behavior: 'smooth' });
          //this.router.navigate([this.returnUrl || '/product-list'], {skipLocationChange: true});
          // this.router.navigate([this.returnUrl]);
          this.authenticationService.setUserName(this.f['username'].value);
          window.location.reload();
        },
        error: (response: any) => {
          console.log("Error => ", response)
            this.error = response;
            this.loading = false;
        }
      });
    } else {
      this.authenticationService.signUp(this.f['username'].value, this.f['password'].value).subscribe({
        next: (response: any) => {
          console.log("Responsed => ", response)
          this._snackBar.open(`Usuário '${response.username}' cadastrado com sucesso!`, "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })
          this.loading = false;
          this.signIn = true;

        },
        error: (response: any) => {
          console.log("Error => ", response)
            this.error = response;
            this.loading = false;
        }
      });
    }
  }

  signUp(signUp: boolean) {
    this.signIn = !signUp;
    this.error = '';
  }
}
