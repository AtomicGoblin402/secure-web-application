import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'secure_app_token';
  private userKey = 'secure_app_user';

  constructor(private http: HttpClient) { }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.setUser(response.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  setUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  // Profile Methods
  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/user/profile`, data, this.getAuthHeaders()).pipe(
      tap((res: any) => {
        if (res.success && res.user) {
          this.setUser(res.user);
        }
      })
    );
  }

  updatePassword(data: any) {
    return this.http.put(`${this.apiUrl}/user/password`, data, this.getAuthHeaders());
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }
}
