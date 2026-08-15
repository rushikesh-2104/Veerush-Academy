import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeworkForm } from './homework-form/homework-form';

import { HomeworkService } from '../../services/homework';
import { Homework } from '../../models/homework.model';

@Component({
  selector: 'app-homework',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HomeworkForm
  ],
  templateUrl: './homework.html',
  styleUrl: './homework.css'
})
export class Homeworkc implements OnInit {

  homeworkList: Homework[] = [];

  searchText = '';

  showHomeworkModal = false;

  // Edit ke liye
  selectedHomework: Homework | null = null;

  constructor(
    private homeworkService: HomeworkService
  ) {}

  ngOnInit(): void {
    this.loadHomework();
  }

  loadHomework() {

    this.homeworkService.getHomework().subscribe({

      next: (data: Homework[]) => {

        this.homeworkList = data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  get filteredHomework() {

    return this.homeworkList.filter(hw =>
      hw.title.toLowerCase().includes(this.searchText.toLowerCase())
    );

  }

  // ==========================
  // ADD
  // ==========================

  openHomeworkModal() {

    this.selectedHomework = null;

    this.showHomeworkModal = true;

  }

  // ==========================
  // EDIT
  // ==========================

  editHomework(hw: Homework) {

    this.selectedHomework = { ...hw };

    this.showHomeworkModal = true;

  }

  // ==========================
  // DELETE
  // ==========================

  deleteHomework(id: string) {

    if (!confirm('Delete this homework?')) return;

    this.homeworkService.deleteHomework(id).subscribe({

      next: () => {

        alert('Homework Deleted Successfully');

        this.loadHomework();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  // ==========================
  // CLOSE MODAL
  // ==========================

  closeHomeworkModal() {

    this.showHomeworkModal = false;

    this.selectedHomework = null;

    this.loadHomework();

  }

}