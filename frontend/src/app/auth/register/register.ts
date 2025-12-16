
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;

  // Password Strength State
  hasMinLength = false;
  hasUpperCase = false;
  hasSpecialChar = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Real-time password validation
    this.registerForm.get('password')?.valueChanges.subscribe((val: string | null) => {
      this.checkPasswordStrength(val || '');
    });
  }

  checkPasswordStrength(password: string) {
    this.hasMinLength = password.length >= 8;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  get isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUpperCase && this.hasSpecialChar;
  }

  toggleVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.isPasswordValid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        this.authService.login(this.registerForm.value).subscribe({
          next: (data: any) => {
            if (data.success) {
              this.router.navigate(['/home']);
            }
          },
          error: (err: any) => alert('Auto-login failed.')
        });
      },
      error: (err: any) => {
        alert('Registration failed! ' + (err.error?.message || err.message));
      }
    });
  }

  goToLogin(): void {
    this.registerForm.reset();
    this.router.navigate(['/login']);
  }
}
