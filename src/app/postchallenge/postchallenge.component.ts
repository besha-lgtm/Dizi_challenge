import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostchallengeService, ChallengePayload } from '../services/postchallenge.service';

// ── Types ──────────────────────────────────────────

interface FieldRule {
  fieldId: string;
  errorId: string;
  validate: (value: string) => boolean;
}

interface StepConfig {
  panelId: string;
  tabId: string;
  rules: FieldRule[];
}

@Component({
  selector: 'app-postchallenge',
  standalone: false,
  templateUrl: './postchallenge.component.html',
  styleUrl: './postchallenge.component.css'
})
export class PostchallengeComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private postchallengeService: PostchallengeService
  ) { }

  // ── State ──────────────────────────────────────────
  private currentStep = 1;
  private completedSteps = new Set<number>();
  private readonly TOTAL_STEPS = 3;
  private selectedDemoFiles: File[] = [];

  // ── Configuration ──────────────────────────────────
  private readonly STEP_CONFIGS: Record<number, StepConfig> = {
    1: {
      panelId: "panel-step-1",
      tabId: "tab-step-1",
      rules: [
        { fieldId: "challenge-title", errorId: "err-challenge-title", validate: (v) => v.trim().length >= 3 },
        { fieldId: "company-name", errorId: "err-company-name", validate: (v) => v.trim().length >= 2 },
        { fieldId: "sector", errorId: "err-sector", validate: (v) => v !== "" },
        { fieldId: "location", errorId: "err-location", validate: (v) => v.trim().length >= 3 },
        { fieldId: "contact-person", errorId: "err-contact-person", validate: (v) => v.trim().length >= 2 },
        { fieldId: "work-email", errorId: "err-work-email", validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) },
      ],
    },
    2: {
      panelId: "panel-step-2",
      tabId: "tab-step-2",
      rules: [
        { fieldId: "problem-description", errorId: "err-problem-description", validate: (v) => v.trim().length >= 20 },
        { fieldId: "expected-outcome", errorId: "err-expected-outcome", validate: (v) => v.trim().length >= 10 },
        { fieldId: "domain-skills", errorId: "err-domain-skills", validate: (v) => v !== "" },
        { fieldId: "eligibility", errorId: "err-eligibility", validate: (v) => v !== "" },
      ],
    },
    3: {
      panelId: "panel-step-3",
      tabId: "tab-step-3",
      rules: [
        { fieldId: "start-date", errorId: "err-start-date", validate: (v) => v !== "" },
        { fieldId: "submission-deadline", errorId: "err-submission-deadline", validate: (v) => v !== "" },
      ],
    },
  };

  ngOnInit() {
    // Basic initialization
  }

  ngAfterViewInit() {
    // Ensures the DOM is fully rendered before we attach our logic
    this.init();
  }

  // ── Helpers ────────────────────────────────────────

  private getEl<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  // ── Validation ─────────────────────────────────────

  private validateStep(step: number): boolean {
    const config = this.STEP_CONFIGS[step];
    if (!config) return true;

    let allValid = true;
    for (const rule of config.rules) {
      const field = this.getEl<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(rule.fieldId);
      const errorEl = this.getEl(rule.errorId);
      if (!field) continue;

      const isValid = rule.validate(field.value);
      this.applyFieldState(field, errorEl, isValid);
      if (!isValid) allValid = false;
    }
    return allValid;
  }

  private applyFieldState(
    field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    errorEl: HTMLElement | null,
    isValid: boolean
  ): void {
    if (isValid) {
      field.classList.remove("field-input--error", "field-select--error", "field-textarea--error");
      field.classList.add("field-input--valid");
      errorEl?.classList.remove("field-error--visible");

      const wrap = field.closest(".field-input-wrap");
      wrap?.querySelector(".field-input__icon--valid")?.classList.add("visible");
    } else {
      field.classList.remove("field-input--valid");
      const tagName = field.tagName.toLowerCase();
      if (tagName === "select") field.classList.add("field-select--error");
      else if (tagName === "textarea") field.classList.add("field-textarea--error");
      else field.classList.add("field-input--error");

      errorEl?.classList.add("field-error--visible");
      const wrap = field.closest(".field-input-wrap");
      wrap?.querySelector(".field-input__icon--valid")?.classList.remove("visible");
    }
  }

  private clearFieldError(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    field.classList.remove("field-input--error", "field-select--error", "field-textarea--error");
    this.getEl(`err-${field.id}`)?.classList.remove("field-error--visible");
  }

  // ── Navigation Logic ───────────────────────────────

  private nextStep(from: number): void {
    if (!this.validateStep(from)) {
      return;
    }
    this.completedSteps.add(from);
    this.currentStep = from + 1;
    this.updateUI();
  }

  private prevStep(from: number): void {
    this.currentStep = from - 1;
    this.updateUI();
  }

  private updateUI(): void {
    this.renderTabs();
    this.showPanel(this.currentStep);
    this.updateProgressBar(this.currentStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  private showPanel(step: number): void {
    for (let i = 1; i <= this.TOTAL_STEPS; i++) {
      const panel = this.getEl<HTMLElement>(`panel-step-${i}`);
      if (!panel) continue;
      if (i === step) {
        panel.removeAttribute("hidden");
        panel.classList.add("step-panel--active");
      } else {
        panel.setAttribute("hidden", "");
        panel.classList.remove("step-panel--active");
      }
    }
  }

  private renderTabs(): void {
    for (let i = 1; i <= this.TOTAL_STEPS; i++) {
      const tab = this.getEl<HTMLButtonElement>(`tab-step-${i}`);
      if (!tab) continue;
      tab.classList.remove("step-tab--active", "step-tab--completed");

      if (i === this.currentStep) {
        tab.classList.add("step-tab--active");
        tab.disabled = false;
      } else if (this.completedSteps.has(i)) {
        tab.classList.add("step-tab--completed");
        tab.disabled = false;
      } else {
        tab.disabled = true;
      }
    }
  }

  private updateProgressBar(step: number): void {
    const fill = this.getEl<HTMLElement>("progress-fill");
    if (fill) fill.style.width = `${((step / this.TOTAL_STEPS) * 100).toFixed(2)}%`;
  }

  // ── Prize Calculation (Rectified) ──────────────────

  private initPrizeListeners(): void {
    // Event delegation ensures listeners don't "die" when steps change
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target && target.id && target.id.startsWith('prize-')) {
        this.updatePrizeTotal();
      }
    });
  }

  private updatePrizeTotal(): void {
    const totalEl = this.getEl("prize-total");
    if (!totalEl) return;

    let total = 0;
    [1, 2, 3].forEach(i => {
      const input = this.getEl<HTMLInputElement>(`prize-${i}`);
      if (input) {
        total += Number(input.value) || 0;
      }
    });

    totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
  }

  // ── Actions (Publish & Save Draft) ─────────────────

  private publishChallenge(): void {
    if (!this.validateStep(3)) {
      return;
    }

    const start = this.getEl<HTMLInputElement>("start-date");
    const deadline = this.getEl<HTMLInputElement>("submission-deadline");
    if (start && deadline && new Date(deadline.value) <= new Date(start.value)) {
      deadline.classList.add("field-input--error");
      const err = this.getEl("err-submission-deadline");
      if (err) {
        err.textContent = "Deadline must be after the start date.";
        err.classList.add("field-error--visible");
      }
      return;
    }

    const btn = this.getEl<HTMLButtonElement>("btn-publish");
    if (btn) {
      btn.classList.add("btn--loading");
      btn.querySelector("span")!.textContent = "Publishing...";
    }

    // Prepare payload
    const payload: ChallengePayload = {
      companyInfo: {
        title: this.getEl<HTMLInputElement>("challenge-title")?.value || "",
        company_name: this.getEl<HTMLInputElement>("company-name")?.value || "",
        sector: this.getEl<HTMLSelectElement>("sector")?.value || "",
        location: this.getEl<HTMLInputElement>("location")?.value || "",
        contact_person: this.getEl<HTMLInputElement>("contact-person")?.value || "",
        email: this.getEl<HTMLInputElement>("work-email")?.value || "",
        company_website: this.getEl<HTMLInputElement>("company-website")?.value || "",
        company_description: this.getEl<HTMLTextAreaElement>("company-description")?.value || ""
      },
      problemDetails: {
        description: this.getEl<HTMLTextAreaElement>("problem-description")?.value || "",
        current_situation: this.getEl<HTMLTextAreaElement>("current-situation")?.value || "",
        expected_outcome: this.getEl<HTMLTextAreaElement>("expected-outcome")?.value || "",
        domain: this.getEl<HTMLSelectElement>("domain-skills")?.value || "",
        eligibility: this.getEl<HTMLSelectElement>("eligibility")?.value || ""
      },
      rewards: {
        prizes: [
          Number(this.getEl<HTMLInputElement>("prize-1")?.value) || 0,
          Number(this.getEl<HTMLInputElement>("prize-2")?.value) || 0,
          Number(this.getEl<HTMLInputElement>("prize-3")?.value) || 0
        ],
        total_pool: Number(this.getEl("prize-total")?.textContent?.replace(/[^0-9.-]+/g, "")) || 0,
        perks: Array.from(document.querySelectorAll<HTMLInputElement>('input[name="perks"]:checked')).map(i => i.value)
      },
      timeline: {
        start_date: start?.value || "",
        deadline: deadline?.value || ""
      }
    };

    this.postchallengeService.publishChallenge(payload).subscribe({
      next: (res) => {
        if (res.success) {
          const challengeId = res.id;
          if (this.selectedDemoFiles.length > 0 && challengeId) {
            if (btn) {
              btn.querySelector("span")!.textContent = "Uploading Demos...";
            }
            this.postchallengeService.uploadDemoFiles(challengeId, this.selectedDemoFiles).subscribe({
              next: (uploadRes) => {
                if (btn) {
                  btn.classList.remove("btn--loading");
                  btn.querySelector("span")!.textContent = "Publish Challenge";
                }
                this.getEl("success-overlay")?.removeAttribute("hidden");
              },
              error: (uploadErr) => {
                console.error('Error uploading demo files:', uploadErr);
                alert(`Challenge published but demo files upload failed: ${uploadErr.message}`);
                if (btn) {
                  btn.classList.remove("btn--loading");
                  btn.querySelector("span")!.textContent = "Publish Challenge";
                }
                this.getEl("success-overlay")?.removeAttribute("hidden");
              }
            });
          } else {
            if (btn) {
              btn.classList.remove("btn--loading");
              btn.querySelector("span")!.textContent = "Publish Challenge";
            }
            this.getEl("success-overlay")?.removeAttribute("hidden");
          }
        } else {
          if (btn) {
            btn.classList.remove("btn--loading");
            btn.querySelector("span")!.textContent = "Publish Challenge";
          }
          alert(res.message || 'Error publishing challenge');
        }
      },
      error: (err) => {
        console.error('Error publishing challenge:', err);
        if (btn) {
          btn.classList.remove("btn--loading");
          btn.querySelector("span")!.textContent = "Publish Challenge";
        }
      }
    });
  }


  private init(): void {
    this.updateUI();
    this.updatePrizeTotal();
    this.initPrizeListeners();
    this.initFieldListeners();
    this.initNavButtons();
    this.initDateValidation();
    this.initPrizeCards();
    this.initDemoFilesListener();

    console.info("[PostChallenge] Full System Rectified & Loaded ✓");
  }

  private initNavButtons(): void {
    document.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
      if (!target) return;

      const action = target.dataset["action"];
      const from = parseInt(target.dataset["from"] ?? "0", 10);

      if (action === "next") this.nextStep(from);
      if (action === "prev") this.prevStep(from);
      if (action === "publish") this.publishChallenge();
    });

    // Success Overlay Handlers
    this.getEl("btn-post-another")?.addEventListener("click", () => location.reload());
    this.getEl("btn-view-dashboard")?.addEventListener("click", () => this.router.navigate(['/challenges']));
    this.getEl("success-overlay")?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) (e.target as HTMLElement).setAttribute("hidden", "");
    });
  }

  private initFieldListeners(): void {
    document.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains("field-input")) {
        this.clearFieldError(target);
      }
    });
  }

  private initDateValidation(): void {
    const start = this.getEl<HTMLInputElement>("start-date");
    const deadline = this.getEl<HTMLInputElement>("submission-deadline");
    if (start && deadline) {
      start.min = new Date().toISOString().split("T")[0];
      start.addEventListener("change", () => {
        deadline.min = start.value;
      });
    }
  }

  private initPrizeCards(): void {
    document.querySelectorAll<HTMLElement>(".prize-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        document.querySelectorAll(".prize-card").forEach(c => c.classList.remove("prize-card--selected"));
        card.classList.add("prize-card--selected");
      });
    });
  }

  private initDemoFilesListener(): void {
    const btnSelect = this.getEl<HTMLButtonElement>("btn-select-demos");
    const fileInput = this.getEl<HTMLInputElement>("demo-files");

    btnSelect?.addEventListener("click", () => fileInput?.click());
    fileInput?.addEventListener("change", (e) => this.handleDemoFilesChange(e));
  }

  private handleDemoFilesChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const errEl = this.getEl("err-demo-files");
    if (errEl) {
      errEl.textContent = "";
      errEl.classList.remove("field-error--visible");
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.zip', '.jpg', '.jpeg', '.png', '.txt'];
    const maxSizeBytes = 20 * 1024 * 1024; // 20MB
    const maxFiles = 5;

    let errors: string[] = [];
    let validToAdd: File[] = [];

    for (const file of files) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        errors.push(`"${file.name}" is not a supported format.`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        errors.push(`"${file.name}" exceeds 20MB.`);
        continue;
      }
      validToAdd.push(file);
    }

    if (errors.length > 0) {
      if (errEl) {
        errEl.textContent = errors.join(" ");
        errEl.classList.add("field-error--visible");
      }
    }

    const existingNames = new Set(this.selectedDemoFiles.map(f => f.name));
    for (const file of validToAdd) {
      if (!existingNames.has(file.name)) {
        if (this.selectedDemoFiles.length < maxFiles) {
          this.selectedDemoFiles.push(file);
        } else {
          if (errEl) {
            errEl.textContent = `Maximum of ${maxFiles} files allowed. Some files were ignored.`;
            errEl.classList.add("field-error--visible");
          }
          break;
        }
      }
    }

    input.value = "";
    this.renderDemoFilesList();
  }

  private renderDemoFilesList(): void {
    const listEl = this.getEl("demo-files-list");
    if (!listEl) return;

    listEl.innerHTML = "";

    this.selectedDemoFiles.forEach((file, index) => {
      const fileRow = document.createElement("div");
      fileRow.style.display = "flex";
      fileRow.style.alignItems = "center";
      fileRow.style.justifyContent = "space-between";
      fileRow.style.padding = "8px 12px";
      fileRow.style.background = "#f1f5f9";
      fileRow.style.border = "1px solid #e2e8f0";
      fileRow.style.borderRadius = "6px";
      fileRow.style.fontSize = "13px";
      fileRow.style.color = "#334155";

      const infoSpan = document.createElement("span");
      infoSpan.style.display = "flex";
      infoSpan.style.alignItems = "center";
      infoSpan.style.gap = "8px";
      
      const sizeKB = (file.size / 1024).toFixed(1);
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${sizeKB} KB`;

      infoSpan.innerHTML = `📄 <strong style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</strong> <span style="color: #64748b; font-size: 11px;">(${sizeStr})</span>`;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "❌ Remove";
      removeBtn.style.background = "none";
      removeBtn.style.border = "none";
      removeBtn.style.color = "#ef4444";
      removeBtn.style.cursor = "pointer";
      removeBtn.style.fontSize = "12px";
      removeBtn.style.fontWeight = "600";
      removeBtn.style.padding = "2px 6px";
      removeBtn.style.borderRadius = "4px";

      removeBtn.addEventListener("mouseover", () => {
        removeBtn.style.backgroundColor = "#fee2e2";
      });
      removeBtn.addEventListener("mouseout", () => {
        removeBtn.style.backgroundColor = "transparent";
      });

      removeBtn.addEventListener("click", () => {
        this.selectedDemoFiles.splice(index, 1);
        this.renderDemoFilesList();
      });

      fileRow.appendChild(infoSpan);
      fileRow.appendChild(removeBtn);
      listEl.appendChild(fileRow);
    });
  }
}