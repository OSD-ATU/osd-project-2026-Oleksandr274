import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthCustomService } from '../../services/auth-custom.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
    imports: [MatSnackBarModule, MatInputModule, ReactiveFormsModule, FormsModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthCustomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private snackBar = inject(MatSnackBar);

  returnUrl: string = '';
  
  constructor(

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    const values = this.loginForm.value;
    console.log('submit with ');
    console.table(values);
    this.authService.login(this.email, this.password).
      subscribe({
        next: response => {
          console.log('user is logged in')
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err: Error) => {
          this.openErrorSnackBar('Incorrect email or password')
          console.log(err.message);
        }
      });

  }

  get email() {
    return this.loginForm.get('email')?.value;
  }
  get password() {
    return this.loginForm.get('password')?.value;
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000, // Set the duration for how long the snackbar should be visible (in milliseconds)
      panelClass: ['error-snackbar'], // You can define custom styles for the snackbar
    });
  }

}
