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
    // Clear any stored user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Close menus
    if (this.menuOpen) {
      this.toggleMenu();
    }
    if (this.profileDropdownOpen) {
      this.closeProfileDropdown();
    }

    // Navigate to home
    this.router.navigate(['/login']);
  }

  // Close profile dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const profileElement = document.querySelector('.profile-container');
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileElement && !profileElement.contains(event.target as Node) && 
        profileDropdown && !profileDropdown.contains(event.target as Node)) {
      this.closeProfileDropdown();
    }
  }
}
