import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Buddy } from '../../models/buddy.model';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-rm-buddy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rm-buddy.html',
  styleUrl: './rm-buddy.css'
})
export class RmBuddy implements OnChanges, OnDestroy {

  // ==========================
  // Inputs
  // ==========================

  @Input({ required: true })
  buddy!: Buddy;

  @Input({ required: true })
  student!: Student;

  @Input()
  greeting = '';

  @Input()
  todaysClass: any;

  // ==========================
  // UI
  // ==========================

  displayedMessage = '';

  isTyping = false;

  avatar = '😊';

  status = '🟢 Online';

  currentType = 'General';

  private typingTimer: any;

  // ==========================
  // Detect New Buddy Message
  // ==========================

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['buddy'] && this.buddy) {

      this.showTypingAnimation();

      this.changeAvatar();

    }

  }

  // ==========================
  // Typing Animation
  // ==========================

  showTypingAnimation(): void {

    this.isTyping = true;

    this.displayedMessage = '';

    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {

      this.displayedMessage = this.buddy.message;

      this.isTyping = false;

    }, 1800);

  }

  // ==========================
  // Avatar According To Type
  // ==========================

  changeAvatar(): void {

    this.currentType = this.buddy.type;

    switch (this.buddy.type) {

      case 'Homework':

        this.avatar = '📚';

        break;

      case 'Attendance':

        this.avatar = '📈';

        break;

      case 'Fee':

        this.avatar = '💰';

        break;

      case 'Test':

        this.avatar = '📝';

        break;

      case 'Announcement':

        this.avatar = '📢';

        break;

      case 'Motivation':

        this.avatar = '🚀';

        break;

      default:

        this.avatar = '😊';

    }

  }

  // ==========================
  // Helper
  // ==========================

  get firstName(): string {

    if (!this.student?.fullName) {

      return '';

    }

    return this.student.fullName.split(' ')[0];

  }

  // ==========================
  // Destroy
  // ==========================

  ngOnDestroy(): void {

    clearTimeout(this.typingTimer);

  }

}