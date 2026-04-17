import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor() {}

  ngOnInit(): void {}

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
}