import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rewards',
  standalone: false,
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent {
  constructor(private router: Router) {}

  viewLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }

  previewCertificate(): void {
    this.router.navigate(['/certificates']);
  }
}
