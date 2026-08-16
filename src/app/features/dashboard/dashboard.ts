import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../services/classService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Sidebar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  sidebarOpen = false;

  todaysClasses: any[] = [];

  constructor(
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.loadTodaysClasses();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadTodaysClasses() {

    this.classService.getTodaysClass().subscribe({

      next: (res: any) => {

        this.todaysClasses = res.data || [];

      

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}