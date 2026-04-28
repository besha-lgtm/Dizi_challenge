import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private readonly API_URL = `${environment.apiUrl}/challenges`;

  constructor(private http: HttpClient) { }

  getChallenges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/all`);
  }
}
