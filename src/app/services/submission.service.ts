import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SubmissionPayload {
  challenge_id: string | number;
  team_name: string;
  github_repo: string;
  live_link?: string;
  solution_file: File;
  ppt_file: File;
  demo_files: File[];
  documentation_files: File[];
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private readonly API_URL = `${environment.apiUrl}/challengesubmission`;

  constructor(private http: HttpClient) {}

  submitSolution(payload: SubmissionPayload): Observable<any> {
    const formData = new FormData();

    // Text fields
    formData.append('challenge_id', String(payload.challenge_id));
    formData.append('team_name', payload.team_name);
    formData.append('github_repo', payload.github_repo);
    if (payload.live_link) {
      formData.append('live_link', payload.live_link);
    }

    // Single files
    formData.append('solution_file', payload.solution_file, payload.solution_file.name);
    formData.append('ppt_file', payload.ppt_file, payload.ppt_file.name);

    // Multiple files
    payload.demo_files.forEach(file => {
      formData.append('demo_files', file, file.name);
    });
    payload.documentation_files.forEach(file => {
      formData.append('documentation_files', file, file.name);
    });

    return this.http.post<any>(`${this.API_URL}/submit`, formData);
  }

  getSubmissionsByChallenge(challengeId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${challengeId}`);
  }

  getSubmissionsByTeam(teamName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/team/${teamName}`);
  }
}
