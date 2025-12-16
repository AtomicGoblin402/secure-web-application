import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  name: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.name) {
      this.name = user.name;
    } else {
      this.name = 'User';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
