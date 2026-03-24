import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { AuthCustomService } from '../../services/auth-custom.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule, MatRadioModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthCustomService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phonenumber: ['', [Validators.required, Validators.pattern('^\\+(353)\\d{9}$') ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['',],
      dob: [null, [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(4) ]],
    })
  }

  onSubmit() {
    console.log('forms submitted with ');
    console.table(this.userForm.value);

    this.createNew(this.userForm.value as User);
  }

  createNew(formValues: User) {
    console.log({ ...formValues })
    console.log(formValues);

    this.userService.createUser({ ...formValues })
      .subscribe({
        next: response => {
          let message = "User has been created";

          this.logoutPreviousUser(); // log out any user that was logged in before          

          this.authenticateUser(formValues.email, formValues.password) // authenticate registered user

          this.openSuccessSnackBar(message);
          this.router.navigateByUrl('/');
        },
        error: (err: Error) => {
          console.log(err.message);
          this.openErrorSnackBar(err.message);
          // this.message = err
        }
      })
  }

  private logoutPreviousUser(){
    this.authService.logout()
  }

  private authenticateUser(email: string, password: string){
    this.authService.login(email, password).
      subscribe({
        next: response => {
          console.log('user authenticated')
        },
        error: (err: Error) => {
          this.openErrorSnackBar('Incorrect email or password')
          console.log(err.message);
        }

      });
  }

  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get phonenumber() {
    return this.userForm.get('phonenumber');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }
   get role() {
    return this.userForm.get('role');
  }
  get dob() {
    return this.userForm.get('dob');
  }
  get address() {
    return this.userForm.get('address');
  }



  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,
    });
  }

  openSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 15000,
    });
  }


}
