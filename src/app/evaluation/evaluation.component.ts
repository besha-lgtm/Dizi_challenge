import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChallengeService } from '../services/challenge.service';
import { SubmissionService } from '../services/submission.service';

export interface SolutionLink {
  label: string;
  url: string;
  icon: string;
}

export interface EvaluationRow {
  id: number;
  teamName: string;
  challengeId: string | number;
  challengeName: string;
  leadName: string;
  submittedAt: string;
  submittedAtRaw: string | null;
  githubRepo?: string;
  liveLink?: string;
  solutionLinks: SolutionLink[];
  evalStatus: string;
  statusClass: string;
  scores: Record<string, number>;
}

const DEFAULT_CRITERIA = [
  'Innovation',
  'Feasibility',
  'Impact',
  'Cost Efficiency',
  'Scalability'
];

const DEFAULT_SCORES: Record<string, number> = {
  Innovation: 0,
  Feasibility: 0,
  Impact: 0,
  'Cost Efficiency': 0,
  Scalability: 0
};

@Component({
  selector: 'app-evaluation',
  standalone: false,
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  private readonly uploadBase = 'http://localhost:5000/uploads';

  searchQuery = '';
  currentPage = 1;
  rowsPerPage = 8;
  isLoading = false;
  loadError = '';

  rows: EvaluationRow[] = [];
  selectedRow: EvaluationRow | null = null;

  currentScoresArray: { key: string; value: number }[] = [];

  constructor(
    private challengeService: ChallengeService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.loadAllSubmissions();
  }

  loadAllSubmissions(): void {
    this.isLoading = true;
    this.loadError = '';

    this.challengeService.getChallenges().subscribe({
      next: (challenges) => {
        if (!challenges?.length) {
          this.rows = [];
          this.isLoading = false;
          return;
        }

        const challengeMap = new Map<string, string>();
        challenges.forEach((c: any) => {
          challengeMap.set(String(c.id), c.title || c.company_name || `Challenge #${c.id}`);
        });

        const requests = challenges.map((c: any) =>
          this.submissionService.getSubmissionsByChallenge(c.id).pipe(
            map((subs: any[]) =>
              (subs || []).map((sub) => this.mapSubmissionToRow(sub, challengeMap.get(String(c.id)) || 'Unknown Challenge', c.id))
            ),
            catchError(() => of([] as EvaluationRow[]))
          )
        );

        forkJoin(requests).subscribe({
          next: (results) => {
            this.rows = results
              .flat()
              .sort((a, b) => {
                const da = a.submittedAtRaw ? new Date(a.submittedAtRaw).getTime() : 0;
                const db = b.submittedAtRaw ? new Date(b.submittedAtRaw).getTime() : 0;
                return db - da;
              });
            this.isLoading = false;
            if (this.rows.length > 0 && !this.selectedRow) {
              this.selectRow(this.rows[0]);
            }
          },
          error: (err) => {
            console.error('Error loading evaluations:', err);
            this.loadError = 'Failed to load submissions. Please ensure the backend is running.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading challenges:', err);
        this.loadError = 'Failed to load challenges.';
        this.isLoading = false;
      }
    });
  }

  private mapSubmissionToRow(sub: any, challengeName: string, challengeId: string | number): EvaluationRow {
    return {
      id: sub.id,
      teamName: sub.team_name,
      challengeId,
      challengeName,
      leadName: sub.lead_name || 'N/A',
      submittedAt: sub.submitted_at
        ? new Date(sub.submitted_at).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : '—',
      submittedAtRaw: sub.submitted_at || null,
      githubRepo: sub.github_repo,
      liveLink: sub.live_link,
      solutionLinks: this.buildSolutionLinks(sub),
      evalStatus: 'To Review',
      statusClass: 'toreview',
      scores: { ...DEFAULT_SCORES }
    };
  }

  private buildSolutionLinks(sub: any): SolutionLink[] {
    const links: SolutionLink[] = [];

    if (sub.github_repo) {
      links.push({ label: 'GitHub', url: sub.github_repo, icon: '🔗' });
    }
    if (sub.live_link) {
      links.push({ label: 'Live Demo', url: sub.live_link, icon: '🌐' });
    }
    if (sub.solution_file) {
      links.push({
        label: 'Solution',
        url: `${this.uploadBase}/${sub.solution_file}`,
        icon: '📄'
      });
    }
    if (sub.ppt_file) {
      links.push({
        label: 'Presentation',
        url: `${this.uploadBase}/${sub.ppt_file}`,
        icon: '📑'
      });
    }
    const demos: string[] = Array.isArray(sub.demo_files) ? sub.demo_files : [];
    demos.slice(0, 2).forEach((file: string, i: number) => {
      links.push({
        label: demos.length > 1 ? `Demo ${i + 1}` : 'Demo',
        url: `${this.uploadBase}/${file}`,
        icon: '🎬'
      });
    });
    const docs: string[] = Array.isArray(sub.documentation_files) ? sub.documentation_files : [];
    if (docs[0]) {
      links.push({
        label: 'Documentation',
        url: `${this.uploadBase}/${docs[0]}`,
        icon: '📎'
      });
    }

    return links;
  }

  selectRow(row: EvaluationRow): void {
    this.selectedRow = row;
    this.currentScoresArray = Object.keys(row.scores).map(key => ({
      key,
      value: row.scores[key]
    }));
  }

  filteredRows(): EvaluationRow[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.rows;
    return this.rows.filter(r =>
      [r.teamName, r.challengeName, r.leadName, r.evalStatus]
        .some(f => f.toLowerCase().includes(q))
    );
  }

  pagedRows(): EvaluationRow[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredRows().slice(start, start + this.rowsPerPage);
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

  isSelected(row: EvaluationRow): boolean {
    return this.selectedRow?.id === row.id;
  }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  getTotalScore(): number {
    return this.currentScoresArray.reduce((sum, item) => sum + Number(item.value || 0), 0);
  }

  saveScore(): void {
    if (!this.selectedRow) return;

    const updatedScores: Record<string, number> = {};
    this.currentScoresArray.forEach(item => {
      updatedScores[item.key] = item.value;
    });

    this.selectedRow.scores = updatedScores;
    this.selectedRow.evalStatus = 'Reviewed';
    this.selectedRow.statusClass = 'reviewed';

    const total = this.getTotalScore();
    alert(`Score saved for ${this.selectedRow.teamName}.\nTotal: ${total}`);
  }
}
