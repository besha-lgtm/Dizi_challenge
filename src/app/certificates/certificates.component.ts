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
  activeFilter: 'all' | 'gold' | 'silver' | 'bronze' = 'all';
  selectedCertificate: Certificate | null = null;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;

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
    },
    {
      id: 7,
      title: 'Computer Vision Object Detection',
      challengeName: 'AI Vision Challenge',
      dateEarned: '2024-06-20',
      participantName: 'Rohan Varma',
      score: 91,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-007',
      rank: 'gold'
    },
    {
      id: 8,
      title: 'Sentiment Analysis Natural Language Processing',
      challengeName: 'NLP Challenge',
      dateEarned: '2024-05-10',
      participantName: 'Rohan Varma',
      score: 84,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-008',
      rank: 'silver'
    },
    {
      id: 9,
      title: 'Predictive Maintenance System',
      challengeName: 'Industrial IoT Challenge',
      dateEarned: '2024-04-18',
      participantName: 'Rohan Varma',
      score: 79,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-009',
      rank: 'bronze'
    },
    {
      id: 10,
      title: 'Autonomous Vehicle Path Planning',
      challengeName: 'Robotics & Autonomous Systems',
      dateEarned: '2024-03-22',
      participantName: 'Rohan Varma',
      score: 87,
      issuer: 'DiziEduTech',
      certificateId: 'CERT-2024-010',
      rank: 'silver'
    }
  ];

  get filteredCertificates(): Certificate[] {
    let filtered = this.certificates;

    // Filter by rank
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(cert => cert.rank === this.activeFilter);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.title.toLowerCase().includes(query) ||
        cert.challengeName.toLowerCase().includes(query) ||
        cert.certificateId.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  downloadCertificate(certificate: Certificate): void {
    // Create certificate content as text
    const certificateContent = `
═════════════════════════════════════════════════════════════════
                        CERTIFICATE OF ACHIEVEMENT
═════════════════════════════════════════════════════════════════

This is to certify that

                          ${certificate.participantName}

has successfully completed the challenge:

                          ${certificate.title}

Challenge Name: ${certificate.challengeName}
Issuer: ${certificate.issuer}
Date Earned: ${this.formatDate(certificate.dateEarned)}
Score: ${certificate.score}%
Achievement Level: ${this.getRankBadge(certificate.rank)}
Certificate ID: ${certificate.certificateId}

═════════════════════════════════════════════════════════════════
    This certificate is awarded in recognition of expertise
    and successful completion of the challenge requirements.
═════════════════════════════════════════════════════════════════
    `;

    // Create a blob from the certificate content
    const blob = new Blob([certificateContent], { type: 'text/plain;charset=utf-8' });
    
    // Create a temporary URL for the blob
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set the link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `${certificate.certificateId}_${certificate.title.replace(/\s+/g, '_')}.txt`);
    link.style.visibility = 'hidden';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  }

  viewCertificate(certificate: Certificate): void {
    this.selectedCertificate = certificate;
    // Hide header and disable body scroll when modal is open
    const appHeader = document.querySelector('app-header');
    if (appHeader) {
      (appHeader as HTMLElement).style.display = 'none';
    }
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  closeCertificateModal(): void {
    this.selectedCertificate = null;
    // Show header and re-enable body scroll
    const appHeader = document.querySelector('app-header');
    if (appHeader) {
      (appHeader as HTMLElement).style.display = 'block';
    }
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
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

  // Pagination methods
  get paginatedCertificates(): Certificate[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCertificates.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCertificates.length / this.itemsPerPage);
  }

  get isPaginationVisible(): boolean {
    return this.filteredCertificates.length > 6;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top of certificates grid
      const certGrid = document.querySelector('.cert-grid');
      if (certGrid) {
        certGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Reset to first page when filter or search changes
  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.currentPage = 1;
  }

  setFilter(filter: 'all' | 'gold' | 'silver' | 'bronze'): void {
    this.activeFilter = filter;
    this.currentPage = 1;
  }

  // Generate page numbers for pagination display
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(this.totalPages, 5); // Show max 5 page numbers
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Math helper for template
  Math = Math;
}