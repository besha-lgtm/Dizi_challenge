import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  loginForm!: FormGroup;
  
  user: User = {
    email: '',
    password: '',
    keepSigned: false
  };

  showPassword: boolean = false;
  isLoading: boolean = false;
  formError: string = '';
  formSuccess: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      keepSigned: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToSignUp(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

  onSubmit(): void {
    this.formError = '';
    this.formSuccess = '';

    const emailValue = this.user.email?.trim();
    const passwordValue = this.user.password?.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailValue && emailRegex.test(emailValue);
    const isPasswordValid = passwordValue && passwordValue.length >= 8;

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

    this.isLoading = true;

    this.authService.login(emailValue, passwordValue).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.formSuccess = 'Account logged in successfully!';
          setTimeout(() => {
            const redirectUrl = this.authService.isAdmin() ? '/home' : '/challenges';
            this.router.navigate([redirectUrl]);
            this.user = { email: '', password: '', keepSigned: false };
            this.formSuccess = '';
          }, 1000);
        } else {
          this.formError = res.message || 'Login failed. Please check your credentials.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        this.formError = err.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}
