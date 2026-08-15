import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input()
  open = false;

  @Output()
  closeSidebar = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {

    if (!confirm("Are you sure you want to logout?")) {
      return;
    }

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}