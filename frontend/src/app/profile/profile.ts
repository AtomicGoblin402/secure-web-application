import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
    profileForm!: FormGroup;
    passwordForm!: FormGroup;
    activeTab: 'details' | 'security' = 'details';
    message: string = '';
    error: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const user = this.authService.getUser();

        this.profileForm = this.fb.group({
            name: [user?.name || '', Validators.required],
            email: [user?.email || '', [Validators.required, Validators.email]]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    switchTab(tab: 'details' | 'security') {
        this.activeTab = tab;
        this.message = '';
        this.error = '';
    }

    onProfileSubmit() {
        if (this.profileForm.invalid) return;

        this.authService.updateProfile(this.profileForm.value).subscribe({
            next: (res: any) => {
                this.message = 'Profile updated successfully.';
                this.error = '';
            },
            error: (err: any) => {
                this.error = err.error?.message || 'Update failed.';
                this.message = '';
            }
        });
    }

    onPasswordSubmit() {
        if (this.passwordForm.invalid) return;

        this.authService.updatePassword(this.passwordForm.value).subscribe({
            next: (res: any) => {
                this.message = 'Password updated successfully.';
                this.error = '';
                this.passwordForm.reset();
            },
            error: (err: any) => {
                this.error = err.error?.message || 'Update failed.';
                this.message = '';
            }
        });
    }

    goBack() {
        this.router.navigate(['/home']);
    }
}
