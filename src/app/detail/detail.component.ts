import { Component, OnInit, OnDestroy } from '@angular/core';

interface ChallengeData {
  challengeTitle: string;
  companyName: string;
  sector: string;
  location: string;
  contactPerson: string;
  workEmail: string;
  problemDescription: string;
  currentSituation: string;
  expectedOutcome: string;
  domainSkills: string;
  eligibility: string;
  prize1: number;
  prize2: number;
  prize3: number;
  startDate: string;
  submissionDeadline: string;
  perks: string[];
}

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit, OnDestroy {
  challengeData: ChallengeData | null = null;
  private refreshInterval: any;

  ngOnInit(): void {
    this.loadChallengeData();
    // Poll sessionStorage every 500ms to get real-time updates
    this.refreshInterval = setInterval(() => {
      this.loadChallengeData();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private loadChallengeData(): void {
    try {
      const data = sessionStorage.getItem('challengeFormData');
      if (data) {
        this.challengeData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading challenge data:', error);
    }
  }

  /**
   * Get sector display name
   */
  getSectorName(sector: string | undefined): string {
    if (!sector) return '';
    const sectorMap: Record<string, string> = {
      'manufacturing': 'Manufacturing',
      'agriculture': 'Agriculture',
      'it': 'Information Technology',
      'healthcare': 'Healthcare',
      'logistics': 'Logistics & Supply Chain',
      'energy': 'Energy & Utilities',
      'education': 'Education',
      'retail': 'Retail & E-Commerce',
      'fintech': 'FinTech',
      'other': 'Other'
    };
    return sectorMap[sector] || sector;
  }

  /**
   * Get domain/skills display name
   */
  getDomainName(domain: string | undefined): string {
    if (!domain) return '';
    const domainMap: Record<string, string> = {
      'iot-dashboard': 'IoT + Dashboard',
      'ml-ai': 'Machine Learning / AI',
      'web-dev': 'Web Development',
      'data-analytics': 'Data Analytics',
      'embedded': 'Embedded Systems',
      'mechanical': 'Mechanical Design',
      'civil': 'Civil / Structural',
      'chemical': 'Chemical Engineering',
      'other': 'Other'
    };
    return domainMap[domain] || domain;
  }

  /**
   * Check if challenge data exists
   */
  hasData(): boolean {
    if (!this.challengeData) return false;
    return !!(
      this.challengeData.challengeTitle?.trim() ||
      this.challengeData.companyName?.trim() ||
      this.challengeData.problemDescription?.trim()
    );
  }
}