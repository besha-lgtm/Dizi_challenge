import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

interface SubmissionData {
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
export class SubmissionComponent implements OnInit {
  submission: SubmissionData = {
    githubRepo: '',
    demoLink: '',
    solutionSummary: '',
    files: []
  };

  uploadedFiles: File[] = [];
  formError: string = '';
  formSuccess: string = '';
  isSubmitting: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Initialize component if needed
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

    // Validate form
    if (form.invalid) {
      this.formError = 'Please fill all required fields';
      return;
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/.+\/.+/i;
    if (this.submission.githubRepo && !githubUrlPattern.test(this.submission.githubRepo)) {
      this.formError = 'Please enter a valid GitHub repository URL';
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

    // Validate summary length
    if (this.submission.solutionSummary.trim().length < 20) {
      this.formError = 'Solution summary must be at least 20 characters long';
      return;
    }

    // Show success message
    this.isSubmitting = true;
    this.formSuccess = 'Solution submitted successfully!';
    console.log('Submission submitted with data:', {
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
        githubRepo: '',
        demoLink: '',
        solutionSummary: '',
        files: []
      };
      this.formSuccess = '';
      this.isSubmitting = false;
    }, 2000);
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
