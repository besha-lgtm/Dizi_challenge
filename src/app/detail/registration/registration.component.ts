import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RegistrationService, TeamMember } from '../../services/registration.service';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @Input() challengeId: string | null = null;
  @Output() close = new EventEmitter<void>();

  members: TeamMember[] = [{ name: '', email: '', phone: '' }];
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  constructor(private registrationService: RegistrationService) {}

  closeRegistration(): void {
    this.close.emit();
    this.members = [{ name: '', email: '', phone: '' }];
    this.submitError = null;
    this.submitSuccess = false;
  }

  addMember(): void {
    if (this.members.length < 4) {
      this.members.push({ name: '', email: '', phone: '' });
    } else {
      alert('Maximum 4 members allowed');
    }
  }

  removeMember(index: number): void {
    if (this.members.length > 1) {
      this.members.splice(index, 1);
    }
  }

  submitRegistration(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const payload = {
      challenge_id: this.challengeId!,
      team_name: formData.get('teamName') as string,
      team_lead: formData.get('teamLead') as string,
      members: this.members
    };

    this.isSubmitting = true;
    this.submitError = null;

    this.registrationService.registerTeam(payload).subscribe({
      next: (_res: any) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        setTimeout(() => this.closeRegistration(), 2000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.submitError = err?.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }
}

