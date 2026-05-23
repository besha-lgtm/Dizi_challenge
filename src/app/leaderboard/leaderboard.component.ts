import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationService } from '../services/evaluation.service';

export interface ChallengeWinner {
  challenge_id: number;
  challenge_title: string;
  challenge_description: string;
  deadline: string;
  total_submissions: number;
  evaluated_submissions: number;
  is_deadline_passed: boolean;
  all_evaluated: boolean;
  winner: {
    evaluation_id: number;
    submission_id: number;
    team_name: string;
    total_score: number;
    scores: Record<string, number>;
    members: Array<{ name: string; email?: string; phone?: string }>;
  } | null;
}

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  winners: ChallengeWinner[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.loadWinners();
  }

  loadWinners(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.evaluationService.getWinners().subscribe({
      next: (data) => {
        this.winners = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
        this.errorMsg = 'Could not load the leaderboard. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  get filteredWinners(): ChallengeWinner[] {
    if (!this.searchTerm.trim()) {
      return this.winners;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.winners.filter(w => 
      w.challenge_title.toLowerCase().includes(term)
    );
  }

  getMemberNames(members: any[] | null | undefined): string {
    if (!members || !Array.isArray(members) || members.length === 0) {
      return 'No members listed';
    }
    return members.map(m => m.name).join(', ');
  }

  goToRewards(): void {
    this.router.navigate(['/rewards']);
  }
}
