import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-teams',
  standalone: false,
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  activeFilter = 'all';
  searchText = '';
  selectedTeam: any = null;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(private router: Router) {}
  ngOnInit() {
    const saved = localStorage.getItem('teams');

    if (saved) {
      try {
        const teams = JSON.parse(saved);
        this.teams = Array.isArray(teams) ? teams : [];
      } catch {
        this.teams = this.teams.filter(team => this.hasTeamDetails(team));
      }
    }

    this.teams = this.teams.filter(team => this.hasTeamDetails(team));
    this.applyFilters();
  }

  teams: any[] = [
  {
    name: 'Team Alpha Innovators',
    challenge: 'Power Loss Reduction',
    domain: 'IoT',
    college: 'ANITS, Vizag',
    role: 'Leader',
    members: [
      { name: 'Deepika', email: 'deepika@gmail.com', college: 'ANITS' },
      { name: 'Ravi', email: 'ravi@gmail.com', college: 'JNTU' },
      { name: 'Kiran', email: 'kiran@gmail.com', college: 'VIT' }
    ],
    progress: 65,
    submissions: 2,
    status: 'active',
    score: 82,
    comments: 'Good approach, improve optimization',
    shortlisted: true
  },
  {
    name: 'Green Vision',
    challenge: 'Energy Efficiency Optimization',
    domain: 'Renewable Energy',
    college: 'KL University, Hyderabad',
    role: 'Member',
    members: [
      { name: 'Priya', email: 'priya@gmail.com', college: 'KL University' },
      { name: 'Suresh', email: 'suresh@gmail.com', college: 'KL University' }
    ],
    progress: 40,
    submissions: 3,
    status: 'active',
    score: 70,
    comments: 'Needs more data validation',
    shortlisted: false
  },
  {
    name: 'Agri Vision AI',
    challenge: 'Crop Disease Detection',
    domain: 'AI',
    role: 'Member',
    members: [
      { name: 'Karthik', email: 'karthik@gmail.com', college: 'IIIT' },
      { name: 'Anil', email: 'anil@gmail.com', college: 'IIIT' }
    ],
    progress: 100,
    submissions: 5,
    status: 'completed',
    score: 91,
    comments: 'Excellent model accuracy',
    shortlisted: true
  },
  {
    name: 'Smart Factory Solutions',
    challenge: 'Machine Downtime Prediction',
    domain: 'Manufacturing',
    college: 'NIT Rourkela, Odisha',
    role: 'Leader',
    members: [
      { name: 'Vikas', email: 'vikas@gmail.com', college: 'NIT Rourkela' },
      { name: 'Shreya', email: 'shreya@gmail.com', college: 'NIT Rourkela' },
      { name: 'Arjun', email: 'arjun@gmail.com', college: 'NIT Rourkela' },
      { name: 'Neha', email: 'neha@gmail.com', college: 'NIT Rourkela' }
    ],
    progress: 75,
    submissions: 4,
    status: 'active',
    score: 85,
    comments: 'Strong predictive model',
    shortlisted: true
  },
  {
    name: 'Water Warriors',
    challenge: 'Water Quality Monitoring',
    domain: 'Environment',
    college: 'IIT Bombay, Mumbai',
    role: 'Member',
    members: [
      { name: 'Amit', email: 'amit@gmail.com', college: 'IIT Bombay' },
      { name: 'Priya', email: 'priya@gmail.com', college: 'IIT Bombay' },
      { name: 'Raj', email: 'raj@gmail.com', college: 'IIT Bombay' }
    ],
    progress: 55,
    submissions: 2,
    status: 'active',
    score: 78,
    comments: 'Good sensor integration',
    shortlisted: false
  },
  {
    name: 'Urban Movers',
    challenge: 'Traffic Flow Optimization',
    domain: 'Smart City',
    college: 'BITS Pilani, Goa',
    role: 'Leader',
    members: [
      { name: 'Rahul', email: 'rahul@gmail.com', college: 'BITS Pilani' },
      { name: 'Megha', email: 'megha@gmail.com', college: 'BITS Pilani' },
      { name: 'Sanjay', email: 'sanjay@gmail.com', college: 'BITS Pilani' }
    ],
    progress: 80,
    submissions: 6,
    status: 'active',
    score: 88,
    comments: 'Innovative algorithm approach',
    shortlisted: true
  },
  {
    name: 'Retail Analysts Pro',
    challenge: 'Demand Forecasting',
    domain: 'Retail',
    college: 'VIT Vellore, Tamil Nadu',
    role: 'Member',
    members: [
      { name: 'Divya', email: 'divya@gmail.com', college: 'VIT' },
      { name: 'Akshay', email: 'akshay@gmail.com', college: 'VIT' }
    ],
    progress: 45,
    submissions: 1,
    status: 'active',
    score: 72,
    comments: 'Need better feature engineering',
    shortlisted: false
  },
  {
    name: 'Soil Tech Innovators',
    challenge: 'Soil Health Assessment',
    domain: 'Agriculture',
    college: 'IIIT Hyderabad, Telangana',
    role: 'Leader',
    members: [
      { name: 'Sanjana', email: 'sanjana@gmail.com', college: 'IIIT Hyderabad' },
      { name: 'Vikram', email: 'vikram@gmail.com', college: 'IIIT Hyderabad' },
      { name: 'Ritu', email: 'ritu@gmail.com', college: 'IIIT Hyderabad' },
      { name: 'Aman', email: 'aman@gmail.com', college: 'IIIT Hyderabad' }
    ],
    progress: 70,
    submissions: 3,
    status: 'active',
    score: 84,
    comments: 'Comprehensive sensor coverage',
    shortlisted: true
  },
  {
    name: 'Safety First Team',
    challenge: 'Industrial Safety Monitoring',
    domain: 'Manufacturing',
    college: 'DTU Delhi, Delhi',
    role: 'Member',
    members: [
      { name: 'Nitin', email: 'nitin@gmail.com', college: 'DTU' },
      { name: 'Pooja', email: 'pooja@gmail.com', college: 'DTU' },
      { name: 'Harsh', email: 'harsh@gmail.com', college: 'DTU' }
    ],
    progress: 90,
    submissions: 7,
    status: 'completed',
    score: 93,
    comments: 'Exceptional safety analytics',
    shortlisted: true
  },
  {
    name: 'IoT Masters',
    challenge: 'Textile Mill Maintenance',
    domain: 'IoT',
    college: 'PSG College, Coimbatore',
    role: 'Leader',
    members: [
      { name: 'Aravind', email: 'aravind@gmail.com', college: 'PSG' },
      { name: 'Lakshmi', email: 'lakshmi@gmail.com', college: 'PSG' },
      { name: 'Suresh', email: 'suresh@gmail.com', college: 'PSG' },
      { name: 'Anjali', email: 'anjali@gmail.com', college: 'PSG' }
    ],
    progress: 60,
    submissions: 2,
    status: 'active',
    score: 79,
    comments: 'Good IoT implementation',
    shortlisted: false
  },
  {
    name: 'Tech Innovators Hub',
    challenge: 'Cloud Computing Challenge',
    domain: 'Cloud',
    college: 'Amrita University, Kerala',
    role: 'Member',
    members: [
      { name: 'Aarya', email: 'aarya@gmail.com', college: 'Amrita' },
      { name: 'Bhaskar', email: 'bhaskar@gmail.com', college: 'Amrita' }
    ],
    progress: 35,
    submissions: 1,
    status: 'active',
    score: 65,
    comments: 'Needs scalability improvements',
    shortlisted: false
  }
];
  openTeamModal(team: any) {
  this.selectedTeam = team;
  // Disable body and document scroll using the same method as certificates
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  
  // Hide header when modal opens
  const appHeader = document.querySelector('app-header');
  if (appHeader) {
    (appHeader as HTMLElement).style.display = 'none';
  }
}

closeModal() {
  this.selectedTeam = null;
  // Re-enable body and document scroll
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  
  // Show header when modal closes
  const appHeader = document.querySelector('app-header');
  if (appHeader) {
    (appHeader as HTMLElement).style.display = 'block';
  }
}

  filteredTeams: any[] = [];

  // Pagination getters
  get paginatedTeams(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTeams.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTeams.length / this.itemsPerPage);
  }

  get isPaginationVisible(): boolean {
    return this.filteredTeams.length > 6;
  }

  // 🔍 FILTER BUTTONS
  setFilter(filter: string) {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  // 🔍 SEARCH
  onSearchChange(value: string) {
    this.searchText = value.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  // 🔍 APPLY FILTER + SEARCH
  applyFilters() {
    this.filteredTeams = this.teams.filter(team => {
      if (!this.hasTeamDetails(team)) {
        return false;
      }

      const matchesFilter =
        this.activeFilter === 'all' ||
        team.status === this.activeFilter;

      const teamName = this.getTextValue(team.name).toLowerCase();
      const challengeName = this.getTextValue(team.challenge).toLowerCase();

      const matchesSearch =
        teamName.includes(this.searchText) ||
        challengeName.includes(this.searchText);

      return matchesFilter && matchesSearch;
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top of teams grid
      const teamsGrid = document.querySelector('.challenges-grid');
      if (teamsGrid) {
        teamsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // 🔢 COUNT
  getCount(type: string) {
    const visibleTeams = this.teams.filter(team => this.hasTeamDetails(team));
    if (type === 'all') return visibleTeams.length;
    return visibleTeams.filter(t => t.status === type).length;
  }

  getMemberName(member: any): string {
    return typeof member === 'string' ? member : member?.name || '';
  }

  private hasTeamDetails(team: any): boolean {
    if (!team || typeof team !== 'object') {
      return false;
    }

    const hasBasicDetails = [
      team.name,
      team.challenge,
      team.domain,
      team.college,
      team.role
    ].some(value => this.hasText(value));

    const hasMemberDetails = Array.isArray(team.members) && team.members.some((member: any) => {
      if (typeof member === 'string') {
        return this.hasText(member);
      }

      return this.hasText(member?.name) || this.hasText(member?.email) || this.hasText(member?.college);
    });

    return hasBasicDetails || hasMemberDetails;
  }

  private hasText(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private getTextValue(value: any): string {
    return typeof value === 'string' ? value : '';
  }

  // 🔥 JOIN BUTTON FUNCTION
  joinTeam(team: any) {
    this.router.navigate(['/create-team'], {
      state: { teamData: team }
    });
  }
}
