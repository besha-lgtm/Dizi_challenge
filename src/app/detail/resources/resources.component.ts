import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../services/submission.service';
import { ChallengeService } from '../../services/challenge.service';

interface ResourceFile {
  id: number;
  name: string;
  desc: string;
  type: 'pdf' | 'csv' | 'zip' | 'xlsx' | 'mp4' | 'pptx' | 'json';
  url?: string;
}

interface ResourceSection {
  id: string;
  title: string;
  githubUrl?: string;
  files: ResourceFile[];
}

@Component({
  selector: 'app-resources',
  standalone: false,
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit {

  searchQuery = '';
  sections: ResourceSection[] = [];
  isLoading = false;

  constructor(
    private submissionService: SubmissionService,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    const challengeId = this.challengeService.getSelectedChallengeId();
    if (challengeId) {
      this.fetchSubmissions(challengeId);
    }
  }

  fetchSubmissions(challengeId: string): void {
    this.isLoading = true;
    this.submissionService.getSubmissionsByChallenge(challengeId).subscribe({
      next: (data) => {
        this.sections = data.map(sub => ({
          id: sub.id?.toString() || sub.team_name,
          title: sub.team_name,
          githubUrl: sub.github_repo,
          files: this.mapSubmissionToFiles(sub)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching submissions:', err);
        this.isLoading = false;
      }
    });
  }

  private mapSubmissionToFiles(sub: any): ResourceFile[] {
    const files: ResourceFile[] = [];
    // The server serves files from /uploads, while apiUrl is /api
    const uploadUrl = 'http://localhost:5000/uploads';
    
    // 1. Solution Document
    if (sub.solution_file) {
      files.push({
        id: Math.random(),
        name: sub.solution_file,
        desc: 'Primary solution architecture and methodology.',
        type: 'pdf',
        url: `${uploadUrl}/${sub.solution_file}`
      });
    }

    // 2. Team Details (Mapping from documentation_files)
    if (sub.documentation_files && sub.documentation_files.length > 0) {
      files.push({
        id: Math.random(),
        name: sub.documentation_files[0],
        desc: 'Member profiles and contact information.',
        type: 'pdf',
        url: `${uploadUrl}/${sub.documentation_files[0]}`
      });
    }

    // 3. Presentation
    if (sub.ppt_file) {
      files.push({
        id: Math.random(),
        name: sub.ppt_file,
        desc: 'Official presentation deck covering project scope.',
        type: 'pptx',
        url: `${uploadUrl}/${sub.ppt_file}`
      });
    }

    // 4. Demo Video (Mapping from demo_files)
    if (sub.demo_files && sub.demo_files.length > 0) {
      files.push({
        id: Math.random(),
        name: sub.demo_files[0],
        desc: 'Video demonstration of the prototype in action.',
        type: 'mp4',
        url: `${uploadUrl}/${sub.demo_files[0]}`
      });
    }

    return files;
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

  downloadFile(file: ResourceFile): void {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('File URL not available');
    }
  }

  filteredSections(): ResourceSection[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.sections;

    return this.sections.map(section => ({
      ...section,
      files: section.files.filter(file => 
        file.name.toLowerCase().includes(q) || 
        file.desc.toLowerCase().includes(q)
      )
    })).filter(section => 
      section.title.toLowerCase().includes(q) || 
      section.files.length > 0
    );
  }

}