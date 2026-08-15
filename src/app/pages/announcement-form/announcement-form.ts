import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/accouncement-service';


@Component({
  selector: 'app-announcement-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './announcement-form.html',
  styleUrl: './announcement-form.css'
})
export class AnnouncementForm implements OnInit {

  @Input() announcement: any;

  @Output() close = new EventEmitter<void>();

  @Output() saved = new EventEmitter<void>();

  announcementForm!: FormGroup;

  loading = false;

  constructor(

    private fb: FormBuilder,

    private announcementService: AnnouncementService

  ) {}

  ngOnInit(): void {

    this.announcementForm = this.fb.group({

      title: [
        '',
        Validators.required
      ],

      description: [
        '',
        Validators.required
      ],

      priority: [
        'Normal',
        Validators.required
      ],

      date: [
        '',
        Validators.required
      ],

      isActive: [
        true
      ]

    });

    if (this.announcement) {

      this.announcementForm.patchValue({

        title: this.announcement.title,

        description: this.announcement.description,

        priority: this.announcement.priority,

        date: this.formatDate(
          this.announcement.date
        ),

        isActive: this.announcement.isActive

      });

    }

  }

  // ==========================
  // Save Announcement
  // ==========================

  saveAnnouncement() {

    if (this.announcementForm.invalid) {

      this.announcementForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    if (this.announcement) {

      this.announcementService

        .updateAnnouncement(

          this.announcement._id,

          this.announcementForm.value

        )

        .subscribe({

          next: () => {

            this.loading = false;

            this.saved.emit();

          },

          error: (err) => {

            this.loading = false;

            console.log(err);

          }

        });

    }

    else {

      this.announcementService

        .createAnnouncement(

          this.announcementForm.value

        )

        .subscribe({

          next: () => {

            this.loading = false;

            this.saved.emit();

          },

          error: (err) => {

            this.loading = false;

            console.log(err);

          }

        });

    }

  }

  // ==========================
  // Format Date
  // ==========================

  formatDate(date: string): string {

    return new Date(date)

      .toISOString()

      .split('T')[0];

  }

}