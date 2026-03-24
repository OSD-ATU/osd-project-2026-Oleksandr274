import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule, MatRadioModule, MatSelectModule,],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      images: this.fb.array([]),
      category: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]],
      brand: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
    })
  }

  onSubmit() {
    console.log('forms submitted with ');
    console.table(this.productForm.value);

    this.createNew(this.productForm.value as Product);
  }

  createNew(formValues: Product) {
    console.log({ ...formValues })
    console.log(formValues);

    this.productService.createProduct({ ...formValues })
      .subscribe({
        next: response => {
          let message = "Product has been created";
          this.openSuccessSnackBar(message);
          this.router.navigateByUrl('/products');
        },
        error: (err: Error) => {
          console.log(err.message);
          this.openErrorSnackBar(err.message);
          // this.message = err
        }
      })
  }

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }
  get title() {
    return this.productForm.get('title');
  }
  get category() {
    return this.productForm.get('category');
  }
  get price() {
    return this.productForm.get('price');
  }
  get brand() {
    return this.productForm.get('brand');
  }

  addImage(): void {
    const imageControl = this.fb.control('');
    this.images.push(imageControl);
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
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
