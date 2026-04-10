import { Component } from '@angular/core';
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

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    // Prevent body scroll when overlay is open
    if (this.menuOpen) {
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
    // Close menu if open
    if (this.menuOpen) {
      this.toggleMenu();
    }
  }
}
