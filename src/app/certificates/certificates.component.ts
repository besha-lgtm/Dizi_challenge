import { Component } from '@angular/core';

interface Certificate {
  id: number;
  title: string;
  challengeName: string;
  dateEarned: string;
  participantName: string;
  score: number;
  issuer: string;
  certificateId: string;
  rank: 'gold' | 'silver' | 'bronze' | 'participant';
}

@Component({
  selector: 'app-certificates',
  standalone: false,
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.css'
})
export class CertificatesComponent {
  searchQuery: string = '';

  certificates: Certificate[] = [
    {
      id: 1,
      title: 'Machine Downtime Prediction System',
      challengeName: 'ML & IoT Challenge',
      dateEarned: '2024-12-15',
      participantName: 'Rohan Varma',
      score: 95,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-001',
      rank: 'gold'
    },
    {
      id: 2,
      title: 'Tomato Crop Health Monitoring',
      challengeName: 'Agriculture AI Challenge',
      dateEarned: '2024-11-20',
      participantName: 'Rohan Varma',
      score: 88,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-002',
      rank: 'silver'
    },
    {
      id: 3,
      title: 'Warehouse Asset Tracking System',
      challengeName: 'RFID & Manufacturing',
      dateEarned: '2024-10-10',
      participantName: 'Rohan Varma',
      score: 82,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-003',
      rank: 'bronze'
    },
    {
      id: 4,
      title: 'Smart Irrigation Advisory System',
      challengeName: 'Smart Agriculture Challenge',
      dateEarned: '2024-09-25',
      participantName: 'Rohan Varma',
      score: 76,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-004',
      rank: 'participant'
    },
    {
      id: 5,
      title: 'Energy Consumption Dashboard',
      challengeName: 'Dashboard Design Challenge',
      dateEarned: '2024-08-30',
      participantName: 'Rohan Varma',
      score: 92,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-005',
      rank: 'gold'
    },
    {
      id: 6,
      title: 'Real-time Traffic Monitoring',
      challengeName: 'IoT & Real-time Systems',
      dateEarned: '2024-07-15',
      participantName: 'Rohan Varma',
      score: 85,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-006',
      rank: 'silver'
    }
  ];

  get filteredCertificates(): Certificate[] {
    if (!this.searchQuery.trim()) {
      return this.certificates;
    }

    const query = this.searchQuery.toLowerCase();
    return this.certificates.filter(cert =>
      cert.title.toLowerCase().includes(query) ||
      cert.challengeName.toLowerCase().includes(query) ||
      cert.certificateId.toLowerCase().includes(query)
    );
  }

  onSearchChange(value: string): void {
    this.searchQuery = value;
  }

  downloadCertificate(certificate: Certificate): void {
    console.log('Downloading certificate:', certificate.certificateId);
    // Add download logic here
  }

  viewCertificate(certificate: Certificate): void {
    console.log('Viewing certificate:', certificate.certificateId);
    // Add modal or detailed view logic here
  }

  getRankBadge(rank: string): string {
    const badges: { [key: string]: string } = {
      'gold': '🥇 Gold',
      'silver': '🥈 Silver',
      'bronze': '🥉 Bronze',
      'participant': '✓ Participant'
    };
    return badges[rank] || rank;
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
}
