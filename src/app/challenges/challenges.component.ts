import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../services/challenge.service';

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
export class ChallengesComponent implements OnInit {
  activeFilter: 'all' | 'open' | 'closing' | 'new' = 'all';
  searchQuery: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;

  challenges: Challenge[] = [];
  filteredChallenges: Challenge[] = [];

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.challengeService.getChallenges().subscribe({
      next: (data) => {
        console.log('Fetched challenges:', data);
        this.challenges = data.map(item => ({
          id: item.id,
          title: item.title,
          sectors: [item.sector, item.domain].filter(Boolean), // Include both sector and domain as tags
          partner: item.company_name,
          location: item.location,
          capacity: 0,
          daysLeft: this.calculateDaysLeft(item.deadline),
          prize: Number(item.total_pool),
          teams: 0,
          status: this.deriveStatus(item.deadline)
        }));
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error loading challenges:', err);
      }
    });
  }

  private calculateDaysLeft(deadline: string): number {
    const today = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  private deriveStatus(deadline: string): 'open' | 'closing' | 'new' {
    const days = this.calculateDaysLeft(deadline);
    if (days <= 0) return 'closing'; // Should probably be 'closed' but interface only has 3
    if (days <= 7) return 'closing';
    if (days >= 28) return 'new';
    return 'open';
  }


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
}
