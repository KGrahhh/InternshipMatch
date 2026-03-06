import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Login { // This name must match your import
  isAdmin = signal<boolean>(false);

  login(password: string) {
    if (password === 'admin123') {
      this.isAdmin.set(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isAdmin.set(false);
  }
}