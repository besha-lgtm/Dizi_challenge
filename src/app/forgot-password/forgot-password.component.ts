import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ForgotPasswordData {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordData: ForgotPasswordData = {
    email: ''
  };

  formError: string = '';
  formSuccess: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  // Navigate back to login page
  goBackToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

  // Submit forgot password form
  onSubmit(): void {
    this.formError = '';
    this.formSuccess = '';

    const emailValue = this.forgotPasswordData.email?.trim();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailValue && emailRegex.test(emailValue);

    if (!isEmailValid) {
      this.formError = 'Please enter a valid email address';
      return;
    }

    // Simulate API call
    this.isLoading = true;
    this.formSuccess = 'Password reset link sent to your email. Check your inbox!';

    setTimeout(() => {
      this.isLoading = false;
      // Reset form
      this.forgotPasswordData.email = '';
      // Redirect to login after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 1500);
  }
}
