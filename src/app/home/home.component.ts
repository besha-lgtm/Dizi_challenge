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
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Featured challenges from backend
  featuredChallenges: Challenge[] = [
    {
      id: 1,
      title: 'Reduce Power Loss in Corrugation Plant',
      sectors: ['Manufacturing', 'IoT'],
      partner: 'Visipak Industries',
      location: 'Visakhapatnam',
      capacity: 68,
      daysLeft: 12,
      prize: 15000,
      teams: 12,
      status: 'open'
    },
    {
      id: 2,
      title: 'Brinjal Disease Detection Using Vision AI',
      sectors: ['Agriculture', 'AI / Vision'],
      partner: 'Agri innovation AP',
      location: 'Andhra Pradesh',
      capacity: 38,
      daysLeft: 7,
      prize: 10000,
      teams: 8,
      status: 'new'
    },
    {
      id: 3,
      title: 'Smart Dispatch Visibility for MSME Plant',
      sectors: ['Manufacturing', 'RFID'],
      partner: 'Silver Prints',
      location: 'Hyderabad',
      capacity: 88,
      daysLeft: 3,
      prize: 20000,
      teams: 18,
      status: 'closing'
    }
  ];

  constructor(private router: Router) {}

  exploreChallenges(): void {
    this.router.navigate(['/challenges']);
  }

  postChallenge(): void {
    this.router.navigate(['/postchallenge']);
  }

  // Helper method to get tag display text
  getStatusTag(status: string): string {
    if (status === 'open') return '● Live';
    if (status === 'new') return 'New';
    if (status === 'closing') return 'Closing Soon';
    return '';
  }

  // Helper method to get tag class
  getStatusClass(status: string): string {
    if (status === 'open') return 'tag-live';
    if (status === 'new') return 'tag-new';
    if (status === 'closing') return 'tag-closing';
    return '';
  }

  // Helper method to get sector class
  getSectorClass(sector: string): string {
    const lowerSector = sector.toLowerCase();
    if (lowerSector.includes('manufacturing')) return 'tag-manufacturing';
    if (lowerSector.includes('agriculture')) return 'tag-agriculture';
    if (lowerSector.includes('iot')) return 'tag-iot';
    if (lowerSector.includes('ai') || lowerSector.includes('vision')) return 'tag-ai';
    if (lowerSector.includes('rfid')) return 'tag-rfid';
    return 'tag-default';
  }
}
