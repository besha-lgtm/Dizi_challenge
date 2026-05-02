import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChallengeService } from '../services/challenge.service';

// ── Types ──────────────────────────────────────────

interface FieldRule {
  fieldId: string;
  errorId: string;
  validate: (value: string) => boolean;
}

interface SubmissionData {
  hackathonName: string;
  college: string;
  githubRepo: string;
  demoLink: string;
  solutionSummary: string;
  files: File[];
}

interface Challenge {
  id: number;
  title: string;
  sectors: string[];
  partner: string;
  location: string;
  daysLeft: number;
  dateMessage: string;
  prize: number;
  teams: number;
  status: 'open' | 'closing' | 'new' | 'upcoming' | 'closed';
}

interface Team {
  name: string;
  challenge: string;
  domain: string;
  college: string;
  role: string;
  teamLead?: string;
  members: string[];
  progress: number;
  submissions: number;
  status: string;
  score: number;
  comments: string;
  shortlisted: boolean;
}

@Component({
  selector: 'app-submission',
  standalone: false,
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.css'
})
export class SubmissionComponent implements OnInit, AfterViewInit {
  submission: SubmissionData = {
    hackathonName: '',
    college: '',
    githubRepo: '',
    demoLink: '',
    solutionSummary: '',
    files: []
  };

  uploadedFiles: File[] = [];
  formError: string = '';
  formSuccess: string = '';
  isSubmitting: boolean = false;

  // Search inputs
  challengeSearch: string = '';
  teamSearch: string = '';
  showChallengeDropdown: boolean = false;
  showTeamDropdown: boolean = false;

  // Selected values
  selectedChallenge: Challenge | null = null;
  selectedTeam: Team | null = null;

  // Data
  challenges: Challenge[] = [];
  teams: Team[] = [];

  // Filtered data for dropdowns
  filteredChallenges: Challenge[] = [];
  filteredTeams: Team[] = [];
  recentChallenges: Challenge[] = [];

  // Form state
  isFormEnabled: boolean = false;

  // ── Validation Configuration ───────────────────────
  private readonly FIELD_RULES: FieldRule[] = [
    { 
      fieldId: "hackathonName", 
      errorId: "err-hackathonName", 
      validate: (v) => v.trim().length > 0
    },
    { 
      fieldId: "college", 
      errorId: "err-college", 
      validate: (v) => v.trim().length > 0
    },
    { 
      fieldId: "githubRepo", 
      errorId: "err-githubRepo", 
      validate: (v) => /^https:\/\/github\.com\/.+\/.+/i.test(v.trim()) && v.trim().length > 0
    },
    { 
      fieldId: "solutionSummary", 
      errorId: "err-solutionSummary", 
      validate: (v) => v.trim().length >= 20
    },
  ];

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.loadChallenges();
    this.teams = [];
    this.filteredTeams = [];
  }

  ngAfterViewInit(): void {
    this.initFieldListeners();
  }

  // ── Helpers ────────────────────────────────────────

  private getEl<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  // ── Field Validation ───────────────────────────────

  private validateField(fieldId: string): boolean {
    const rule = this.FIELD_RULES.find(r => r.fieldId === fieldId);
    if (!rule) return true;

    const field = this.getEl<HTMLInputElement | HTMLTextAreaElement>(rule.fieldId);
    const errorEl = this.getEl(rule.errorId);
    if (!field) return true;

    const isValid = rule.validate(field.value);
    this.applyFieldState(field, errorEl, isValid);
    return isValid;
  }

  private validateAllFields(): boolean {
    let allValid = true;
    for (const rule of this.FIELD_RULES) {
      const field = this.getEl<HTMLInputElement | HTMLTextAreaElement>(rule.fieldId);
      const errorEl = this.getEl(rule.errorId);
      if (!field) continue;

      const isValid = rule.validate(field.value);
      this.applyFieldState(field, errorEl, isValid);
      if (!isValid) allValid = false;
    }
    return allValid;
  }

  private applyFieldState(
    field: HTMLInputElement | HTMLTextAreaElement,
    errorEl: HTMLElement | null,
    isValid: boolean
  ): void {
    if (isValid) {
      field.classList.remove("field-input--error", "field-textarea--error");
      field.classList.add("field-input--valid");
      errorEl?.classList.remove("field-error--visible");
    } else {
      field.classList.remove("field-input--valid");
      const tagName = field.tagName.toLowerCase();
      if (tagName === "textarea") field.classList.add("field-textarea--error");
      else field.classList.add("field-input--error");
      
      errorEl?.classList.add("field-error--visible");
    }
  }

  private clearFieldError(fieldId: string): void {
    const field = this.getEl<HTMLInputElement | HTMLTextAreaElement>(fieldId);
    if (!field) return;
    field.classList.remove("field-input--error", "field-textarea--error");
    this.getEl(`err-${fieldId}`)?.classList.remove("field-error--visible");
  }

  // ── Field Listeners ────────────────────────────────

  private initFieldListeners(): void {
    // Listen to input/change events for field validation
    this.FIELD_RULES.forEach(rule => {
      const field = this.getEl<HTMLInputElement | HTMLTextAreaElement>(rule.fieldId);
      if (!field) return;

      field.addEventListener('input', () => {
        if (field.classList.contains('field-input--error') || field.classList.contains('field-textarea--error')) {
          this.validateField(rule.fieldId);
        }
      });

      field.addEventListener('blur', () => {
        this.validateField(rule.fieldId);
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadedFiles = Array.from(input.files);
      this.submission.files = this.uploadedFiles;
    }
  }

  onDropZone(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      this.uploadedFiles = Array.from(event.dataTransfer.files);
      this.submission.files = this.uploadedFiles;
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.submission.files = this.uploadedFiles;
  }

  onSubmit(form: NgForm): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Force validation of all fields first
    this.validateAllFields();

    // Check if validation passed
    const hackathonName = this.getEl<HTMLInputElement>("hackathonName");
    const college = this.getEl<HTMLInputElement>("college");
    const githubRepo = this.getEl<HTMLInputElement>("githubRepo");
    const solutionSummary = this.getEl<HTMLTextAreaElement>("solutionSummary");
    
    const hackathonValid = hackathonName && hackathonName.value.trim().length > 0;
    const collegeValid = college && college.value.trim().length > 0;
    const githubValid = githubRepo && /^https:\/\/github\.com\/.+\/.+/i.test(githubRepo.value.trim());
    const summaryValid = solutionSummary && solutionSummary.value.trim().length >= 20;

    if (!hackathonValid || !collegeValid || !githubValid || !summaryValid) {
      this.formError = 'Please fill all required fields correctly';
      return;
    }

    // Validate demo URL if provided
    if (this.submission.demoLink) {
      try {
        new URL(this.submission.demoLink);
      } catch {
        this.formError = 'Please enter a valid demo/video URL';
        return;
      }
    }

    // Show success message
    this.isSubmitting = true;
    this.formSuccess = 'Solution submitted successfully!';
    console.log('Submission submitted with data:', {
      hackathonName: this.submission.hackathonName,
      college: this.submission.college,
      githubRepo: this.submission.githubRepo,
      demoLink: this.submission.demoLink,
      solutionSummary: this.submission.solutionSummary,
      filesCount: this.uploadedFiles.length
    });

    // Reset form after successful submission
    setTimeout(() => {
      form.resetForm();
      this.uploadedFiles = [];
      this.submission = {
        hackathonName: '',
        college: '',
        githubRepo: '',
        demoLink: '',
        solutionSummary: '',
        files: []
      };
      this.formSuccess = '';
      this.isSubmitting = false;
      // Clear all error states
      this.FIELD_RULES.forEach(rule => {
        const field = this.getEl<HTMLInputElement | HTMLTextAreaElement>(rule.fieldId);
        if (field) {
          field.classList.remove("field-input--error", "field-textarea--error", "field-input--valid");
        }
        const errorEl = this.getEl(rule.errorId);
        if (errorEl) {
          errorEl.classList.remove("field-error--visible");
        }
      });
    }, 2000);
  }

  saveDraft(form: NgForm): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Validate at least GitHub repo
    const githubRepo = this.getEl<HTMLInputElement>("githubRepo");
    if (!githubRepo || !githubRepo.value.trim()) {
      this.formError = 'Please enter GitHub repository URL to save draft';
      return;
    }

    // Show draft saved message
    this.formSuccess = 'Draft saved successfully!';
    console.log('Draft saved with data:', {
      hackathonName: this.submission.hackathonName,
      college: this.submission.college,
      githubRepo: this.submission.githubRepo,
      demoLink: this.submission.demoLink,
      solutionSummary: this.submission.solutionSummary,
      filesCount: this.uploadedFiles.length
    });

    setTimeout(() => {
      this.formSuccess = '';
    }, 2000);
  }

  // ── Data Loading ───────────────────────────────────

  private loadChallenges(): void {
    this.challengeService.getChallenges().subscribe({
      next: (data) => {
        this.challenges = data.map(item => ({
          id: item.id,
          title: item.title,
          sectors: [item.sector, item.domain].filter(Boolean),
          partner: item.partner,
          location: item.location,
          daysLeft: this.calculateDaysLeft(item.deadline),
          dateMessage: this.getDateMessage(item.start_date, item.deadline),
          prize: item.prize,
          teams: item.teams_registered || 0,
          status: this.getChallengeStatus(item.start_date, item.deadline)
        }));
        this.filteredChallenges = [...this.challenges];
      },
      error: (error) => {
        console.error('Error loading challenges:', error);
        // Fallback to sample data if API fails
        this.challenges = this.getSampleChallenges();
        this.filteredChallenges = [...this.challenges];
      }
    });
  }

  private loadTeamsForChallenge(challengeId: number): void {
    this.challengeService.getRegistrations(challengeId).subscribe({
      next: (data) => {
        this.teams = data.map(item => ({
          name: item.team_name || item.name || 'Unnamed Team',
          challenge: this.selectedChallenge?.title || '',
          domain: '',
          college: item.college || '',
          role: 'Leader',
          teamLead: item.team_lead || item.teamLead || '',
          members: item.members || [],
          progress: 0,
          submissions: 0,
          status: 'active',
          score: 0,
          comments: '',
          shortlisted: false
        }));
        this.filteredTeams = [...this.teams];
        this.showTeamDropdown = this.filteredTeams.length > 0;
      },
      error: (error) => {
        console.error('Team registration load failed:', error);
        this.teams = this.getSampleTeams();
        this.filteredTeams = [...this.teams];
        this.showTeamDropdown = this.filteredTeams.length > 0;
      }
    });
  }

  // ── Search Handlers ────────────────────────────────

  onChallengeSearchChange(query: string): void {
    this.challengeSearch = query;
    if (query.trim()) {
      this.filteredChallenges = this.challenges.filter(challenge =>
        challenge.title.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredChallenges = [...this.challenges];
    }
    this.showChallengeDropdown = true;
  }

  onTeamSearchChange(query: string): void {
    this.teamSearch = query;
    if (query.trim()) {
      this.filteredTeams = this.teams.filter(team =>
        team.name.toLowerCase().includes(query.toLowerCase()) ||
        (team.teamLead || '').toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredTeams = [...this.teams];
    }
    this.showTeamDropdown = this.selectedChallenge !== null && this.filteredTeams.length > 0;
  }

  selectChallenge(challenge: Challenge): void {
    this.selectedChallenge = challenge;
    this.submission.hackathonName = challenge.title;
    this.challengeSearch = challenge.title;
    this.teamSearch = '';
    this.selectedTeam = null;
    this.submission.college = '';
    this.showChallengeDropdown = false;
    this.loadTeamsForChallenge(challenge.id);
    this.checkFormEnablement();
  }

  selectTeam(team: Team): void {
    this.selectedTeam = team;
    this.submission.college = team.college;
    this.teamSearch = team.name;
    this.showTeamDropdown = false;
    this.checkFormEnablement();
  }

  private checkFormEnablement(): void {
    this.isFormEnabled = this.selectedChallenge !== null && this.selectedTeam !== null;
  }

  hideDropdowns(): void {
    this.showChallengeDropdown = false;
    this.showTeamDropdown = false;
  }

  onBlurChallenge(): void {
    setTimeout(() => this.hideDropdowns(), 200);
  }

  onBlurTeam(): void {
    setTimeout(() => this.hideDropdowns(), 200);
  }

  // ── Helper Methods ─────────────────────────────────

  private calculateDaysLeft(deadline: string): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getDateMessage(startDate: string, deadline: string): string {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(deadline);

    if (now < start) {
      return `Starts ${this.formatDate(start)}`;
    } else if (now <= end) {
      return `${this.calculateDaysLeft(deadline)} days left`;
    } else {
      return 'Closed';
    }
  }

  private getChallengeStatus(startDate: string, deadline: string): 'open' | 'closing' | 'new' | 'upcoming' | 'closed' {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(deadline);

    if (now < start) return 'upcoming';
    if (now > end) return 'closed';

    const daysLeft = this.calculateDaysLeft(deadline);
    if (daysLeft <= 3) return 'closing';
    if (daysLeft <= 7) return 'new';
    return 'open';
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  private getSampleChallenges(): Challenge[] {
    return [
      {
        id: 1,
        title: 'Reduce Power Loss in Corrugation Plant',
        sectors: ['Manufacturing', 'Energy'],
        partner: 'Corrugation Industries Ltd',
        location: 'Hyderabad',
        daysLeft: 15,
        dateMessage: '15 days left',
        prize: 50000,
        teams: 12,
        status: 'open'
      },
      {
        id: 2,
        title: 'Smart Water Quality Monitoring',
        sectors: ['Environment', 'IoT'],
        partner: 'Hyderabad Water Board',
        location: 'Hyderabad',
        daysLeft: 8,
        dateMessage: '8 days left',
        prize: 30000,
        teams: 8,
        status: 'new'
      }
    ];
  }

  private getSampleTeams(): Team[] {
    return [
      {
        name: 'Team Alpha Innovators',
        challenge: 'Power Loss Reduction',
        domain: 'IoT',
        college: 'ANITS, Vizag',
        role: 'Leader',
        members: ['Deepika', 'Ravi', 'Kiran'],
        progress: 65,
        submissions: 2,
        status: 'active',
        score: 82,
        comments: 'Good approach, improve optimization',
        shortlisted: true
      },
      {
        name: 'Green Vision',
        challenge: 'Energy Efficiency Optimization',
        domain: 'Renewable Energy',
        college: 'KL University, Hyderabad',
        role: 'Member',
        members: ['Priya', 'Suresh'],
        progress: 40,
        submissions: 3,
        status: 'active',
        score: 70,
        comments: 'Needs more data validation',
        shortlisted: false
      },
      {
        name: 'Agri Vision AI',
        challenge: 'Crop Disease Detection',
        domain: 'AI',
        college: 'IIT Hyderabad',
        role: 'Member',
        members: ['Karthik', 'Anil'],
        progress: 100,
        submissions: 5,
        status: 'completed',
        score: 91,
        comments: 'Excellent model accuracy',
        shortlisted: true
      }
    ];
  }
}