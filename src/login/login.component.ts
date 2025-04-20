import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {

  isLogin: boolean = true;
  signupForm: FormGroup;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  isOtpVerification: boolean = false;
  receivedOtp: any;
  showOtpScreen = false;
  userRegisteredData: any;
  showPassword = false;
  isForgotPassword: boolean = false;
  resendAvailable = false;
  resendCountdown = 20;
  private timerSubscription: Subscription | null = null;
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder, private router: Router, private toast: ToastrService, private http: HttpClient) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dob: ['', Validators.required],
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.forgotPasswordForm = this.fb.group({
      femail: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp5: ['', [Validators.required, Validators.pattern('[0-9]')]],
      otp6: ['', [Validators.required, Validators.pattern('[0-9]')]],
      // otp: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });
    this.startResendTimer();

    // localStorage.removeItem('users');
  }

  preventCopyPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  get s(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  get l(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  get p(): { [key: string]: AbstractControl } {
    return this.forgotPasswordForm.controls;
  }
  get o(): { [key: string]: AbstractControl } {
    return this.otpForm.controls;
  }

  toggleForm(isLogin: boolean) {
    // if (isLogin) {
    //   this.signupForm.reset();
    // }
    // else {
    //   this.loginForm.reset();
    // }
    this.isLogin = isLogin;
    this.isForgotPassword = false;
    this.showOtpScreen = false;
  }

  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  islogPasswordVisible: boolean = false;
  togglelogPasswordVisibility() {
    this.islogPasswordVisible = !this.islogPasswordVisible;
  }

  // onSubmit() {
  //   if (this.signupForm.valid) {
  //     this.toast.success('Register Successfully!');
  //     this.toggleForm(true);
  //     this.loginForm.get('email')?.setValue(this.signupForm.value.email);
  //     this.loginForm.get('password')?.setValue(this.signupForm.value.password);
  //     this.signupForm.reset();
  //     this.isPasswordVisible = false;
  //   } else {
  //     this.signupForm.markAllAsTouched();
  //   }
  // }

  // onSubmitLogin() {
  //   if (this.loginForm.valid) {
  //     this.loginForm.reset();
  //     this.islogPasswordVisible = false;
  //     this.toast.success('Login Successfully!');
  //     this.router.navigateByUrl('product-list');
  //   } else {
  //     this.loginForm.markAllAsTouched();
  //   }
  // }

  onSubmit() {
    if (this.signupForm.valid) {
      // this.http.post('/api/register', this.signupForm.value).subscribe({
      //   next: (res: any) => {
      this.toast.success('OTP sent to your email!');
      // this.userRegisteredData = res; // Save for verification
      // this.isOtpVerification = true;
      this.showOtpScreen = true;
      this.startResendTimer();
      // },
      // error: (err) => {
      //   this.toast.error('Registration failed!');
      // }
      // });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  autoFocusNext(event: any, index: number) {
    const value = event.target.value;
    if (value.length === 1 && index < 6) {
      const nextInput = this.otpInputs.get(index);
      if (nextInput) nextInput.nativeElement.focus();
    }
  }

  onSubmitOtp() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      console.log('Entered OTP:', otp);
      const enteredOtp = this.otpForm.value.otp;
      if (enteredOtp === this.receivedOtp) {
        this.toast.success('Registration Successful!');
        this.showOtpScreen = false;
        this.toggleForm(true);
        this.loginForm.get('email')?.setValue(this.signupForm.value.email);
        this.loginForm.get('password')?.setValue(this.signupForm.value.password);
        this.signupForm.reset();
        this.otpForm.reset();
      } else {
        this.toast.error('Incorrect OTP. Please try again.');
      }
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  resendOtp() {
    this.receivedOtp = '123456'; // Or generate a new one
    this.toast.info('OTP resent successfully!');
    this.startResendTimer();

  }


  // onVerifyOtp() {
  //   if (this.otpForm.valid) {
  //     const payload = {
  //       email: this.signupForm.value.email,
  //       otp: this.otpForm.value.otp
  //     };
  //     this.http.post('/api/verify-otp', payload).subscribe({
  //       next: (res: any) => {
  //         this.toast.success('OTP verified! Registration complete.');

  //         // Auto-fill login and show login screen
  //         this.toggleForm(true);
  //         this.loginForm.get('email')?.setValue(this.signupForm.value.email);
  //         this.loginForm.get('password')?.setValue(this.signupForm.value.password);

  //         this.signupForm.reset();
  //         this.otpForm.reset();
  //         this.isOtpVerification = false;
  //       },
  //       error: (err) => {
  //         this.toast.error('Invalid OTP. Try again.');
  //       }
  //     });
  //   } else {
  //     this.otpForm.markAllAsTouched();
  //   }
  // }

  // resendOtp() {
  //   const email = this.signupForm.value.email;
  //   this.http.post('/api/resend-otp', { email }).subscribe({
  //     next: (res: any) => {
  //       this.toast.success('OTP resent to your email!');
  //     },
  //     error: () => {
  //       this.toast.error('Failed to resend OTP.');
  //     }
  //   });
  // }

  // onSubmit() {
  //   if (this.signupForm.valid) {
  //     // Get the entire form data (all fields)
  //     const userData = this.signupForm.value;

  //     // Retrieve the existing users from local storage or initialize an empty array
  //     let users = JSON.parse(localStorage.getItem('users') || '[]');

  //     if (users.some((user: any) => user.email === userData.email)) {
  //       this.toast.error('Email already registered. Please log in.');
  //       return;
  //     }

  //     // Add the new user data to the list of users
  //     users.push(userData);

  //     // Store the updated users array back into local storage
  //     localStorage.setItem('users', JSON.stringify(users));

  //     this.toast.success('Register Successfully!');
  //     this.toggleForm(true);
  //     this.loginForm.get('email')?.setValue(this.signupForm.value.email);
  //     this.loginForm.get('password')?.setValue(this.signupForm.value.password);
  //     this.signupForm.reset();
  //     this.isPasswordVisible = false;
  //   } else {
  //     this.signupForm.markAllAsTouched();
  //   }
  // }


  onSubmitLogin() {
    if (this.loginForm.valid) {
      // Retrieve users from local storage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Find a user that matches the entered email and password
      const user = users.find(
        (user: { email: string; password: string }) =>
          user.email === this.loginForm.value.email &&
          user.password === this.loginForm.value.password
      );
      console.log('user: ', user);


      if (user) {
        localStorage.setItem('username', user.email);
        localStorage.setItem('pass', user.password);
        this.toast.success('Login Successfully!');
        this.loginForm.reset();
        this.islogPasswordVisible = false;
        this.router.navigateByUrl('product-list');
      } else {
        this.toast.error('Invalid email or password!');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }



  // Handle forgot password form submission
  onSubmitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.toast.success('Reset Link Successfully sent to your Mail ID!');
      this.forgotPasswordForm.reset();
      this.isLogin = true;
      this.isForgotPassword = false;
    }
  }

  // Show the forgot password form
  showForgotPasswordForm() {
    this.isLogin = false;
    this.isForgotPassword = true;
  }

  // Show the login form again
  backToLogin() {
    this.isLogin = true;
    this.isForgotPassword = false;
  }


  startResendTimer() {
    this.resendAvailable = false;
    this.resendCountdown = 20;

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    const timer = interval(1000);
    this.timerSubscription = timer.subscribe((count) => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0 && this.timerSubscription) {
        this.resendAvailable = true;
        this.timerSubscription.unsubscribe();
      }
    });
  }

}
