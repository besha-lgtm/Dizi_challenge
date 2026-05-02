import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChallengeService } from '../services/challenge.service';
import { SubmissionService } from '../services/submission.service';

// ── Types ──────────────────────────────────────────

interface FieldRule {
  fieldId: string;
  errorId: string;
  validate: (value: string) => boolean;
}

interface SubmissionData {
  solutionFile: File | null;
  demoFiles: File[];
  pptFile: File | null;
  documentationFiles: File[];
  githubRepo: string;
  liveLink: string;
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
    solutionFile: null,
    demoFiles: [],
    pptFile: null,
    documentationFiles: [],
    githubRepo: '',
    liveLink: ''
  };

  solutionFile: File | null = null;
  demoFiles: File[] = [];
  pptFile: File | null = null;
  documentationFiles: File[] = [];
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

  // Form state
  isFormEnabled: boolean = false;
  showSuccessToast: boolean = false;

  // File input references
  @ViewChild('solutionFileInput') solutionFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('demoFilesInput') demoFilesInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pptFileInput') pptFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('documentationFilesInput') documentationFilesInput!: ElementRef<HTMLInputElement>;

  // ── Computed: all required fields filled ─────────────────
  get isReadyToSubmit(): boolean {
    return this.isFormEnabled &&
           this.solutionFile !== null &&
           this.demoFiles.length > 0 &&
           this.pptFile !== null &&
           this.documentationFiles.length > 0 &&
           /^https:\/\/github\.com\/.+\/.+/i.test((this.submission.githubRepo || '').trim());
  }

  // ── Validation Configuration ───────────────────────
  private readonly FIELD_RULES: FieldRule[] = [
    {
      fieldId: "solutionFile",
      errorId: "err-solutionFile",
      validate: (v) => this.solutionFile !== null
    },
    {
      fieldId: "demoFiles",
      errorId: "err-demoFiles",
      validate: (v) => this.demoFiles.length > 0
    },
    {
      fieldId: "pptFile",
      errorId: "err-pptFile",
      validate: (v) => this.pptFile !== null
    },
    {
      fieldId: "documentationFiles",
      errorId: "err-documentationFiles",
      validate: (v) => this.documentationFiles.length > 0
    },
    {
      fieldId: "githubRepo",
      errorId: "err-githubRepo",
      validate: (v) => /^https:\/\/github\.com\/.+\/.+/i.test(v.trim()) && v.trim().length > 0
    }
  ];

  constructor(
    private challengeService: ChallengeService,
    private submissionService: SubmissionService
  ) {}

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

  // ── File Input Click Handlers ──────────────────────

  openSolutionFileDialog(): void {
    this.solutionFileInput.nativeElement.click();
  }

  openDemoFilesDialog(): void {
    this.demoFilesInput.nativeElement.click();
  }

  openPptFileDialog(): void {
    this.pptFileInput.nativeElement.click();
  }

  openDocumentationFilesDialog(): void {
    this.documentationFilesInput.nativeElement.click();
  }

  onSolutionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (this.validateFile(file, 'solution')) {
        this.solutionFile = file;
        this.submission.solutionFile = file;
      }
    }
  }

  onDemoFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      const validFiles = newFiles.filter(file => this.validateFile(file, 'demo'));
      // Append new files, skipping duplicates (same name + same size)
      validFiles.forEach(newFile => {
        const isDuplicate = this.demoFiles.some(
          existing => existing.name === newFile.name && existing.size === newFile.size
        );
        if (!isDuplicate) {
          this.demoFiles.push(newFile);
        }
      });
      this.submission.demoFiles = this.demoFiles;
      // Reset input value so the same file can be re-selected after removal
      input.value = '';
    }
  }

  onPptFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (this.validateFile(file, 'ppt')) {
        this.pptFile = file;
        this.submission.pptFile = file;
      }
    }
  }

  onDocumentationFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      const validFiles = newFiles.filter(file => this.validateFile(file, 'documentation'));
      // Append new files, skipping duplicates (same name + same size)
      validFiles.forEach(newFile => {
        const isDuplicate = this.documentationFiles.some(
          existing => existing.name === newFile.name && existing.size === newFile.size
        );
        if (!isDuplicate) {
          this.documentationFiles.push(newFile);
        }
      });
      this.submission.documentationFiles = this.documentationFiles;
      // Reset input value so the same file can be re-selected after removal
      input.value = '';
    }
  }

  removeSolutionFile(): void {
    this.solutionFile = null;
    this.submission.solutionFile = null;
  }

  removeDemoFile(index: number): void {
    this.demoFiles.splice(index, 1);
    this.submission.demoFiles = [...this.demoFiles];
  }

  removePptFile(): void {
    this.pptFile = null;
    this.submission.pptFile = null;
    this.pptFileInput.nativeElement.value = '';
  }

  removeDocumentationFile(index: number): void {
    this.documentationFiles.splice(index, 1);
    this.submission.documentationFiles = [...this.documentationFiles];
  }

  clearDemoFiles(): void {
    this.demoFiles = [];
    this.submission.demoFiles = [];
    this.demoFilesInput.nativeElement.value = '';
  }

  clearDocumentationFiles(): void {
    this.documentationFiles = [];
    this.submission.documentationFiles = [];
    this.documentationFilesInput.nativeElement.value = '';
  }

  private validateFile(file: File, type: string): boolean {
    const maxSizes = {
      solution: 20 * 1024 * 1024, // 20MB
      demo: 20 * 1024 * 1024, // 20MB per file
      ppt: 10 * 1024 * 1024, // 10MB
      documentation: 20 * 1024 * 1024 // 20MB per file
    };

    const allowedTypes = {
      solution: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
      demo: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/quicktime'],
      ppt: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
      documentation: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip', 'application/x-rar-compressed']
    };

    if (file.size > maxSizes[type as keyof typeof maxSizes]) {
      this.formError = `File size exceeds limit for ${type} files`;
      return false;
    }

    if (!allowedTypes[type as keyof typeof allowedTypes].includes(file.type)) {
      this.formError = `Invalid file type for ${type} files`;
      return false;
    }

    return true;
  }

  onSubmit(form: NgForm): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Force validation of all fields first
    this.validateAllFields();

    // Check required fields
    const isValid = this.solutionFile !== null &&
                   this.demoFiles.length > 0 &&
                   this.pptFile !== null &&
                   this.documentationFiles.length > 0 &&
                   /^https:\/\/github\.com\/.+\/.+/i.test(this.submission.githubRepo.trim());

    if (!isValid) {
      this.formError = 'Please fill all required fields correctly';
      return;
    }

    // Validate live link if provided
    if (this.submission.liveLink) {
      try {
        new URL(this.submission.liveLink);
      } catch {
        this.formError = 'Please enter a valid live demo URL';
        return;
      }
    }

    // Show submitting state
    this.isSubmitting = true;

    const payload = {
      challenge_id: this.selectedChallenge!.id,
      team_name: this.selectedTeam!.name,
      github_repo: this.submission.githubRepo,
      live_link: this.submission.liveLink || undefined,
      solution_file: this.solutionFile!,
      ppt_file: this.pptFile!,
      demo_files: this.demoFiles,
      documentation_files: this.documentationFiles
    };

    this.submissionService.submitSolution(payload).subscribe({
      next: (response) => {
        // Show toast
        this.showSuccessToast = true;
        this.isSubmitting = false;

        // Full reset after 2.5 seconds
        setTimeout(() => {
          this.showSuccessToast = false;

          // Reset form fields
          form.resetForm();
          this.solutionFile = null;
          this.demoFiles = [];
          this.pptFile = null;
          this.documentationFiles = [];
          this.solutionFileInput.nativeElement.value = '';
          this.demoFilesInput.nativeElement.value = '';
          this.pptFileInput.nativeElement.value = '';
          this.documentationFilesInput.nativeElement.value = '';
          this.submission = {
            solutionFile: null,
            demoFiles: [],
            pptFile: null,
            documentationFiles: [],
            githubRepo: '',
            liveLink: ''
          };

          // Reset search dropdowns
          this.challengeSearch = '';
          this.teamSearch = '';
          this.selectedChallenge = null;
          this.selectedTeam = null;
          this.isFormEnabled = false;
          this.showChallengeDropdown = false;
          this.showTeamDropdown = false;
          this.filteredTeams = [];

          // Clear validation states
          this.FIELD_RULES.forEach(rule => {
            const field = this.getEl<HTMLInputElement | HTMLTextAreaElement>(rule.fieldId);
            if (field) field.classList.remove('field-input--error', 'field-textarea--error', 'field-input--valid');
            this.getEl(rule.errorId)?.classList.remove('field-error--visible');
          });
        }, 2500);
      },
      error: (error) => {
        this.isSubmitting = false;
        const msg = error?.error?.message || 'Submission failed. Please try again.';
        this.formError = msg;
        console.error('Submission error:', error);
      }
    });
  }

  saveDraft(form: NgForm): void {
    // Clear previous messages
    this.formError = '';
    this.formSuccess = '';

    // Validate at least GitHub repo
    if (!this.submission.githubRepo.trim()) {
      this.formError = 'Please enter GitHub repository URL to save draft';
      return;
    }

    // Show draft saved message
    this.formSuccess = 'Draft saved successfully!';
    console.log('Draft saved with data:', {
      challenge: this.selectedChallenge?.title,
      team: this.selectedTeam?.name,
      solutionFile: this.solutionFile?.name,
      demoFilesCount: this.demoFiles.length,
      pptFile: this.pptFile?.name,
      documentationFilesCount: this.documentationFiles.length,
      githubRepo: this.submission.githubRepo,
      liveLink: this.submission.liveLink
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
    this.challengeSearch = challenge.title;
    this.teamSearch = '';
    this.selectedTeam = null;
    this.showChallengeDropdown = false;
    this.loadTeamsForChallenge(challenge.id);
    this.checkFormEnablement();
  }

  selectTeam(team: Team): void {
    this.selectedTeam = team;
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