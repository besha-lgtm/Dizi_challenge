import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuOpen = false;
  profileDropdownOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.profileDropdownOpen = false;
    }
    if (this.menuOpen) {
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
  }

  toggleProfileDropdown(): void {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  onProfileClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleProfileDropdown();
  }

  closeProfileDropdown(): void {
    this.profileDropdownOpen = false;
  }

  goToHome(): void {
    const redirectUrl = this.authService.isAdmin() ? '/home' : '/challenges';
    this.router.navigate([redirectUrl]);
    if (this.menuOpen) {
      this.toggleMenu();
    }
    if (this.profileDropdownOpen) {
      this.closeProfileDropdown();
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getInitials(): string {
    return this.authService.getInitials();
  }

  signOut(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
      document.body.classList.remove('overlay-active');
    }
    if (this.profileDropdownOpen) {
      this.profileDropdownOpen = false;
    }

    this.authService.logout();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const profileContainer = document.querySelector('.profile-container');
    const target = event.target as HTMLElement;
    
    if (profileContainer && !profileContainer.contains(target)) {
      this.profileDropdownOpen = false;
    }
  }
}
