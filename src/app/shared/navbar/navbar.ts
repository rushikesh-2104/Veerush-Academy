import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {

  greeting = '';
  currentDate = '';
  currentTime = '';

  private timer: any;

  ngOnInit(): void {
    this.updateDateTime();

    this.timer = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  updateDateTime() {

    const now = new Date();

    const hour = now.getHours();

    if (hour < 12) {

      this.greeting = 'Good Morning Rushikesh';

    } else if (hour < 17) {

      this.greeting = 'Good Afternoon Rushikesh';

    } else {

      this.greeting = 'Good Evening Rushikesh';

    }

    this.currentDate = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    this.currentTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  }

  @Output() menuClick = new EventEmitter<void>();

toggleSidebar() {
  this.menuClick.emit();
}

}