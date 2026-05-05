import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../services/submission.service';
import { ChallengeService } from '../../services/challenge.service';

export interface SubmissionRow {
  id: number;
  status: string;
  teamName: string;
  leadName: string;
  phone: string;
  submittedAt: string;
  review: string;
}

@Component({
  selector: 'app-submissions',
  standalone: false,
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css'
})
export class SubmissionsComponent implements OnInit {

  searchQuery = '';
  activeStatus = 'all';
  currentPage = 1;
  rowsPerPage = 10;
  isLoading = false;

  rows: SubmissionRow[] = [];

  constructor(
    private submissionService: SubmissionService,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    const challengeId = this.challengeService.getSelectedChallengeId();
    if (!challengeId) return;

    this.isLoading = true;
    this.challengeService.getRegistrations(challengeId).subscribe({
      next: (data) => {
        this.rows = data.map((item: any) => ({
          id: item.id,
          status: item.submission_status,
          teamName: item.team_name,
          leadName: item.team_lead || 'N/A',
          phone: item.phone || 'N/A',
          submittedAt: item.submitted_at 
            ? new Date(item.submitted_at).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })
            : 'Not submitted yet',
          review: '' // Future placeholder
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading submissions:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Computed ──────────────────────────────────────────
  filteredRows(): SubmissionRow[] {
    const q = this.searchQuery.toLowerCase();
    return this.rows.filter(r => {
      const matchQuery = !q || [r.teamName, r.leadName, r.phone]
        .some(f => f.toLowerCase().includes(q));
      return matchQuery;
    });
  }

  pagedRows(): SubmissionRow[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredRows().slice(start, start + Number(this.rowsPerPage));
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows().length / this.rowsPerPage));
  }

  paginationLabel(): string {
    const total = this.filteredRows().length;
    if (total === 0) return '0';
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, total);
    return `${start} – ${end} of ${total}`;
  }

  // ── Helpers ───────────────────────────────────────────
  statusLabel(s: string): string {
    return s;
  }

  statusIcon(s: string): string {
    return '📨';
  }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }
}