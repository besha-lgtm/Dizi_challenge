import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  formError: string = '';
  formSuccess: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goBack(): void {
    this.router.navigate(['/login']); 
  }

  goToSignIn(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']); 
  }

  doPasswordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  onSubmit(form: NgForm): void {
    this.formError = '';
    this.formSuccess = '';

    if (form.invalid) {
      this.formError = 'Please fill all required fields correctly';
      return;
    }

    if (!this.doPasswordsMatch()) {
      this.formError = 'Passwords do not match';
      return;
    }

    if (!this.user.terms) {
      this.formError = 'You must agree to the terms and conditions';
      return;
    }

    this.isLoading = true;

    const payload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      institution: this.user.institution,
      password: this.user.password
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.formSuccess = 'Account created successfully! Please sign in.';
          setTimeout(() => {
            form.resetForm();
            this.formSuccess = '';
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.formError = res.message || 'Registration failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        this.formError = err.error?.message || 'An error occurred during registration. Please try again.';
      }
    });
  }
}