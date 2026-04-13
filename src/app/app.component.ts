import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
   constructor(public router: Router) {}

  // Function to check if header should be hidden
  showGlobalHeader(): boolean {
    const hideOn = ['/login', '/register', '/forgot-password', '/dashboard']; // Hide on auth, forgot-password and dashboard (since dashboard has its own in sidebar)
    return !hideOn.includes(this.router.url);
  }
}

