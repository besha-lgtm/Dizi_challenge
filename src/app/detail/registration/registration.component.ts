import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @Input() challengeId: string | null = null;
  @Output() close = new EventEmitter<void>();

  members: { name: string, email: string }[] = [{ name: '', email: '' }];

  closeRegistration(): void {
    this.close.emit();
    this.members = [{ name: '', email: '' }];
  }

  addMember(): void {
    if (this.members.length < 4) {
      this.members.push({ name: '', email: '' });
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
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      challengeId: this.challengeId,
      teamName: formData.get('teamName'),
      teamLead: formData.get('teamLead'),
      members: this.members
    };
    
    console.log('Registration Data (Static):', data);
    alert('Registration Successful! (Static simulation)');
    this.closeRegistration();
  }
}
