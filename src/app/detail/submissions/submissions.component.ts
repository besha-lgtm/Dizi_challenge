import { Component, OnInit } from '@angular/core';

export interface SubmissionRow {
  id: number;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'draft';
  formName: string;
  formVersion: string;
  submittedBy: string;
  email: string;
  hackathonName: string;
  college: string;
  githubRepo: string;
  demoLink: string;
  solutionSummary: string;
  filesCount: number;
  fileNames: string[];
  teamSize: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-submissions',
  standalone: false,
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css'
})
export class SubmissionsComponent implements OnInit {

  searchQuery = '';
  activeStatus = 'all';
  fileFilter: 'all' | 'with' | 'without' = 'all';
  showFilterDropdown = false;
  currentPage = 1;
  rowsPerPage = 5;
  selectedRow: SubmissionRow | null = null;

  statusOptions = [
    { key: 'all',          label: 'Active'       },
    { key: 'submitted',    label: 'Submitted'    },
    { key: 'under_review', label: 'Under Review' },
    { key: 'shortlisted',  label: 'Shortlisted'  },
    { key: 'rejected',     label: 'Rejected'     },
    { key: 'draft',        label: 'Draft'        },
  ];

  rows: SubmissionRow[] = [
    {
      id: 1,
      status: 'under_review',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Arjun Mehta',
      email: 'arjun.mehta@iit.ac.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'IIT Hyderabad',
      githubRepo: 'https://github.com/arjunmehta/energy-monitor',
      demoLink: 'https://youtu.be/demo-arjun',
      solutionSummary: 'We designed a low-cost ESP32-based energy monitoring system using CT clamps per production line, publishing data to an MQTT broker and visualising it via a custom Grafana dashboard. The system detects idle-state overdraws and triggers WhatsApp alerts to shift supervisors in real time.',
      filesCount: 3,
      fileNames: ['solution_doc.pdf', 'architecture_slides.pptx', 'demo_screenshot.png'],
      teamSize: 3,
      createdAt: '10 Apr 2026',
      updatedAt: '12 Apr 2026',
    },
    {
      id: 2,
      status: 'submitted',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Priya Nandakumar',
      email: 'priya.n@bits-pilani.ac.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'BITS Pilani',
      githubRepo: 'https://github.com/priya-nk/corrugation-iot',
      demoLink: 'https://drive.google.com/file/demo-priya',
      solutionSummary: 'Our approach uses a Raspberry Pi gateway collecting data from 6 Modbus-enabled smart meters, one per corrugation line. Data is stored in InfluxDB and served through a React dashboard with shift-level anomaly scoring using Isolation Forest.',
      filesCount: 2,
      fileNames: ['report_final.pdf', 'implementation_plan.xlsx'],
      teamSize: 4,
      createdAt: '09 Apr 2026',
      updatedAt: '11 Apr 2026',
    },
    {
      id: 3,
      status: 'shortlisted',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Karthik Srinivas',
      email: 'karthik.s@nitt.edu',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'NIT Trichy',
      githubRepo: 'https://github.com/karthiks/power-loss-detection',
      demoLink: '',
      solutionSummary: 'We propose a hybrid edge-cloud solution using Shelly EM energy meters with Node-RED for data orchestration. The solution requires zero custom hardware, is deployable in under 2 weeks, and costs approximately ₹38,000 for 6 lines.',
      filesCount: 4,
      fileNames: ['solution_brief.pdf', 'presentation.pptx', 'cost_breakdown.xlsx', 'circuit_diagram.png'],
      teamSize: 2,
      createdAt: '08 Apr 2026',
      updatedAt: '12 Apr 2026',
    },
    {
      id: 4,
      status: 'submitted',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Sneha Iyer',
      email: 'sneha.iyer@vit.ac.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'VIT Vellore',
      githubRepo: 'https://github.com/sneha-iyer/ems-dashboard',
      demoLink: 'https://youtu.be/demo-sneha',
      solutionSummary: 'A fully cloud-native solution using Azure IoT Hub for device management, Power BI Embedded for dashboards, and Azure Stream Analytics for real-time anomaly detection. The system integrates with the existing ERP via REST APIs.',
      filesCount: 1,
      fileNames: ['full_proposal.pdf'],
      teamSize: 3,
      createdAt: '07 Apr 2026',
      updatedAt: '10 Apr 2026',
    },
    {
      id: 5,
      status: 'under_review',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Dev Pillai',
      email: 'dev.pillai@manipal.edu',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'Manipal Institute of Technology',
      githubRepo: 'https://github.com/devpillai/energy-ml',
      demoLink: 'https://youtu.be/demo-dev',
      solutionSummary: 'Our ML-augmented monitoring system uses LSTM networks trained on historical energy logs to predict consumption spikes 15 minutes ahead. Combined with CT clamp sensors and a Streamlit dashboard, this gives supervisors both real-time data and predictive alerts.',
      filesCount: 5,
      fileNames: ['report.pdf', 'slides.pptx', 'model_notebook.zip', 'data_sample.csv', 'demo_video.mp4'],
      teamSize: 4,
      createdAt: '06 Apr 2026',
      updatedAt: '11 Apr 2026',
    },
    {
      id: 6,
      status: 'rejected',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Meera Choudhary',
      email: 'meera.c@srm.edu.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'SRM Institute of Science and Technology',
      githubRepo: '',
      demoLink: '',
      solutionSummary: 'Proposal to install traditional PLC-based SCADA system at a cost of ₹2.4 lakhs. Does not meet the ₹50k budget constraint.',
      filesCount: 1,
      fileNames: ['proposal.pdf'],
      teamSize: 2,
      createdAt: '05 Apr 2026',
      updatedAt: '08 Apr 2026',
    },
    {
      id: 7,
      status: 'draft',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Vishal Anand',
      email: 'vishal.anand@pes.edu',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'PES University',
      githubRepo: 'https://github.com/vishalanand/corrugation-wapp',
      demoLink: '',
      solutionSummary: 'WhatsApp-integrated monitoring system using Twilio API for supervisor alerts and Google Sheets as a lightweight backend for shift managers without technical background.',
      filesCount: 0,
      fileNames: [],
      teamSize: 3,
      createdAt: '04 Apr 2026',
      updatedAt: '04 Apr 2026',
    },
    {
      id: 8,
      status: 'submitted',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Rohit Kumar',
      email: 'rohit.kumar@dtu.ac.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'Delhi Technological University',
      githubRepo: 'https://github.com/rohitkumar/ems-dtu',
      demoLink: 'https://youtu.be/demo-rohit',
      solutionSummary: 'Open-source stack: Home Assistant + ESPHome firmware on ESP32 with CT clamps, InfluxDB time-series database and Grafana dashboard. Total BOM cost: ₹31,500 for 6 lines. Includes auto-discovery of new machines when they go online.',
      filesCount: 3,
      fileNames: ['architecture.pdf', 'bom_costing.xlsx', 'firmware_docs.zip'],
      teamSize: 2,
      createdAt: '11 Apr 2026',
      updatedAt: '12 Apr 2026',
    },
    {
      id: 9,
      status: 'shortlisted',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Ananya Rao',
      email: 'ananya.rao@cbit.ac.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'CBIT Hyderabad',
      githubRepo: 'https://github.com/ananyarao/smart-meter-dashboard',
      demoLink: 'https://youtu.be/demo-ananya',
      solutionSummary: 'A Node.js + PostgreSQL backend with a React frontend deployed on a local Raspberry Pi server inside the factory LAN. No internet required, all data stays on-premise, and the system works even during ISP outages.',
      filesCount: 2,
      fileNames: ['solution_report.pdf', 'demo_walkthrough.mp4'],
      teamSize: 4,
      createdAt: '10 Apr 2026',
      updatedAt: '12 Apr 2026',
    },
    {
      id: 10,
      status: 'under_review',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Siddharth Patel',
      email: 'siddharth.p@charusat.ac.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'CHARUSAT University',
      githubRepo: 'https://github.com/siddharthpatel/energy-guard',
      demoLink: 'https://drive.google.com/demo-sid',
      solutionSummary: 'Energy Guard — a mobile-first PWA with offline support that floor workers can use to log anomalies manually when sensors fail. Combined with automated CT clamp data collection, this creates a hybrid monitoring solution with human-in-the-loop verification.',
      filesCount: 3,
      fileNames: ['pwa_mockup.pdf', 'system_architecture.pptx', 'cost_sheet.xlsx'],
      teamSize: 3,
      createdAt: '09 Apr 2026',
      updatedAt: '11 Apr 2026',
    },
    {
      id: 11,
      status: 'submitted',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Lavanya Krishnamurthy',
      email: 'lavanya.k@bmsce.ac.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'BMS College of Engineering',
      githubRepo: 'https://github.com/lavanyak/iot-energy-vis',
      demoLink: '',
      solutionSummary: 'A Zigbee mesh sensor network with centralised coordinator for wire-free deployment, feeding data into Apache Kafka for stream processing and a D3.js powered live dashboard. Designed for zero downtime installation without halting production.',
      filesCount: 2,
      fileNames: ['technical_proposal.pdf', 'network_diagram.png'],
      teamSize: 4,
      createdAt: '08 Apr 2026',
      updatedAt: '10 Apr 2026',
    },
    {
      id: 12,
      status: 'shortlisted',
      formName: 'Solution Submission',
      formVersion: 'Version 1',
      submittedBy: 'Mohammed Imran',
      email: 'imran.m@uceou.edu.in',
      hackathonName: 'Reduce Power Loss in Corrugation Plant',
      college: 'Osmania University',
      githubRepo: 'https://github.com/mohdimran/corrugation-ai',
      demoLink: 'https://youtu.be/demo-imran',
      solutionSummary: 'AI-powered anomaly detection using Autoencoders trained on 3 months of energy log data. The model flags deviations from expected consumption patterns at 5-minute intervals and sends SMS alerts via AWS SNS. Dashboard built with Streamlit.',
      filesCount: 4,
      fileNames: ['ai_model_report.pdf', 'training_notebook.zip', 'slides.pptx', 'demo_video.mp4'],
      teamSize: 3,
      createdAt: '07 Apr 2026',
      updatedAt: '12 Apr 2026',
    },
  ];

  // ── Computed ──────────────────────────────────────────
  filteredRows(): SubmissionRow[] {
    const q = this.searchQuery.toLowerCase();
    return this.rows.filter(r => {
      const matchStatus = this.activeStatus === 'all' || r.status === this.activeStatus;
      const matchFile =
        this.fileFilter === 'all' ||
        (this.fileFilter === 'with' && r.filesCount > 0) ||
        (this.fileFilter === 'without' && r.filesCount === 0);
      const matchQuery = !q || [r.submittedBy, r.email, r.hackathonName, r.college, r.formName]
        .some(f => f.toLowerCase().includes(q));
      return matchStatus && matchFile && matchQuery;
    });
  }

  pagedRows(): SubmissionRow[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredRows().slice(start, start + Number(this.rowsPerPage));
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows().length / this.rowsPerPage));
  }

  pageNumbers(): number[] {
    const total = this.totalPages();
    const cur = this.currentPage;
    const pages: number[] = [];
    for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

  paginationLabel(): string {
    const total = this.filteredRows().length;
    if (total === 0) return '0';
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPage * this.rowsPerPage, total);
    return `${start} – ${end} of ${total}`;
  }

  countByStatus(key: string): number {
    if (key === 'all') return this.rows.length;
    return this.rows.filter(r => r.status === key).length;
  }

  // ── Helpers ───────────────────────────────────────────
  statusLabel(s: string): string {
    const map: Record<string, string> = {
      submitted: 'Submitted', under_review: 'Under Review',
      shortlisted: 'Shortlisted', rejected: 'Rejected', draft: 'Draft',
    };
    return map[s] || s;
  }

  statusIcon(s: string): string {
    const map: Record<string, string> = {
      submitted: '📨', under_review: '🔍',
      shortlisted: '⭐', rejected: '✕', draft: '✎',
    };
    return map[s] || '●';
  }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  shortRepo(url: string): string {
    try {
      const parts = new URL(url).pathname.replace(/^\//, '').split('/');
      return parts.slice(0, 2).join('/');
    } catch { return url; }
  }

  fileTypeIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = { pdf: '📄', pptx: '📑', xlsx: '📗', png: '🖼️', mp4: '🎬', zip: '🗜️', csv: '📊' };
    return map[ext || ''] || '📎';
  }

  openDetail(row: SubmissionRow): void {
    this.selectedRow = row;
  }

  closeDetail(): void {
    this.selectedRow = null;
  }

  clearFilters(): void {
    this.activeStatus = 'all';
    this.fileFilter = 'all';
    this.searchQuery = '';
    this.currentPage = 1;
  }

  ngOnInit(): void {}
}