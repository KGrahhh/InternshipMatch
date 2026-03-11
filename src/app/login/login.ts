import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Login {
  isAdmin = signal<boolean>(false);
  isUser = signal<boolean>(false);
  // Paper Requirement: Minimum Threshold for Readiness
  threshold = signal<number>(65); 

  login(password: string) {
    if (password === 'admin123') {
      this.isAdmin.set(true);
      return true;
    } 
    if (password === 'student123') {
      this.isUser.set(true);
      return true;
    }
    return false;
  }

  signup(password: string) {
    this.isUser.set(true);
    return true;
  }

  logout() {
    this.isAdmin.set(false);
    this.isUser.set(false);
  }
}