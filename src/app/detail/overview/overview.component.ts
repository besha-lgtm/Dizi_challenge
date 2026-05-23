import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  challenge: any = null;
  announcementDate: Date | null = null;
  openFaq: number | null = null;

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
        if (data && data.deadline) {
          const deadlineDate = new Date(data.deadline);
          deadlineDate.setDate(deadlineDate.getDate() + 7);
          this.announcementDate = deadlineDate;
        }
      },
      error: (err) => console.error('Error loading challenge in overview:', err)
    });
  }

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }

  getWinnersDate(): Date {
    if (this.announcementDate) return this.announcementDate;
    if (!this.challenge?.deadline) return new Date();
    const d = new Date(this.challenge.deadline);
    d.setDate(d.getDate() + 7);
    return d;
  }

  getTimelineState(step: 'launched' | 'submission' | 'deadline' | 'winners'): string {
    if (!this.challenge) return 'ov-timeline-upcoming';

    const now = new Date();
    const start = new Date(this.challenge.start_date);
    const deadline = new Date(this.challenge.deadline);
    deadline.setHours(23, 59, 59, 999);
    const winners = this.getWinnersDate();
    winners.setHours(23, 59, 59, 999);

    switch (step) {
      case 'launched':
        return now < start ? 'ov-timeline-upcoming' : 'ov-timeline-done';
      case 'submission':
        if (now < start) return 'ov-timeline-upcoming';
        if (now >= deadline) return 'ov-timeline-done';
        return 'ov-timeline-active';
      case 'deadline':
        return now < deadline ? 'ov-timeline-upcoming' : 'ov-timeline-done';
      case 'winners':
        if (now < deadline) return 'ov-timeline-upcoming';
        if (now >= winners) return 'ov-timeline-done';
        return 'ov-timeline-active';
    }
  }

  getPerks(): string[] {
    if (!this.challenge?.perks) return [];
    try {
      const parsed = typeof this.challenge.perks === 'string'
        ? JSON.parse(this.challenge.perks)
        : this.challenge.perks;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
