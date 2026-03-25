import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
  formError: string = '';
  formSuccess: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component if needed
  }

 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  goBack(): void {
    this.router.navigate(['/dashboard']); 
  }


  goToSignIn(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']); 
  }


  doPasswordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }


  onSubmit(form: NgForm): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Validate form
    if (form.invalid) {
      this.formError = 'Please fill all required fields correctly';
      return;
    }

    // Validate passwords match
    if (!this.doPasswordsMatch()) {
      this.formError = 'Passwords do not match';
      return;
    }

    // Validate terms
    if (!this.user.terms) {
      this.formError = 'You must agree to the terms and conditions';
      return;
    }

    // Show success message
    this.formSuccess = 'Account created successfully!';
    console.log('Form submitted with data:', {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      institution: this.user.institution
    });

    // Reset form after successful submission
    setTimeout(() => {
      form.resetForm();
      this.formSuccess = '';
    }, 2000);
  }
}