import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../services/accouncement-service';
import { AnnouncementForm } from '../announcement-form/announcement-form';

@Component({
  selector: 'app-accouncement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AnnouncementForm
  ],
  templateUrl: './announcement.html',
  styleUrl: './announcement.css'
})
export class Announcement implements OnInit {

  // ==========================
  // Data
  // ==========================

  announcements: any[] = [];

  filteredAnnouncements: any[] = [];

  loading = false;

  searchText = '';

  // ==========================
  // Dashboard Stats
  // ==========================

  totalAnnouncements = 0;

  importantAnnouncements = 0;

  holidayAnnouncements = 0;

  activeAnnouncements = 0;

  // ==========================
  // Modal
  // ==========================

  showAnnouncementModal = false;

  selectedAnnouncement: any = null;

  // ==========================
  // Constructor
  // ==========================

  constructor(
    private announcementService: AnnouncementService
  ) {}

  // ==========================
  // Init
  // ==========================

  ngOnInit(): void {

    this.loadAnnouncements();

  }

  // ==========================
  // Load Announcements
  // ==========================

  loadAnnouncements(): void {

    this.loading = true;

    this.announcementService
      .getAnnouncements()
      .subscribe({

        next: (res: any) => {

          

          this.loading = false;

          this.announcements =
            res.data || [];

          this.filteredAnnouncements =
            this.announcements;

          this.calculateStats();

        },

        error: (err) => {

          this.loading = false;

          console.log(
            'Announcements Error:',
            err
          );

        }

      });

  }

  // ==========================
  // Search
  // ==========================

  searchAnnouncements(): void {

    const text =
      this.searchText
        .trim()
        .toLowerCase();

    if (!text) {

      this.filteredAnnouncements =
        this.announcements;

      return;

    }

    this.filteredAnnouncements =
      this.announcements.filter(
        announcement =>

          announcement.title
            ?.toLowerCase()
            .includes(text) ||

          announcement.description
            ?.toLowerCase()
            .includes(text) ||

          announcement.priority
            ?.toLowerCase()
            .includes(text)

      );

  }

  // ==========================
  // Dashboard Stats
  // ==========================

  calculateStats(): void {

    if (!Array.isArray(this.announcements)) {

      this.announcements = [];

    }

    this.totalAnnouncements =
      this.announcements.length;

    this.importantAnnouncements =
      this.announcements.filter(
        announcement =>
          announcement.priority === 'Important'
      ).length;

    this.holidayAnnouncements =
      this.announcements.filter(
        announcement =>
          announcement.priority === 'Holiday'
      ).length;

    this.activeAnnouncements =
      this.announcements.filter(
        announcement =>
          announcement.isActive === true
      ).length;

  }

  // ==========================
  // Open Add Modal
  // ==========================

  openAnnouncementModal(): void {

    this.selectedAnnouncement = null;

    this.showAnnouncementModal = true;

  }

  // ==========================
  // Open Edit Modal
  // ==========================

  editAnnouncement(
    announcement: any
  ): void {

    this.selectedAnnouncement =
      announcement;

    this.showAnnouncementModal = true;

  }

  // ==========================
  // Close Modal
  // ==========================

  closeAnnouncementModal(): void {

    this.showAnnouncementModal = false;

    this.selectedAnnouncement = null;

  }

  // ==========================
  // After Save
  // ==========================

  onAnnouncementSaved(): void {

    this.closeAnnouncementModal();

    this.loadAnnouncements();

  }

  // ==========================
  // Delete Announcement
  // ==========================

  deleteAnnouncement(
    announcement: any
  ): void {

    if (!announcement?._id) {

      return;

    }

    const confirmed =
      confirm(
        `Delete "${announcement.title}"?`
      );

    if (!confirmed) {

      return;

    }

    this.announcementService
      .deleteAnnouncement(
        announcement._id
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Delete Response:',
            res
          );

          this.loadAnnouncements();

        },

        error: (err) => {

          console.log(
            'Delete Error:',
            err
          );

        }

      });

  }

  // ==========================
  // Status Text
  // ==========================

  getStatusText(
    isActive: boolean
  ): string {

    return isActive
      ? 'Active'
      : 'Inactive';

  }

  // ==========================
  // Status Class
  // ==========================

  getStatusClass(
    isActive: boolean
  ): string {

    return isActive
      ? 'text-green-600 bg-green-100'
      : 'text-slate-600 bg-slate-100';

  }

  // ==========================
  // Priority Class
  // ==========================

  getPriorityClass(
    priority: string
  ): string {

    switch (priority) {

      case 'Important':

        return 'text-red-600 bg-red-100';

      case 'Holiday':

        return 'text-purple-600 bg-purple-100';

      case 'Normal':

        return 'text-blue-600 bg-blue-100';

      default:

        return 'text-slate-600 bg-slate-100';

    }

  }

}