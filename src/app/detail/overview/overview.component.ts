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
      },
      error: (err) => console.error('Error loading challenge in overview:', err)
    });
  }

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }
}
