import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';

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
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  challenge: any = null;
  openFaq: number | null = null;
  challengeData: ChallengeData = {
    challengeTitle: 'Smart Water Management Challenge',
    companyName: 'Dizi Labs',
    sector: 'manufacturing',
    location: 'Bengaluru, India',
    contactPerson: 'Aarav Mehta',
    workEmail: 'aarav.mehta@dizilabs.com',
    problemDescription: 'Design an IoT-enabled monitoring solution that helps factories track water usage, detect leakage, and reduce wastage across production lines.',
    currentSituation: 'The facility currently relies on manual readings and delayed reports, making it difficult to identify abnormal consumption patterns quickly.',
    expectedOutcome: 'A working dashboard or prototype that provides real-time consumption insights, leak alerts, and actionable recommendations for operations teams.',
    domainSkills: 'iot-dashboard',
    eligibility: 'all',
    prize1: 75000,
    prize2: 50000,
    prize3: 25000,
    startDate: '2026-05-10',
    submissionDeadline: '2026-06-10',
    perks: ['Mentorship', 'Pilot Opportunity', 'Certificate']
  };

  constructor() {}

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService
  ) { }

  ngOnInit(): void {
    const id = this.challengeService.getSelectedChallengeId();
    if (id) {
      this.loadChallenge(id);
    }
  }

  loadChallenge(id: string): void {
    this.challengeService.getChallengeById(id).subscribe({
      next: (data) => {
        this.challenge = data;
      },
      error: (err) => console.error('Error loading challenge in overview:', err)
    });
  }

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }

  /**
   * Get sector display name
   */
  getSectorName(sector: string): string {
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
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /**
   * Get total prize pool
   */
  getTotalPrizePool(): number {
    return (this.challengeData?.prize1 || 0) + (this.challengeData?.prize2 || 0) + (this.challengeData?.prize3 || 0);
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  /**
   * Check if perk is selected
   */
  hasPerk(perkName: string): boolean {
    return this.challengeData?.perks?.includes(perkName) || false;
  }

  /**
   * Check if there are any perks
   */
  hasPerks(): boolean {
    return Array.isArray(this.challengeData?.perks) && this.challengeData.perks.length > 0;
  }

  /**
   * Check if challenge data is empty/not filled
   */
  hasData(): boolean {
    if (!this.challengeData) return false;
    
    // Check if at least one significant field is filled
    return !!(
      this.challengeData.challengeTitle?.trim() ||
      this.challengeData.companyName?.trim() ||
      this.challengeData.problemDescription?.trim() ||
      this.challengeData.startDate ||
      this.challengeData.prize1
    );
  }

  /**
   * Check if company info is available
   */
  hasCompanyInfo(): boolean {
    return !!(
      this.challengeData?.companyName?.trim() ||
      this.challengeData?.sector ||
      this.challengeData?.location?.trim()
    );
  }

  /**
   * Check if challenge overview is available
   */
  hasChallengeOverview(): boolean {
    return !!(
      this.challengeData?.challengeTitle?.trim() ||
      this.challengeData?.problemDescription?.trim()
    );
  }

  /**
   * Check if timeline data is available
   */
  hasTimeline(): boolean {
    return !!(this.challengeData?.startDate || this.challengeData?.submissionDeadline);
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
   * Get eligibility display name
   */
  getEligibilityName(eligibility: string | undefined): string {
    if (!eligibility) return '';
    const eligibilityMap: Record<string, string> = {
      'all': 'All Students',
      'ug': 'Undergraduate Only',
      'pg': 'Postgraduate Only',
      'final-year': 'Final Year Students',
      'stem': 'STEM Students'
    };
    return eligibilityMap[eligibility] || eligibility;
  }
}
