import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { RegistrationService, TeamMember, PaidRegistrationPayload } from '../../services/registration.service';

declare var Razorpay: any;

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
  teamName = '';
  teamNameError: string | null = null;
  isCheckingTeamName = false;
  isSubmitting = false;
  isMarkingPaid = false;
  submitError: string | null = null;
  submitSuccess = false;
  submitSuccessMessage = 'Registration Successful! Your team has been registered.';

  constructor(
    private registrationService: RegistrationService,
    private ngZone: NgZone
  ) {}

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

  checkTeamName(): void {
    this.teamNameError = null;

    const trimmedName = this.teamName?.trim();
    if (!trimmedName || !this.challengeId) {
      return;
    }

    this.isCheckingTeamName = true;
    this.registrationService.checkTeamNameAvailability(this.challengeId, trimmedName).subscribe({
      next: (resp: { available: boolean }) => {
        this.isCheckingTeamName = false;
        this.teamNameError = resp.available ? null : 'This team name is already taken. Please choose a different name.';
      },
      error: (err: any) => {
        this.isCheckingTeamName = false;
        console.error('Team name check error:', err);
        this.teamNameError = 'Unable to verify team name uniqueness right now. Try again later.';
      }
    });
  }

  submitRegistration(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (this.isCheckingTeamName) {
      this.submitError = 'Please wait until the team name availability check completes.';
      return;
    }

    if (this.teamNameError) {
      this.submitError = this.teamNameError;
      return;
    }

    const formData = new FormData(form);
    const team_name = (formData.get('teamName') as string).trim();
    const team_lead = formData.get('teamLead') as string;

    this.isSubmitting = true;
    this.submitError = null;

    // Step 1: Create a payment order on the backend
    this.registrationService.createPaymentOrder(this.challengeId!).subscribe({
      next: (orderData: any) => {
        // Step 2: Open Razorpay checkout interface
        try {
          const options = {
            key: orderData.key_id,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'Dizi Challenge Registration',
            description: `Challenge Registration: ${team_name}`,
            order_id: orderData.order_id,
            handler: (paymentResponse: any) => {
              this.ngZone.run(() => {
                // Step 3: Complete registration on payment success
                const payload = {
                  challenge_id: this.challengeId!,
                  team_name: team_name,
                  team_lead: team_lead,
                  members: this.members,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature
                };

                this.completeRegistration(payload);
              });
            },
            prefill: {
              name: team_lead,
              email: this.members[0]?.email || '',
              contact: this.members[0]?.phone || ''
            },
            theme: {
              color: '#3b82f6' // Primary theme blue
            },
            modal: {
              ondismiss: () => {
                this.ngZone.run(() => {
                  this.isSubmitting = false;
                  this.submitError = 'Payment was cancelled. Your registration has not been completed.';
                });
              }
            }
          };

          const rzp = new Razorpay(options);
          rzp.open();
        } catch (err) {
          this.isSubmitting = false;
          this.submitError = 'Failed to load Razorpay checkout overlay.';
          console.error('Razorpay overlay error:', err);
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.submitError = err?.error?.message || 'Failed to initiate payment. Please try again.';
        console.error('Create order error:', err);
      }
    });
  }

  completeRegistration(payload: any): void {
    this.registrationService.registerTeam(payload).subscribe({
      next: (_res: any) => {
        this.isSubmitting = false;
        this.submitSuccessMessage = 'Registration Successful! Your team has been registered.';
        this.submitSuccess = true;
        setTimeout(() => this.closeRegistration(), 2500);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.submitError = err?.error?.message || 'Payment verified, but registration failed. Please contact support with payment ID: ' + payload.razorpay_payment_id;
        console.error('Registration completion error:', err);
      }
    });
  }

  markAsPaid(event: Event): void {
    event.preventDefault();
    const form = (event.target as HTMLElement).closest('form') as HTMLFormElement;

    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    if (this.isCheckingTeamName) {
      this.submitError = 'Please wait until the team name availability check completes.';
      return;
    }

    if (this.teamNameError) {
      this.submitError = this.teamNameError;
      return;
    }

    const formData = new FormData(form);
    const team_name = (formData.get('teamName') as string)?.trim();
    const team_lead = formData.get('teamLead') as string;

    if (!team_name || !team_lead) {
      this.submitError = 'Team name and team lead are required.';
      return;
    }

    const payload: PaidRegistrationPayload = {
      challenge_id: this.challengeId!,
      team_name,
      team_lead,
      members: this.members
    };

    this.isMarkingPaid = true;
    this.submitError = null;

    this.registrationService.registerPaidTeam(payload).subscribe({
      next: (_res: any) => {
        this.isMarkingPaid = false;
        this.submitSuccessMessage = 'Team registered as Already Paid successfully!';
        this.submitSuccess = true;
        setTimeout(() => this.closeRegistration(), 2500);
      },
      error: (err: any) => {
        this.isMarkingPaid = false;
        this.submitError = err?.error?.message || 'Failed to register team as paid. Please try again.';
        console.error('Mark-as-paid error:', err);
      }
    });
  }
}

