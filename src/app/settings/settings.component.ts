import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  newChallenges: boolean;
  evaluationUpdates: boolean;
  newsletter: boolean;
  language: string;
  twoFactorAuth: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  // User Info
  userName: string = 'Rohan Varma';
  userEmail: string = 'rohan.varma@example.com';
  joinDate: string = '2024-01-15';

  // Edit state
  editingName: boolean = false;
  originalUserName: string = 'Rohan Varma';

  // Settings
  settings: UserSettings = {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newChallenges: true,
    evaluationUpdates: true,
    newsletter: false,
    language: 'en',
    twoFactorAuth: false
  };

  // Password change
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  passwordSuccess: string = '';
  passwordErrors: { [key: string]: string } = {};

  // Active section
  activeSection: 'account' | 'notifications' | 'security' | 'preferences' = 'account';

  // Password visibility
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}

  // Section Navigation
  setActiveSection(section: 'account' | 'notifications' | 'security' | 'preferences'): void {
    this.activeSection = section;
    this.clearPasswordForm();
  }

  // Password Management
  changePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';
    this.passwordErrors = {};

    // Validation
    const errors: { [key: string]: string } = {};

    // Current password validation
    if (!this.currentPassword.trim()) {
      errors['currentPassword'] = 'Current password is required';
    }

    // New password validation
    if (!this.newPassword.trim()) {
      errors['newPassword'] = 'New password is required';
    } else if (this.newPassword.length < 8) {
      errors['newPassword'] = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(this.newPassword)) {
      errors['newPassword'] = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(this.newPassword)) {
      errors['newPassword'] = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(this.newPassword)) {
      errors['newPassword'] = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.newPassword)) {
      errors['newPassword'] = 'Password must contain at least one special character (!@#$%^&*, etc.)';
    }

    // Confirm password validation
    if (!this.confirmPassword.trim()) {
      errors['confirmPassword'] = 'Please confirm your password';
    } else if (this.newPassword !== this.confirmPassword) {
      errors['confirmPassword'] = 'Passwords do not match';
    }

    // Check if current password is same as new password
    if (this.currentPassword && this.newPassword && this.currentPassword === this.newPassword) {
      errors['newPassword'] = 'New password must be different from current password';
    }

    // If there are any errors, store them and display first error
    if (Object.keys(errors).length > 0) {
      this.passwordErrors = errors;
      this.passwordError = Object.values(errors)[0]; // Show first error
      return;
    }

    // Prepare payload for backend
    const passwordChangePayload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    // Log payload for backend integration
    console.log('Password change payload:', passwordChangePayload);

    // Simulate API call
    this.simulatePasswordChange(passwordChangePayload);
  }

  private simulatePasswordChange(payload: any): void {
    // In a real app, this would make an HTTP call to the backend
    // Example: this.http.post('/api/auth/change-password', payload)
    
    console.log('Sending to backend:', payload);
    
    // Simulate successful response
    this.passwordSuccess = 'Password changed successfully!';
    this.clearPasswordForm();

    // Clear success message after 3 seconds
    setTimeout(() => {
      this.passwordSuccess = '';
    }, 3000);
  }

  clearPasswordForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
  }

  // Toggle notifications
  toggleNotification(setting: keyof UserSettings): void {
    if (typeof this.settings[setting] === 'boolean') {
      (this.settings[setting] as boolean) = !(this.settings[setting] as boolean);
    }
  }

  // Save settings
  saveSettings(): void {
    // Simulate API call
    console.log('Settings saved:', this.settings);
    alert('Notification settings saved successfully!');
  }

  // Logout
  logout(): void {
    console.log('Logging out...');
    // In a real app, this would clear auth tokens and redirect to login
    alert('You have been logged out successfully!');
  }

  // Delete account
  deleteAccount(): void {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your data, certificates, and submissions will be permanently deleted.'
    );
    
    if (confirmed) {
      console.log('Account deleted');
      alert('Your account has been deleted successfully');
      // Redirect to login or home
    }
  }

  // Get joined date formatted
  getFormattedJoinDate(): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(this.joinDate).toLocaleDateString('en-US', options);
  }

  // Password requirement checkers for template
  hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  hasSpecialChar(): boolean {
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    return specialCharRegex.test(this.newPassword);
  }

  // Check if passwords match for live feedback
  doPasswordsMatch(): boolean {
    return !!(this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword);
  }

  // Name editing methods
  toggleEditName(): void {
    if (this.editingName) {
      // If currently editing, save the changes
      this.saveNameChange();
    } else {
      // Start editing
      this.editingName = true;
      this.originalUserName = this.userName;
    }
  }

  saveNameChange(): void {
    if (!this.userName.trim()) {
      alert('Name cannot be empty');
      return;
    }
    
    // Simulate API call to update name
    console.log('Name updated to:', this.userName);
    alert('Name updated successfully!');
    this.editingName = false;
  }

  cancelEditName(): void {
    this.userName = this.originalUserName;
    this.editingName = false;
  }

  signOut(): void {
    // Clear any stored user data/tokens
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
