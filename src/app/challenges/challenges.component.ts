import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengeService } from '../services/challenge.service';

interface Challenge {
  id: number;
  title: string;
  sectors: string[];
  partner: string;
  location: string;
  daysLeft: number;
  dateMessage: string;
  prize: number;
  teams: number;
  status: 'open' | 'closing' | 'new' | 'upcoming' | 'closed';
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

  constructor(
    private challengeService: ChallengeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.challengeService.getChallenges().subscribe({
      next: (data) => {
        this.challenges = data.map(item => {
          const daysToStart = this.calculateDaysBetween(new Date(), new Date(item.start_date));
          const daysToDeadline = this.calculateDaysBetween(new Date(), new Date(item.deadline));
          
          let status: any = 'open';
          let dateMessage = '';

          if (daysToStart > 0) {
            status = 'upcoming';
            dateMessage = `Starts in ${daysToStart} days`;
          } else if (daysToDeadline < 0) {
            status = 'closed';
            dateMessage = 'Challenge Closed';
          } else {
            dateMessage = `${daysToDeadline} days left`;
            if (daysToDeadline <= 7) status = 'closing';
            else if (daysToDeadline >= 28) status = 'new';
            else status = 'open';
          }

          return {
            id: item.id,
            title: item.title,
            sectors: [item.sector, item.domain].filter(Boolean),
            partner: item.company_name,
            location: item.location,
            daysLeft: Math.max(0, daysToDeadline),
            dateMessage: dateMessage,
            prize: Number(item.total_pool),
            teams: Number(item.registered_teams) || 0,
            status: status
          };
        });
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error loading challenges:', err);
      }
    });
  }

  private calculateDaysBetween(start: Date, end: Date): number {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const diff = e.getTime() - s.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  goToDetail(id: number): void {
    this.challengeService.setSelectedChallengeId(id);
    this.router.navigate(['/challenges/detail/overview']);
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
    if (status === 'upcoming') return '● Upcoming';
    if (status === 'closed') return '● Closed';
    return '';
  }
}
