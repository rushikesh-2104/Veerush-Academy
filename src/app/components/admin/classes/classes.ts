import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClassesForm } from './classes-form/classes-form';
import { ClassService } from '../../../services/classService';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClassesForm
  ],
  templateUrl: './classes.html',
  styleUrl: './classes.css'
})
export class Classes implements OnInit {

  // ==========================
  // Data
  // ==========================

  classes: any[] = [];
  filteredClasses: any[] = [];
  selectedClass: any = null;

  loading = false;

  searchText = '';

  // ==========================
  // Dashboard Stats
  // ==========================

  totalClasses = 0;
  todayClasses = 0;
  upcomingClasses = 0;
  completedClasses = 0;

  // ==========================
  // Modal
  // ==========================

  showClassModal = false;

  constructor(
    private classService: ClassService
  ) {}

  ngOnInit(): void {

    this.loadClasses();

  }

  // ==========================
  // Load Classes
  // ==========================

  loadClasses() {

    this.loading = true;

    this.classService.getClasses().subscribe({

      next: (res: any) => {

        this.loading = false;

        this.classes = res.data || [];

        this.filteredClasses = [...this.classes];

        this.calculateStats();


      },

      error: (err) => {

        this.loading = false;

        console.log(err);

      }

    });

  }

  // ==========================
  // Search
  // ==========================

  searchClasses() {

    if (!this.searchText.trim()) {

      this.filteredClasses = [...this.classes];

      return;

    }

    const text = this.searchText.toLowerCase();

    this.filteredClasses = this.classes.filter(c =>

      c.course?.toLowerCase().includes(text) ||

      c.subject?.toLowerCase().includes(text) ||

      c.teacher?.toLowerCase().includes(text) ||

      c.topic?.toLowerCase().includes(text)

    );

  }

  // ==========================
  // Stats
  // ==========================

  calculateStats() {

    this.totalClasses = this.classes.length;

    const today = new Date().toISOString().split('T')[0];

    this.todayClasses = this.classes.filter(

      c => c.date?.substring(0,10) === today

    ).length;

    this.upcomingClasses = this.classes.filter(

      c => c.status === 'Scheduled'

    ).length;

    this.completedClasses = this.classes.filter(

      c => c.status === 'Completed'

    ).length;

  }

  // ==========================
  // Status Badge
  // ==========================

  getStatusClass(status: string) {

    switch(status){

      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';

      case 'Live':
        return 'bg-green-100 text-green-700';

      case 'Completed':
        return 'bg-slate-200 text-slate-700';

      default:
        return 'bg-orange-100 text-orange-700';

    }

  }

  // ==========================
  // Modal
  // ==========================

  openClassModal() {

  this.selectedClass = null;

  this.showClassModal = true;

}

editClass(item: any) {

  this.selectedClass = { ...item };

  this.showClassModal = true;

}

  closeClassModal() {

  this.showClassModal = false;

  this.selectedClass = null;

  this.loadClasses();

}

  // ==========================
  // Delete
  // ==========================

  deleteClass(id: string) {

  if (!confirm("Delete this class?")) {
    return;
  }

  this.classService.deleteClass(id).subscribe({

    next: () => {

      alert("Class Deleted Successfully");

      this.loadClasses();

    },

    error: (err) => {

      console.log(err);

      alert("Failed to delete class");

    }

  });

}

}