import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPasswordData: ResetPasswordData = {
    newPassword: '',
    confirmPassword: ''
  };

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  formError: string = '';
  formSuccess: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  // Toggle new password visibility
  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Navigate back to login page
  goBackToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

  // Validate password strength
  private validatePasswordStrength(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  }

  // Check if passwords match
  doPasswordsMatch(): boolean {
    const newPassword = this.resetPasswordData.newPassword?.trim();
    const confirmPassword = this.resetPasswordData.confirmPassword?.trim();
    
    if (!newPassword || !confirmPassword) {
      return false;
    }
    
    return newPassword === confirmPassword;
  }

  // Submit reset password form
  onSubmit(): void {
    this.formError = '';
    this.formSuccess = '';

    const newPasswordValue = this.resetPasswordData.newPassword?.trim();
    const confirmPasswordValue = this.resetPasswordData.confirmPassword?.trim();

    // Validate new password is not empty
    if (!newPasswordValue) {
      this.formError = 'New password is required';
      return;
    }

    // Validate confirm password is not empty
    if (!confirmPasswordValue) {
      this.formError = 'Please confirm your password';
      return;
    }

    // Validate password strength
    if (!this.validatePasswordStrength(newPasswordValue)) {
      this.formError = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      return;
    }

    // Validate passwords match
    if (!this.doPasswordsMatch()) {
      this.formError = 'New password and confirm password must be the same';
      return;
    }

    // Simulate API call
    this.isLoading = true;
    this.formSuccess = 'Password reset successfully! Redirecting to login...';

    setTimeout(() => {
      this.isLoading = false;
      // Reset form
      this.resetPasswordData.newPassword = '';
      this.resetPasswordData.confirmPassword = '';
      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }, 1500);
  }
}
