import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// CHANGE: Added User interface to define login data structure
interface User {
  email: string;
  password: string;
  keepSigned: boolean;
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  // CHANGE: Added FormGroup property to hold the reactive form
  loginForm!: FormGroup;
  
  // CHANGE: Added user data model
  user: User = {
    email: '',
    password: '',
    keepSigned: false
  };

  // CHANGE: Added password visibility toggle
  showPassword: boolean = false;
  
  // CHANGE: Added form validation messages
  formError: string = '';
  formSuccess: string = '';

  // CHANGE: Added FormBuilder and Router dependency injection
  constructor(private fb: FormBuilder, private router: Router) {}

  // CHANGE: Added ngOnInit lifecycle hook to initialize the form with validators
  ngOnInit() {
    // CHANGE: Created reactive form with validators for email format and password min 8 characters
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email format validation
      password: ['', [Validators.required, Validators.minLength(8)]], // Password min 8 characters
      keepSigned: [false]
    });
  }

  // CHANGE: Added togglePasswordVisibility method to show/hide password
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // CHANGE: Added goToSignUp method for navigation to register page
  goToSignUp(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  // CHANGE: Added goToForgotPassword method for navigation to forgot password page
  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  // CHANGE: Updated onSubmit() method with comprehensive form validation
  onSubmit(): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Check if email or password are empty/invalid
    const emailValue = this.user.email?.trim();
    const passwordValue = this.user.password?.trim();

    // Validate email is not empty and is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailValue && emailRegex.test(emailValue);

    // Validate password is not empty and has minimum 8 characters
    const isPasswordValid = passwordValue && passwordValue.length >= 8;

    // Show error if email or password is invalid
    if (!isEmailValid && !isPasswordValid) {
      this.formError = 'Please fill all required fields';
      return;
    } else if (!isEmailValid) {
      this.formError = 'Please enter a valid email';
      return;
    } else if (!isPasswordValid) {
      this.formError = 'Password must be at least 8 characters long';
      return;
    }

    // Show success message - Account logged in successfully
    this.formSuccess = 'Account logged in successfully!';
    console.log('Login submitted with data:', {
      email: this.user.email,
      keepSigned: this.user.keepSigned
    });

    // Navigate to home page after successful login
    setTimeout(() => {
      this.router.navigate(['/home']);
      this.user = { email: '', password: '', keepSigned: false };
      this.formSuccess = '';
    }, 1500);
  }
}
