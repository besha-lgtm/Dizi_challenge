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

  // CHANGE: Updated onSubmit() method with comprehensive form validation
  onSubmit(): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Validate form
    if (this.loginForm.invalid) {
      // Check specific validation errors
      const emailControl = this.loginForm.get('email');
      const passwordControl = this.loginForm.get('password');

      if (emailControl?.hasError('required') || passwordControl?.hasError('required')) {
        this.formError = 'Please fill all required fields';
      } else if (emailControl?.hasError('email')) {
        this.formError = 'Please enter a valid email format';
      } else if (passwordControl?.hasError('minlength')) {
        this.formError = 'Password must be at least 8 characters long';
      }
      return;
    }

    // Show success message - Account logged in successfully
    this.formSuccess = 'Account logged in successfully!';
    console.log('Login submitted with data:', {
      email: this.user.email,
      keepSigned: this.user.keepSigned
    });

    // Reset form after successful submission
    setTimeout(() => {
      this.loginForm.reset();
      this.formSuccess = '';
      // CHANGE: Navigate to dashboard after successful login
      // this.router.navigate(['/rewards']);
    }, 2000);
  }
}
