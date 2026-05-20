import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

export interface RegistrationPayload {
  challenge_id: number | string;
  team_name: string;
  team_lead: string;
  members: TeamMember[];
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private readonly API_URL = `${environment.apiUrl}/challengeregistration`;

  constructor(private http: HttpClient) {}

  registerTeam(payload: RegistrationPayload): Observable<any> {
    console.log('Registering team:', payload);
    return this.http.post<any>(`${this.API_URL}/register`, payload);
  }

  checkTeamNameAvailability(challengeId: number | string, teamName: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.API_URL}/check-team-name`, {
      params: {
        challenge_id: String(challengeId),
        team_name: teamName
      }
    });
  }

  getRegistrationsByChallenge(challengeId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${challengeId}`);
  }
}
