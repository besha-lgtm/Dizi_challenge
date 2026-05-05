import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamsComponent } from '../../teams/teams.component';

interface ChallengeData {
  challengeTitle: string;
  companyName: string;
  sector: string;
  location: string;
  contactPerson: string;
  workEmail: string;
  problemDescription: string;
  currentSituation: string;
  expectedOutcome: string;
  domainSkills: string;
  eligibility: string;
  prize1: number;
  prize2: number;
  prize3: number;
  startDate: string;
  submissionDeadline: string;
  perks: string[];
}

interface Team {
  id: string;
  name: string;
  leadName: string;
  memberCount: number;
  description: string;
}

interface RegistrationRequest {
  participantEmail: string;
  participantName: string;
  registrationType: 'individual' | 'team';
  selectedTeamId?: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface TeamJoinRequest {
  requestId: string;
  participantName: string;
  participantEmail: string;
  teamId: string;
  teamName: string;
  teamLeadName: string;
  teamLeadEmail?: string;
  challengeTitle: string;
  message: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  openFaq: number | null = null;
  showRegistrationModal: boolean = false;
  showCreateTeamModal: boolean = false;
  registrationForm!: FormGroup;
  
  // Create team form properties
  createTeamForm: any = {
    name: '',
    challenge: '',
    domain: '',
    college: '',
    role: 'Leader',
    members: [{ name: '', email: '', college: '' }],
    progress: 0,
    submissions: 0,
    status: 'active',
    score: 0,
    comments: '',
    shortlisted: false
  };
  
  // Toast notification
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  
  // Dynamic teams data
  availableTeams: Team[] = [];

  challengeData: ChallengeData = {
    challengeTitle: 'Smart Water Management Challenge',
    companyName: 'Dizi Labs',
    sector: 'manufacturing',
    location: 'Bengaluru, India',
    contactPerson: 'Aarav Mehta',
    workEmail: 'aarav.mehta@dizilabs.com',
    problemDescription: 'Design an IoT-enabled monitoring solution that helps factories track water usage, detect leakage, and reduce wastage across production lines.',
    currentSituation: 'The facility currently relies on manual readings and delayed reports, making it difficult to identify abnormal consumption patterns quickly.',
    expectedOutcome: 'A working dashboard or prototype that provides real-time consumption insights, leak alerts, and actionable recommendations for operations teams.',
    domainSkills: 'iot-dashboard',
    eligibility: 'all',
    prize1: 75000,
    prize2: 50000,
    prize3: 25000,
    startDate: '2026-05-10',
    submissionDeadline: '2026-06-10',
    perks: ['Mentorship', 'Pilot Opportunity', 'Certificate']
  };

  constructor(private fb: FormBuilder) {
    this.initializeForm();
    this.loadTeamsData();
  }

  ngOnInit(): void {
    // Initialize teams data when component loads
    this.loadTeamsData();
  }

  /**
   * Load teams data from the same storage source used by CreateTeamComponent.
   */
  loadTeamsData(): void {
    const rawTeams = this.getRawTeamsData();

    this.availableTeams = rawTeams.map((team: any, index: number) => ({
      id: `team-${index + 1}`,
      name: team.name,
      leadName: this.getTeamLeadFromMembers(team),
      memberCount: team.members?.length || 0,
      description: `${team.domain} - ${team.college || 'No college'}`
    }));
  }

  private getRawTeamsData(): any[] {
    const savedTeams = localStorage.getItem('teams');

    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        return Array.isArray(parsedTeams) ? parsedTeams : [];
      } catch {
        return [];
      }
    }

    const teamsComp = new TeamsComponent(null!);
    return teamsComp.teams;
  }

  private getTeamLeadFromMembers(team: any): string {
    const firstMember = team.members?.[0];

    if (firstMember && typeof firstMember === 'object' && firstMember.name) {
      return firstMember.name;
    }

    if (typeof firstMember === 'string' && firstMember.trim()) {
      return firstMember;
    }

    return team.name?.split(' ')[0] || 'Team Lead';
  }

  /**
   * Initialize the registration form
   */
  initializeForm(): void {
    this.registrationForm = this.fb.group({
      participantName: ['', [Validators.required, Validators.minLength(2)]],
      participantEmail: ['', [Validators.required, Validators.email]],
      registrationType: ['individual', Validators.required],
      selectedTeamId: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Subscribe to registrationType changes
    this.registrationForm.get('registrationType')?.valueChanges.subscribe((value) => {
      const teamControl = this.registrationForm.get('selectedTeamId');
      if (value === 'team') {
        teamControl?.setValidators([Validators.required]);
      } else {
        teamControl?.clearValidators();
      }
      teamControl?.updateValueAndValidity();
    });
  }

  /**
   * Open registration modal
   */
  openRegistration(): void {
    this.showRegistrationModal = true;
  }

  /**
   * Close registration modal
   */
  closeRegistrationModal(): void {
    this.showRegistrationModal = false;
    this.registrationForm.reset({ registrationType: 'individual' });
  }

  /**
   * Handle registration form submission
   */
  submitRegistration(): void {
    if (this.registrationForm.invalid) {
      this.markFormGroupTouched(this.registrationForm);
      return;
    }

    const formData = this.registrationForm.value;
    
    // Handle different registration types
    if (formData.registrationType === 'team') {
      this.submitTeamJoinRequest(formData);
    } else {
      this.submitIndividualRegistration(formData);
    }
  }

  /**
   * Handle individual registration submission
   */
  submitIndividualRegistration(formData: any): void {
    const registrationRequest: RegistrationRequest = {
      participantEmail: formData.participantEmail,
      participantName: formData.participantName,
      registrationType: 'individual',
      message: formData.message,
      status: 'pending'
    };

    // Log for development
    console.log('Individual Registration Request:', registrationRequest);
    
    // TODO: Call service to send registration request to backend
    // this.registrationService.submitIndividualRegistration(registrationRequest).subscribe(...)
    
    // Show success message
    alert(`✓ Individual registration submitted successfully!\n\nWe'll review your application and get back to you soon.`);
    this.closeRegistrationModal();
  }

  /**
   * Handle team join request submission
   */
  submitTeamJoinRequest(formData: any): void {
    const selectedTeam = this.getSelectedTeam();
    
    if (!selectedTeam) {
      alert('Please select a team');
      return;
    }

    const teamJoinRequest: TeamJoinRequest = {
      requestId: 'req-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      participantName: formData.participantName,
      participantEmail: formData.participantEmail,
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      teamLeadName: selectedTeam.leadName,
      challengeTitle: this.challengeData.challengeTitle,
      message: formData.message,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Log for development
    console.log('Team Join Request:', teamJoinRequest);
    
    // TODO: Call service to send team join request to backend
    // this.registrationService.submitTeamJoinRequest(teamJoinRequest).subscribe(...)
    
    // Show success message
    alert(`✓ Join request sent to ${selectedTeam.name}!\n\nTeam lead: ${selectedTeam.leadName}\n\nThey will review your request and notify you soon.`);
    this.closeRegistrationModal();
  }

  /**
   * Get team name by ID
   */
  getTeamName(teamId?: string): string {
    if (!teamId) return '';
    const team = this.availableTeams.find(t => t.id === teamId);
    return team ? team.name : '';
  }

  /**
   * Get selected team object
   */
  getSelectedTeam(): Team | undefined {
    const teamId = this.registrationForm.get('selectedTeamId')?.value;
    if (!teamId) return undefined;
    return this.availableTeams.find(t => t.id === teamId);
  }

  /**
   * Get team lead name by ID
   */
  getTeamLeadName(teamId?: string): string {
    if (!teamId) return '';
    const team = this.availableTeams.find(t => t.id === teamId);
    return team ? team.leadName : '';
  }

  /**
   * Get team member count by ID
   */
  getTeamMemberCount(teamId?: string): number {
    if (!teamId) return 0;
    const team = this.availableTeams.find(t => t.id === teamId);
    return team ? team.memberCount : 0;
  }

  /**
   * Get team description by ID
   */
  getTeamDescription(teamId?: string): string {
    if (!teamId) return '';
    const team = this.availableTeams.find(t => t.id === teamId);
    return team ? team.description : '';
  }

  /**
   * Open create team modal
   */
  openCreateTeamModal(): void {
    this.showCreateTeamModal = true;
  }

  /**
   * Close create team modal
   */
  closeCreateTeamModal(): void {
    this.showCreateTeamModal = false;
    // Reload teams after creating new team
    this.loadTeamsData();
  }

  /**
   * Handle team creation from modal
   */
  onTeamCreated(newTeam: any): void {
    // Reload teams data
    this.loadTeamsData();
    // Close modal
    this.closeCreateTeamModal();
    // Optionally select the newly created team
    setTimeout(() => {
      const newTeamId = `team-${this.availableTeams.length}`;
      this.registrationForm.patchValue({ selectedTeamId: newTeamId });
    }, 100);
  }

  /**
   * Mark all form fields as touched (for validation display)
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }

  /**
   * Get sector display name
   */
  getSectorName(sector: string): string {
    const sectorMap: Record<string, string> = {
      'manufacturing': 'Manufacturing',
      'agriculture': 'Agriculture',
      'it': 'Information Technology',
      'healthcare': 'Healthcare',
      'logistics': 'Logistics & Supply Chain',
      'energy': 'Energy & Utilities',
      'education': 'Education',
      'retail': 'Retail & E-Commerce',
      'fintech': 'FinTech',
      'other': 'Other'
    };
    return sectorMap[sector] || sector;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /**
   * Get total prize pool
   */
  getTotalPrizePool(): number {
    return (this.challengeData?.prize1 || 0) + (this.challengeData?.prize2 || 0) + (this.challengeData?.prize3 || 0);
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  /**
   * Check if perk is selected
   */
  hasPerk(perkName: string): boolean {
    return this.challengeData?.perks?.includes(perkName) || false;
  }

  /**
   * Check if there are any perks
   */
  hasPerks(): boolean {
    return Array.isArray(this.challengeData?.perks) && this.challengeData.perks.length > 0;
  }

  /**
   * Check if challenge data is empty/not filled
   */
  hasData(): boolean {
    if (!this.challengeData) return false;
    
    // Check if at least one significant field is filled
    return !!(
      this.challengeData.challengeTitle?.trim() ||
      this.challengeData.companyName?.trim() ||
      this.challengeData.problemDescription?.trim() ||
      this.challengeData.startDate ||
      this.challengeData.prize1
    );
  }

  /**
   * Check if company info is available
   */
  hasCompanyInfo(): boolean {
    return !!(
      this.challengeData?.companyName?.trim() ||
      this.challengeData?.sector ||
      this.challengeData?.location?.trim()
    );
  }

  /**
   * Check if challenge overview is available
   */
  hasChallengeOverview(): boolean {
    return !!(
      this.challengeData?.challengeTitle?.trim() ||
      this.challengeData?.problemDescription?.trim()
    );
  }

  /**
   * Check if timeline data is available
   */
  hasTimeline(): boolean {
    return !!(this.challengeData?.startDate || this.challengeData?.submissionDeadline);
  }

  /**
   * Get domain/skills display name
   */
  getDomainName(domain: string | undefined): string {
    if (!domain) return '';
    const domainMap: Record<string, string> = {
      'iot-dashboard': 'IoT + Dashboard',
      'ml-ai': 'Machine Learning / AI',
      'web-dev': 'Web Development',
      'data-analytics': 'Data Analytics',
      'embedded': 'Embedded Systems',
      'mechanical': 'Mechanical Design',
      'civil': 'Civil / Structural',
      'chemical': 'Chemical Engineering',
      'other': 'Other'
    };
    return domainMap[domain] || domain;
  }

  /**
   * Get eligibility display name
   */
  getEligibilityName(eligibility: string | undefined): string {
    if (!eligibility) return '';
    const eligibilityMap: Record<string, string> = {
      'all': 'All Students',
      'ug': 'Undergraduate Only',
      'pg': 'Postgraduate Only',
      'final-year': 'Final Year Students',
      'stem': 'STEM Students'
    };
    return eligibilityMap[eligibility] || eligibility;
  }

  /**
   * Add a new member to create team form
   */
  addMember(): void {
    this.createTeamForm.members.push({
      name: '',
      email: '',
      college: ''
    });
  }

  /**
   * Remove a member from create team form
   */
  removeMember(index: number): void {
    if (this.createTeamForm.members.length > 1) {
      this.createTeamForm.members.splice(index, 1);
    }
  }

  /**
   * Submit create team form
   */
  submitCreateTeam(form: any): void {
    if (!form.valid) {
      this.showToastNotification('Please fill all required fields', 'error');
      return;
    }

    const trimmedTeamName = this.createTeamForm.name.trim();

    const teamData = {
      ...this.createTeamForm,
      name: trimmedTeamName,
      members: this.createTeamForm.members.map((member: any) => ({ ...member })),
      progress: this.createTeamForm.progress || 0,
      submissions: this.createTeamForm.submissions || 0,
      status: this.createTeamForm.status || 'active'
    };

    const teams = this.getRawTeamsData();
    const index = teams.findIndex((t: any) => t.name === teamData.name);

    if (index !== -1) {
      teams[index] = teamData;
    } else {
      teams.push(teamData);
    }

    localStorage.setItem('teams', JSON.stringify(teams));

    this.showToastNotification(`✓ Team "${teamData.name}" created successfully!`, 'success');
    this.loadTeamsData();
    this.closeCreateTeamModal();

    const createdTeam = this.availableTeams.find(team => team.name === teamData.name);
    if (createdTeam) {
      const newTeamId = createdTeam.id;
      this.registrationForm.patchValue({ selectedTeamId: newTeamId });
    }
  }

  /**
   * Show toast notification
   */
  showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }

  /**
   * Close toast notification
   */
  closeToast(): void {
    this.showToast = false;
  }
}
