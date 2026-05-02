import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../services/challenge.service';

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
  isLive: boolean = false;

  // Registration State
  showRegistration: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.challengeId = this.route.snapshot.paramMap.get('id');
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

  // Registration Toggle
  openRegistration(): void {
    this.showRegistration = true;
  }

  closeRegistration(): void {
    this.showRegistration = false;
  }

  calculateStatusAndDays(): void {
    if (!this.challenge) return;

    const today = new Date();
    const startDate = new Date(this.challenge.start_date);
    const deadline = new Date(this.challenge.deadline);

    // Live if today is between start and deadline
    this.isLive = today >= startDate && today <= deadline;

    // Days left to close
    const diff = deadline.getTime() - today.getTime();
    this.daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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