import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  public auth: Login = inject(Login);
  
  // UI State
  passInput = "";
  loginError = false;
  isSignupMode = false;
  sInput = "";
  rInput = "";
  selectedPreset = 'Full-Stack Dev';

  // SOC Standards
  thresholdValue = 75; 

  // Student Skills (Stored as objects for weighting)
  sSkillsObj: { name: string, level: number }[] = [
    { name: "Node.js", level: 2 },
    { name: "Python", level: 1 },
    { name: "SQL", level: 3 },
    { name: "JavaScript", level: 2 }
  ];

  // Internship Requirements
  rSkills: string[] = ["React", "Node.js", "MongoDB", "REST APIs", "Git", "JavaScript", "HTML/CSS"];

  presets = [
    { name: 'Full-Stack Dev', skills: ["React", "Node.js", "MongoDB", "REST APIs", "Git", "JavaScript", "HTML/CSS"] },
    { name: 'Data Science', skills: ["Python", "SQL", "Pandas", "Machine Learning", "Statistics"] },
    { name: 'Mobile Dev', skills: ["Flutter", "Dart", "Firebase", "iOS", "Android"] }
  ];

  sQuickAdd = ["React", "Angular", "Java", "MongoDB", "Git", "HTML/CSS", "TypeScript", "Figma", "Flutter", "Linux"];

  /* --- Comparison Logic (Fixes the TS2339 Errors) --- */
  
  // Returns just the names of the student's skills
  get sSkills(): string[] {
    return this.sSkillsObj.map(s => s.name);
  }

  // Skills the student has that match requirements
  get matched(): string[] {
    const sLow = this.sSkills.map(s => s.toLowerCase());
    return this.rSkills.filter(r => sLow.includes(r.toLowerCase()));
  }

  // Skills the student is MISSING (This fixes your specific error)
  get missing(): string[] {
    const sLow = this.sSkills.map(s => s.toLowerCase());
    return this.rSkills.filter(r => !sLow.includes(r.toLowerCase()));
  }

  // Skills the student has that ARE NOT required
  get extra(): string[] {
    const rLow = this.rSkills.map(r => r.toLowerCase());
    return this.sSkills.filter(s => !rLow.includes(s.toLowerCase()));
  }

  /**
   * Weighted Matching Algorithm
   */
  get score(): number {
    if (!this.rSkills.length) return 0;
    let earnedPoints = 0;
    const maxPossiblePoints = this.rSkills.length * 3;

    this.sSkillsObj.forEach(skill => {
      if (this.rSkills.some(r => r.toLowerCase() === skill.name.toLowerCase())) {
        earnedPoints += Number(skill.level);
      }
    });

    return Math.min(Math.round((earnedPoints / maxPossiblePoints) * 100), 100);
  }

  get isReady(): boolean {
    return this.score >= this.thresholdValue;
  }

  calculateWeightedScore() {
    // Triggers change detection
  }

  /* --- Data Management --- */
  addSkill(type: 's' | 'r', val?: string) {
    const skillName = (val || (type === 's' ? this.sInput : this.rInput)).trim();
    if (!skillName) return;

    if (type === 's') {
      if (!this.sSkills.includes(skillName)) {
        this.sSkillsObj.push({ name: skillName, level: 1 });
      }
      this.sInput = "";
    } else {
      if (!this.rSkills.includes(skillName)) this.rSkills.push(skillName);
      this.rInput = "";
    }
  }

  removeSkill(type: 's' | 'r', skillName: string) {
    if (type === 's') {
      this.sSkillsObj = this.sSkillsObj.filter(s => s.name !== skillName);
    } else {
      this.rSkills = this.rSkills.filter(s => s !== skillName);
    }
  }

  setPreset(p: any) {
    this.selectedPreset = p.name;
    this.rSkills = [...p.skills];
  }

  tryAuth() {
    if (this.isSignupMode) {
      this.auth.signup(this.passInput);
    } else {
      if (!this.auth.login(this.passInput)) {
        this.loginError = true;
      } else {
        this.loginError = false;
      }
    }
    this.passInput = "";
  }

  exportPDF() {
    alert("Generating Internship Readiness Report for HAU School of Computing...");
  }
}