import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private readonly API_URL = `${environment.apiUrl}/challenges`;
  private readonly STORAGE_KEY = 'selectedChallengeId';

  constructor(private http: HttpClient) { }

  getChallenges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/all`);
  }

  getChallengeById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  getRegistrations(challengeId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/challengeregistration/${challengeId}`);
  }

  // --- Selected Challenge Management (to hide ID from URL) ---

  setSelectedChallengeId(id: string | number): void {
    sessionStorage.setItem(this.STORAGE_KEY, id.toString());
  }

  getSelectedChallengeId(): string | null {
    return sessionStorage.getItem(this.STORAGE_KEY);
  }
}
