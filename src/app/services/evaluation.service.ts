import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ScorePayload {
  submission_id: number;
  challenge_id: string | number;
  team_name: string;
  scores: Record<string, number>;
}

export interface EvaluationResult {
  scored: boolean;
  evaluation: {
    id: number;
    submission_id: number;
    challenge_id: string;
    team_name: string;
    scores: Record<string, number>;
    total_score: number;
    evaluated_at: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly API_URL = `${environment.apiUrl}/evaluation`;

  constructor(private http: HttpClient) {}

  /** Submit scores for a submission. Returns 409 if already scored. */
  submitScore(payload: ScorePayload): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/score`, payload);
  }

  /** Get the stored evaluation for a submission (null if not yet scored). */
  getScore(submissionId: number): Observable<EvaluationResult> {
    return this.http.get<EvaluationResult>(`${this.API_URL}/${submissionId}`);
  }

  /** Get all evaluations for a challenge (leaderboard). */
  getScoresByChallenge(challengeId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/challenge/${challengeId}`);
  }

  /** Get challenge winners (top score for each challenge). */
  getWinners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/winners`);
  }
}
