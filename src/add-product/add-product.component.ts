import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private shared: SharedService, private router: Router) {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      quantity: ['', Validators.required],
      imageUrl: ['', Validators.required],
      fileName: [''],
      wishlistCount: [0] 
    })
  }
  get formControls(){
    return this.productForm.controls
  }

  ngOnInit() {
    this.getAllData();
  }
  tabelArray: any[] = []
  getAllData() {
    let getData = localStorage.getItem('key');
    if (getData) {
      this.tabelArray = JSON.parse(getData);
    } else {
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productForm.patchValue({
          imageUrl: reader.result,
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  }


  submit() {
    if(this.productForm.invalid){
      this.productForm.markAllAsTouched()
    }
    if (this.productForm.valid) {
      if (this.productForm.value.id == '') {

        const newProduct = this.productForm.value;
        const storedData = localStorage.getItem('key');
        let existingProducts: any[] = [];

        if (storedData) {
          existingProducts = JSON.parse(storedData);
          let string = JSON.stringify(existingProducts)
          localStorage.setItem('key', string)
        }

        const newId = existingProducts.length > 0 ? Math.max(...existingProducts.map((product: any) => product.id || 0)) + 1 : 1;
        newProduct.id = newId;

        existingProducts.push(newProduct);
        this.shared.setDate(existingProducts);
        this.productForm.reset();
        this.productForm.get('fileName')?.setValue('')
        this.getAllData();
      } else {
        const storedData = localStorage.getItem('key');
        let existingProducts: any[] = [];

        if (storedData) {
          existingProducts = JSON.parse(storedData);
          const index = existingProducts.findIndex(product => product.id === this.productForm.value.id);
          if (index !== -1) {
            existingProducts[index] = { ...existingProducts[index], ...this.productForm.value };
            localStorage.setItem('key', JSON.stringify(existingProducts));
            this.productForm.reset();
            this.productForm.get('fileName')?.setValue('')
            this.getAllData();
          }
        }
      }
    } else{
      // alert('Kindly Fill the inputs')
    }
  }

  back() {
    this.router.navigateByUrl('product-list')
  }

  edit(data: any) {
    this.productForm.patchValue(data)
  }

  delete(data: any) {
    this.tabelArray = this.tabelArray.filter(item => item !== data);
    let string = JSON.stringify(this.tabelArray)
    localStorage.setItem("key", string)
  }
}

