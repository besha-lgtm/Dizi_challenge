import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from '../services/challenge.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  challengeId: string | null = null;
  challenge: any = null;
  daysLeft: number = 0;
  status: 'open' | 'closing' | 'new' | 'upcoming' | 'closed' = 'open';

  // Registration State
  showRegistration: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private challengeService: ChallengeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.challengeId = this.challengeService.getSelectedChallengeId();
    if (this.challengeId) {
      this.loadChallengeDetails(this.challengeId);
    }
  }

  loadChallengeDetails(id: string): void {
    this.challengeService.getChallengeById(id).subscribe({
      next: (data) => {
        this.challenge = data;
        this.calculateStatusAndDays();
      },
      error: (err) => {
        console.error('Error loading challenge details:', err);
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Registration Toggle
  openRegistration(): void {
    if (this.status === 'upcoming' || this.status === 'closed') return;
    this.showRegistration = true;
  }

  closeRegistration(): void {
    this.showRegistration = false;
  }

  goToSubmission(): void {
    this.router.navigate(['/submission']);
  }

  calculateStatusAndDays(): void {
    if (!this.challenge) return;

    const today = new Date();
    const startDate = new Date(this.challenge.start_date);
    const deadline = new Date(this.challenge.deadline);

    // Reset today to midnight for day comparison
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const sDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const dDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

    const diffToStart = sDate.getTime() - now.getTime();
    const diffToDeadline = dDate.getTime() - now.getTime();

    const daysToStart = Math.ceil(diffToStart / (1000 * 60 * 60 * 24));
    const daysToDeadline = Math.ceil(diffToDeadline / (1000 * 60 * 60 * 24));

    if (daysToStart > 0) {
      this.status = 'upcoming';
      this.daysLeft = daysToStart;
    } else if (daysToDeadline < 0) {
      this.status = 'closed';
      this.daysLeft = 0;
    } else {
      this.daysLeft = daysToDeadline;
      if (daysToDeadline <= 7) this.status = 'closing';
      else if (daysToDeadline >= 28) this.status = 'new';
      else this.status = 'open';
    }
  }

  getStatusBadge(): string {
    switch (this.status) {
      case 'upcoming': return '● Upcoming';
      case 'closed': return '● Closed';
      case 'closing': return '● Closing Soon';
      case 'new': return '● New';
      default: return '● Open';
    }
  }

  getDaysAgo(dateStr: string): string {
    const today = new Date();
    const created = new Date(dateStr);
    const diff = today.getTime() - created.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Posted today';
    if (days === 1) return 'Posted 1 day ago';
    return `Posted ${days} days ago`;
  }
}