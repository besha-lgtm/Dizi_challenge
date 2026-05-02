import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChallengePayload {
  companyInfo: {
    title: string;
    companyName: string;
    sector: string;
    location: string;
    contactPerson: string;
    email: string;
    website?: string;
    companyDescription?: string;
  };
  problemDetails: {
    description: string;
    currentSituation: string;
    expectedOutcome: string;
    domain: string;
    eligibility: string;
  };
  rewards: {
    prizes: number[];
    totalPool: number;
    perks: string[];
  };
  timeline: {
    startDate: string;
    deadline: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PostchallengeService {

  private readonly API_URL = `${environment.apiUrl}/challenges/publish`;

  // Dummy data for metadata
  private readonly SECTORS = [
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'it', label: 'Information Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'logistics', label: 'Logistics & Supply Chain' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail & E-Commerce' },
    { value: 'fintech', label: 'FinTech' },
    { value: 'other', label: 'Other' }
  ];

  private readonly DOMAINS = [
    { value: 'iot-dashboard', label: 'IoT + Dashboard' },
    { value: 'ml-ai', label: 'Machine Learning / AI' },
    { value: 'web-dev', label: 'Web Development' },
    { value: 'data-analytics', label: 'Data Analytics' },
    { value: 'embedded', label: 'Embedded Systems' },
    { value: 'mechanical', label: 'Mechanical Design' },
    { value: 'civil', label: 'Civil / Structural' },
    { value: 'chemical', label: 'Chemical Engineering' },
    { value: 'other', label: 'Other' }
  ];

  private readonly ELIGIBILITY_OPTIONS = [
    { value: 'all', label: 'All Students' },
    { value: 'ug', label: 'Undergraduate Only' },
    { value: 'pg', label: 'Postgraduate Only' },
    { value: 'final-year', label: 'Final Year Students' },
    { value: 'stem', label: 'STEM Students' }
  ];

  constructor(private http: HttpClient) { }

  getSectors() {
    return of(this.SECTORS).pipe(delay(500));
  }

  getDomains() {
    return of(this.DOMAINS).pipe(delay(500));
  }

  getEligibilityOptions() {
    return of(this.ELIGIBILITY_OPTIONS).pipe(delay(500));
  }

  publishChallenge(payload: ChallengePayload): Observable<any> {
    console.log('Publishing Challenge to Backend:', payload);
    return this.http.post<any>(this.API_URL, payload);
  }
}
