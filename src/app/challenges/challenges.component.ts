import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Challenge {
  id: number;
  title: string;
  sectors: string[];
  partner: string;
  location: string;
  capacity: number;
  daysLeft: number;
  prize: number;
  teams: number;
  status: 'open' | 'closing' | 'new';
}

@Component({
  selector: 'app-challenges',
  standalone: false,
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.css'
})
export class ChallengesComponent {
  activeFilter: 'all' | 'open' | 'closing' | 'new' = 'all';
  searchQuery: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(private router: Router) {}

  challenges: Challenge[] = [
    {
      id: 1,
      title: 'Machine Downtime Prediction System',
      sectors: ['Manufacturing', 'IoT'],
      partner: 'ANITS Industry Partner',
      location: 'Vizag',
      capacity: 55,
      daysLeft: 9,
      prize: 18000,
      teams: 9,
      status: 'open'
    },
    {
      id: 2,
      title: 'Tomato Crop Health Monitoring',
      sectors: ['Agriculture', 'AI'],
      partner: 'Agri Innovation AP',
      location: 'Guntur',
      capacity: 42,
      daysLeft: 14,
      prize: 12000,
      teams: 14,
      status: 'open'
    },
    {
      id: 3,
      title: 'Warehouse Asset Tracking System',
      sectors: ['Manufacturing', 'RFID'],
      partner: 'Silver Prints',
      location: 'Hyderabad',
      capacity: 30,
      daysLeft: 18,
      prize: 20000,
      teams: 6,
      status: 'open'
    },
    {
      id: 4,
      title: 'Smart Irrigation Advisory System',
      sectors: ['Agriculture', 'Sensors'],
      partner: 'Farm Connect',
      location: 'Kurnool',
      capacity: 78,
      daysLeft: 5,
      prize: 8000,
      teams: 11,
      status: 'closing'
    },
    {
      id: 5,
      title: 'Energy Consumption Dashboard',
      sectors: ['Dashboard', 'Manufacturing'],
      partner: 'Visipak Industries',
      location: 'Vizag',
      capacity: 52,
      daysLeft: 21,
      prize: 15000,
      teams: 5,
      status: 'open'
    },
    {
      id: 6,
      title: 'Post-Harvest Loss Tracking',
      sectors: ['Agriculture', 'Storage'],
      partner: 'Cold Chain AP',
      location: 'Vijayawada',
      capacity: 35,
      daysLeft: 30,
      prize: 9000,
      teams: 10,
      status: 'new'
    },
    {
      id: 7,
      title: 'Predictive Maintenance for Textile Mills',
      sectors: ['Manufacturing', 'AI'],
      partner: 'Texwell Industries',
      location: 'Tiruppur',
      capacity: 48,
      daysLeft: 12,
      prize: 16000,
      teams: 8,
      status: 'open'
    },
    {
      id: 8,
      title: 'Water Quality Monitoring System',
      sectors: ['Environment', 'IoT'],
      partner: 'Clean Water Initiative',
      location: 'Bangalore',
      capacity: 60,
      daysLeft: 7,
      prize: 14000,
      teams: 12,
      status: 'closing'
    },
    {
      id: 9,
      title: 'Traffic Flow Optimization',
      sectors: ['Smart City', 'AI'],
      partner: 'Urban Mobility Solutions',
      location: 'Chennai',
      capacity: 45,
      daysLeft: 22,
      prize: 22000,
      teams: 7,
      status: 'open'
    },
    {
      id: 10,
      title: 'Soil Health Assessment Platform',
      sectors: ['Agriculture', 'Sensors'],
      partner: 'Agri Tech Labs',
      location: 'Pune',
      capacity: 55,
      daysLeft: 35,
      prize: 11000,
      teams: 9,
      status: 'new'
    },
    {
      id: 11,
      title: 'Industrial Safety Monitoring',
      sectors: ['Manufacturing', 'IoT'],
      partner: 'SafeWork Industries',
      location: 'Delhi',
      capacity: 38,
      daysLeft: 8,
      prize: 19000,
      teams: 6,
      status: 'closing'
    },
    {
      id: 12,
      title: 'Demand Forecasting for Retail',
      sectors: ['Retail', 'AI'],
      partner: 'MegaStore Corporation',
      location: 'Mumbai',
      capacity: 50,
      daysLeft: 25,
      prize: 13000,
      teams: 11,
      status: 'open'
    }
  ];

  filteredChallenges: Challenge[] = this.challenges;

  // Pagination getter
  get paginatedChallenges(): Challenge[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredChallenges.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredChallenges.length / this.itemsPerPage);
  }

  get isPaginationVisible(): boolean {
    return this.filteredChallenges.length > 6;
  }

  filterByStatus(status: 'all' | 'open' | 'closing' | 'new'): void {
    this.activeFilter = status;
    this.currentPage = 1;
    this.applyFilter();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.applyFilter();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top of challenges grid
      const challengeGrid = document.querySelector('.challenges-grid');
      if (challengeGrid) {
        challengeGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(this.totalPages, 5);
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  private applyFilter(): void {
    let results = this.challenges;

    if (this.activeFilter !== 'all') {
      results = results.filter(c => c.status === this.activeFilter);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      results = results.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.partner.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
      );
    }

    this.filteredChallenges = results;
  }

  getStatusCount(status: string): number {
    if (status === 'all') return this.challenges.length;
    return this.challenges.filter(c => c.status === status as any).length;
  }

  getStatusBadge(status: string): string {
    if (status === 'open') return '● Open';
    if (status === 'closing') return '● Closing';
    if (status === 'new') return '● New';
    return '';
  }

  /**
   * Navigate to challenge detail page
   */
  viewChallengeDetails(challengeId: number): void {
    this.router.navigate(['/detail/overview']);
  }
}
