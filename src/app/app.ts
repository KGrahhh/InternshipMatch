import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Update: This must match your filename 'login' and the class name 'Login'
// Add './login/' to the path to tell Angular to look inside the folder
import { Login } from './login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // Fix: Explicitly typing this as 'Login' tells the HTML what methods exist
  public auth: Login = inject(Login);
  
  passInput = "";
  loginError = false;

  // Data Lists
  sSkills: string[] = ["Node.js", "Python", "SQL", "Docker", "JavaScript"];
  rSkills: string[] = ["React", "Node.js", "MongoDB", "REST APIs", "Git", "JavaScript", "HTML/CSS"];
  
  sInput = "";
  rInput = "";
  selectedPreset = 'Full-Stack Dev';

  presets = [
    { name: 'Full-Stack Dev', skills: ["React", "Node.js", "MongoDB", "REST APIs", "Git", "JavaScript", "HTML/CSS"] },
    { name: 'Data Science', skills: ["Python", "SQL", "Pandas", "Machine Learning", "Statistics"] },
    { name: 'Mobile Dev', skills: ["Flutter", "Dart", "Firebase", "iOS", "Android"] }
  ];

  sQuickAdd = ["React", "Angular", "Java", "MongoDB", "Git", "HTML/CSS", "TypeScript", "Figma", "Flutter", "Linux"];

  tryLogin() {
    // Now TypeScript knows that 'this.auth' (the Login class) has a .login() method
    if (this.auth.login(this.passInput)) {
      this.loginError = false;
    } else {
      this.loginError = true;
    }
    this.passInput = "";
  }

  /* --- Comparison Logic --- */
  get matched() {
    const sLow = this.sSkills.map(s => s.toLowerCase());
    return this.rSkills.filter(r => sLow.includes(r.toLowerCase()));
  }

  get missing() {
    const sLow = this.sSkills.map(s => s.toLowerCase());
    return this.rSkills.filter(r => !sLow.includes(r.toLowerCase()));
  }

  get extra() {
    const rLow = this.rSkills.map(r => r.toLowerCase());
    return this.sSkills.filter(s => !rLow.includes(s.toLowerCase()));
  }

  get score() {
    return this.rSkills.length ? Math.round((this.matched.length / this.rSkills.length) * 100) : 0;
  }

  addSkill(type: 's' | 'r', val?: string) {
    const skill = (val || (type === 's' ? this.sInput : this.rInput)).trim();
    if (!skill) return;
    if (type === 's') {
      if (!this.sSkills.includes(skill)) this.sSkills.push(skill);
      this.sInput = "";
    } else {
      if (!this.rSkills.includes(skill)) this.rSkills.push(skill);
      this.rInput = "";
    }
  }

  removeSkill(type: 's' | 'r', skill: string) {
    if (type === 's') this.sSkills = this.sSkills.filter(s => s !== skill);
    else this.rSkills = this.rSkills.filter(s => s !== skill);
  }

  setPreset(p: any) {
    this.selectedPreset = p.name;
    this.rSkills = [...p.skills];
  }
}