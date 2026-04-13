import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  title: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentRoute: string = '';

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fa-layer-group', route: '/dashboard', title: 'Dashboard' },
    { label: 'Explore Challenges', icon: 'fa-compass', route: '/challenges', title: 'Explore Challenges' },
    { label: 'My Teams', icon: 'fa-user-group', route: '/teams', title: 'My Teams' },
    { label: 'Submissions', icon: 'fa-cloud-arrow-up', route: '/submission', title: 'Submissions' },
    { label: 'Leaderboard', icon: 'fa-trophy', route: '/leaderboard', title: 'Leaderboard' },
    { label: 'Certificates', icon: 'fa-certificate', route: '/certificates', title: 'Certificates' },
    { label: 'Settings', icon: 'fa-gear', route: '/settings', title: 'Settings' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Track current route for active styling
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}