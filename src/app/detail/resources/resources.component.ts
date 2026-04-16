import { Component, OnInit } from '@angular/core';

interface ResourceFile {
  id: number;
  name: string;
  desc: string;
  hoverDesc: string;
  type: 'pdf' | 'csv' | 'zip' | 'xlsx' | 'mp4' | 'pptx' | 'json';
  size: string;
  downloads: number;
  url?: string;
  isNew?: boolean;
  starred?: boolean;
  hovered?: boolean;
}

interface ResourceSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeClass?: string;
  collapsed: boolean;
  files: ResourceFile[];
  page?: number;
}

@Component({
  selector: 'app-resources',
  standalone: false,
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit {

  searchQuery = '';
  activeType = 'all';
  isModalOpen = false;
  selectedFile: File | null = null;
  uploadForm = {
    name: '',
    desc: '',
    sectionId: 'reference',
    type: 'pdf' as any
  };

  typeFilters = [
    { key: 'all',  label: 'All Types' },
    { key: 'pdf',  label: 'PDF'       },
    { key: 'csv',  label: 'CSV'       },
    { key: 'xlsx', label: 'Excel'     },
    { key: 'zip',  label: 'ZIP'       },
    { key: 'pptx', label: 'PPT'       },
    { key: 'mp4',  label: 'Video'     },
    { key: 'json', label: 'JSON'      },
  ];

  sections: ResourceSection[] = [
    {
      id: 'brief',
      icon: '📋',
      title: 'Challenge Brief & Guidelines',
      description: 'Official documents from Visipak Industries',
      badge: 'Official',
      collapsed: false,
      files: [
        {
          id: 1,
          name: 'Challenge Brief v1.2.pdf',
          desc: 'Full problem statement, scope, rules and evaluation rubric.',
          hoverDesc: 'Updated 3 days ago — includes clarifications from Q&A session.',
          type: 'pdf',
          size: '1.4 MB',
          downloads: 198,
          url: '/assets/docs/challenge_brief_v1.2.pdf',
          isNew: false,
        },
        {
          id: 2,
          name: 'Submission Template.pptx',
          desc: 'Official slide deck template with required sections pre-structured.',
          hoverDesc: '12-slide master template. Do not change the cover or evaluation slide.',
          type: 'pptx',
          size: '3.2 MB',
          downloads: 176,
          url: '/assets/docs/submission_template.pptx',
          isNew: false,
        },
        {
          id: 3,
          name: 'Evaluation Rubric.xlsx',
          desc: 'Scoring matrix used by judges across all 4 criteria.',
          hoverDesc: 'Self-assess your submission before final upload using this sheet.',
          type: 'xlsx',
          size: '220 KB',
          downloads: 134,
          url: '/assets/docs/evaluation_rubric.xlsx',
          isNew: true,
        },
      ]
    },
    {
      id: 'plant',
      icon: '🏭',
      title: 'Plant Data & Energy Logs',
      description: 'Raw and anonymised operational datasets from the facility',
      badge: 'Confidential',
      collapsed: false,
      files: [
        {
          id: 4,
          name: 'energy_log_jan_mar_2026.csv',
          desc: 'Shift-level energy readings across 6 production lines, Jan–Mar 2026.',
          hoverDesc: '~18,000 rows · Columns: shift_id, line_no, kwh_consumed, idle_mins, timestamp',
          type: 'csv',
          size: '8.7 MB',
          downloads: 142,
          url: '/assets/data/energy_log_jan_mar_2026.csv',
        },
        {
          id: 5,
          name: 'machine_specs_corrugator.pdf',
          desc: 'Technical specifications for the 3 BHS and 2 Fosber corrugation lines.',
          hoverDesc: 'Includes rated wattage, motor specs, and typical power factor values.',
          type: 'pdf',
          size: '5.1 MB',
          downloads: 89,
          url: '/assets/docs/machine_specs_corrugator.pdf',
        },
        {
          id: 6,
          name: 'maintenance_downtime_log.csv',
          desc: 'Unplanned downtime events and maintenance windows for 2025–2026.',
          hoverDesc: 'Cross-reference with energy logs to isolate idle-state power draw.',
          type: 'csv',
          size: '410 KB',
          downloads: 67,
          url: '/assets/data/maintenance_downtime_log.csv',
          isNew: true,
        },
        {
          id: 7,
          name: 'floor_layout_sensors.json',
          desc: 'JSON map of proposed sensor mounting positions across the facility.',
          hoverDesc: 'Coordinate system: metres from NW corner. Use with floor plan PDF.',
          type: 'json',
          size: '38 KB',
          downloads: 54,
          url: '/assets/data/floor_layout_sensors.json',
          isNew: true,
        },
      ]
    },
    {
      id: 'reference',
      icon: '📚',
      title: 'Reference Materials',
      description: 'Industry reports, standards and research papers',
      badge: 'Public',
      collapsed: false,
      files: [
        {
          id: 8,
          name: 'BEE_MSME_Energy_Audit_2024.pdf',
          desc: 'Bureau of Energy Efficiency audit guidelines for MSME manufacturing.',
          hoverDesc: 'Pages 34–67 cover corrugation-specific efficiency benchmarks.',
          type: 'pdf',
          size: '12.3 MB',
          downloads: 211,
          url: '/assets/docs/BEE_MSME_Energy_Audit_2024.pdf',
        },
        {
          id: 9,
          name: 'IoT_Monitoring_Frameworks.pdf',
          desc: 'Comparative overview of SCADA, edge-IoT and cloud-IoT approaches.',
          hoverDesc: 'Section 4 evaluates low-cost ESP32 + MQTT stacks in industrial settings.',
          type: 'pdf',
          size: '4.8 MB',
          downloads: 156,
          url: '/assets/docs/IoT_Monitoring_Frameworks.pdf',
        },
        {
          id: 10,
          name: 'Energy_Benchmarks_India_2025.xlsx',
          desc: 'kWh/tonne benchmarks for corrugated board manufacturing across India.',
          hoverDesc: 'Source: CII-Godrej GBC. Use to validate your projected savings estimates.',
          type: 'xlsx',
          size: '780 KB',
          downloads: 93,
          url: '/assets/docs/Energy_Benchmarks_India_2025.xlsx',
        },
      ]
    },
    {
      id: 'starter',
      icon: '🧰',
      title: 'Starter Kits & Code',
      description: 'Boilerplate code, dashboards and integration templates',
      badge: 'Open Source',
      collapsed: false,
      files: [
        {
          id: 11,
          name: 'grafana_dashboard_starter.zip',
          desc: 'Pre-configured Grafana dashboard JSON with InfluxDB data source setup.',
          hoverDesc: 'Includes 4 panels: Live kWh, Shift Comparison, Anomaly Flags, Cost Tracker.',
          type: 'zip',
          size: '1.9 MB',
          downloads: 128,
          url: '/assets/code/grafana_dashboard_starter.zip',
          isNew: true,
        },
        {
          id: 12,
          name: 'esp32_ct_clamp_firmware.zip',
          desc: 'Arduino firmware for CT clamp energy sensing with MQTT publish.',
          hoverDesc: 'Tested on ESP32-WROOM-32. Publishes to broker every 60s. MIT licensed.',
          type: 'zip',
          size: '340 KB',
          downloads: 104,
          url: '/assets/code/esp32_ct_clamp_firmware.zip',
          isNew: true,
        },
        {
          id: 13,
          name: 'sample_data_notebook.zip',
          desc: 'Python Jupyter notebook for EDA on the provided energy log CSV.',
          hoverDesc: 'Includes matplotlib visualisations, peak-hour detection, and anomaly flagging.',
          type: 'zip',
          size: '2.2 MB',
          downloads: 87,
          url: '/assets/code/sample_data_notebook.zip',
        },
      ]
    },
    {
      id: 'webinar',
      icon: '🎬',
      title: 'Webinar Recordings',
      description: 'Recorded sessions from the challenge kickoff and office hours',
      badge: 'Video',
      collapsed: true,
      files: [
        {
          id: 14,
          name: 'Kickoff_Session_Recording.mp4',
          desc: 'Full kickoff webinar with Visipak plant manager — 48 mins.',
          hoverDesc: 'Covers problem context, facility walkthrough, and Q&A highlights.',
          type: 'mp4',
          size: '210 MB',
          downloads: 165,
          url: '/assets/videos/Kickoff_Session_Recording.mp4',
        },
        {
          id: 15,
          name: 'Office_Hours_Apr10.mp4',
          desc: 'Office hours recording — submission format, budget clarifications.',
          hoverDesc: 'Timestamps: 00:00 budget Q&A · 18:30 sensor placement · 32:00 pilot scope',
          type: 'mp4',
          size: '148 MB',
          downloads: 99,
          url: '/assets/videos/Office_Hours_Apr10.mp4',
          isNew: true,
        },
      ]
    },
  ];

  get totalFiles(): number {
    return this.sections.reduce((s, sec) => s + sec.files.length, 0);
  }

  get totalDownloads(): number {
    return this.sections.reduce((s, sec) =>
      s + sec.files.reduce((f, file) => f + file.downloads, 0), 0);
  }

  get totalSize(): string {
    return '262 MB';
  }

  get updatedLabel(): string {
    return '2 days ago';
  }

  getFileIcon(type: string): string {
    const map: Record<string, string> = {
      pdf:  '📄',
      csv:  '📊',
      xlsx: '📗',
      zip:  '🗜️',
      mp4:  '🎬',
      pptx: '📑',
      json: '{ }',
    };
    return map[type] || '📎';
  }

  getPopularity(downloads: number): number {
    const max = 220;
    return Math.min(Math.round((downloads / max) * 100), 100);
  }

  countByType(type: string): number {
    if (type === 'all') return this.totalFiles;
    return this.sections.reduce((s, sec) =>
      s + sec.files.filter(f => f.type === type).length, 0);
  }

  toggleSection(id: string): void {
    const sec = this.sections.find(s => s.id === id);
    if (sec) sec.collapsed = !sec.collapsed;
  }

  downloadFile(file: ResourceFile): void {
    file.downloads++;
    if (file.url) {
      console.log(`Downloading: ${file.name} from ${file.url}`);
      alert(`Simulating download for: ${file.name}`);
    } else {
      console.warn('No URL provided for this file.');
    }
  }

  toggleStar(event: Event, file: ResourceFile): void {
    event.stopPropagation();
    file.starred = !file.starred;
  }

  filteredSections(): ResourceSection[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.sections.map(section => ({
      ...section,
      files: section.files.filter(file => {
        const matchType = this.activeType === 'all' || file.type === this.activeType;
        const matchQuery = !q ||
          file.name.toLowerCase().includes(q) ||
          file.desc.toLowerCase().includes(q) ||
          file.type.toLowerCase().includes(q);
        return matchType && matchQuery;
      })
    })).filter(section => section.files.length > 0);
  }

  ngOnInit(): void {}

  suggestFile(): void {
    this.isModalOpen = true;
    this.resetForm();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedFile = null;
    this.uploadForm = {
      name: '',
      desc: '',
      sectionId: 'reference',
      type: 'pdf'
    };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.name = file.name;
      
      const ext = file.name.split('.').pop()?.toLowerCase();
      const validTypes = ['pdf', 'csv', 'zip', 'xlsx', 'mp4', 'pptx', 'json'];
      if (ext && validTypes.includes(ext)) {
        this.uploadForm.type = ext as any;
      } else {
        this.uploadForm.type = 'zip'; 
      }
    }
  }

  submitUpload(): void {
    if (!this.selectedFile || !this.uploadForm.name || !this.uploadForm.desc) return;

    const sizeInMB = this.selectedFile.size / (1024 * 1024);
    const formattedSize = sizeInMB > 1 
      ? `${sizeInMB.toFixed(1)} MB` 
      : `${(this.selectedFile.size / 1024).toFixed(0)} KB`;

    const newResource: ResourceFile = {
      id: Math.floor(Math.random() * 10000) + 100,
      name: this.uploadForm.name,
      desc: this.uploadForm.desc,
      hoverDesc: 'Uploaded just now',
      type: this.uploadForm.type,
      size: formattedSize,
      downloads: 0,
      isNew: true,
      url: '#' 
    };

    const targetSection = this.sections.find(s => s.id === this.uploadForm.sectionId);
    if (targetSection) {
      targetSection.files.unshift(newResource);
      targetSection.collapsed = false; 
    }

    this.closeModal();
  }

  itemsPerPage = 6;

  getPaginatedFiles(section: ResourceSection) {
    if (!section.page) section.page = 1;
    const start = (section.page - 1) * this.itemsPerPage;
    return section.files.slice(start, start + this.itemsPerPage);
  }

  getTotalPages(section: ResourceSection): number {
    return Math.ceil(section.files.length / this.itemsPerPage);
  }

  nextPage(section: ResourceSection) {
    if ((section.page || 1) < this.getTotalPages(section)) {
      section.page = (section.page || 1) + 1;
    }
  }

  prevPage(section: ResourceSection) {
    if ((section.page || 1) > 1) {
      section.page = (section.page || 1) - 1;
    }
  }

}