import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })

  }
  ngOnInit() {
    // localStorage.removeItem('username');
    // localStorage.removeItem('pass')
  }

  getLogin() {

    if (this.loginForm.valid) {
      let username = localStorage.getItem('username')
      let password = localStorage.getItem('pass')
      if (username == null && password == null) {
        localStorage.setItem('username', this.loginForm.value.userName)
        localStorage.setItem('pass', this.loginForm.value.password)
        this.router.navigateByUrl('product-list')
      } else {
        if (username == this.loginForm.value.userName && password == this.loginForm.value.password) {
          this.router.navigateByUrl('product-list')
          localStorage.setItem('username', this.loginForm.value.userName)
          localStorage.setItem('pass', this.loginForm.value.password)
        } else {
          alert("Check Username and password")
        }
      }
    } else{
      alert("PLease Fill the Details")
    }

  }
}
