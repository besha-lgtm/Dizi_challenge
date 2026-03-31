import { Component } from '@angular/core';

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
  templateUrl: './Challenges.component.html',
  styleUrl: './Challenges.component.css'
})
export class ChallengesComponent {
  activeFilter: 'all' | 'open' | 'closing' | 'new' = 'all';
  searchQuery: string = '';

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
    }
  ];

  filteredChallenges: Challenge[] = this.challenges;

  filterByStatus(status: 'all' | 'open' | 'closing' | 'new'): void {
    this.activeFilter = status;
    this.applyFilter();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilter();
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
