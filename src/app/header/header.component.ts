import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuOpen = false;
  profileDropdownOpen = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    // Close profile dropdown when menu opens
    if (this.menuOpen) {
      this.profileDropdownOpen = false;
    }
    // Prevent body scroll when overlay is open
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
    this.router.navigate(['/home']);
    // Close menu if open
    if (this.menuOpen) {
      this.toggleMenu();
    }
    // Close profile dropdown if open
    if (this.profileDropdownOpen) {
      this.closeProfileDropdown();
    }
  }

  signOut(): void {
    // Close menus immediately
    if (this.menuOpen) {
      this.menuOpen = false;
      document.body.classList.remove('overlay-active');
    }
    if (this.profileDropdownOpen) {
      this.profileDropdownOpen = false;
    }

    // Clear any stored user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');

    // Navigate to login with a slight delay to ensure UI updates
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  // Close profile dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const profileContainer = document.querySelector('.profile-container');
    const target = event.target as HTMLElement;
    
    // If click is outside the profile container, close dropdown
    if (profileContainer && !profileContainer.contains(target)) {
      this.profileDropdownOpen = false;
    }
  }
}
