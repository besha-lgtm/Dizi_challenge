import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  role: 'user' | 'admin';
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'userToken';
  private readonly USER_KEY = 'userData';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(`${this.API}/register`, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      institution: payload.institution,
      password: payload.password
    });
  }

  login(email: string, password: string): Observable<{ success: boolean; token: string; user: AuthUser; message?: string }> {
    return this.http
      .post<{ success: boolean; token: string; user: AuthUser; message?: string }>(`${this.API}/login`, {
        email,
        password
      })
      .pipe(
        tap((res) => {
          if (res.token && res.user) {
            localStorage.setItem(this.TOKEN_KEY, res.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  getInitials(): string {
    const u = this.getUser();
    if (!u) return '?';
    const a = (u.firstName?.[0] || '') + (u.lastName?.[0] || '');
    return a.toUpperCase() || '?';
  }
}
