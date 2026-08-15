import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Student } from '../../models/student.model';
import { Homework } from '../../models/homework.model';
import { Test } from '../../models/test.model';
import { Announcement } from '../../models/accouncement.model';

import { StudentService } from '../../services/student';
import { HomeworkService } from '../../services/homework';
import { AuthService } from '../../services/auth';
import { Attendance } from '../../services/attendanceService';
import { FeeService } from '../../services/feeService';
import { ClassService } from '../../services/classService';
import { WeeklyTestService } from '../../services/weekly-test-service';
import { AnnouncementService } from '../../services/accouncement-service';
import { Router } from '@angular/router';

@Component({

  selector: 'app-student-dashboard',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './student-dashboard.html',

  styleUrl: './student-dashboard.css'

})

export class StudentDashboard implements OnInit, OnDestroy {

  // ==========================================
  // Student
  // ==========================================

  student!: Student;

  firstName = '';

  greeting = '';

  // ==========================================
  // Homework
  // ==========================================

  homework: Homework[] = [];

  pendingHomework = 0;

  // ==========================================
  // Attendance
  // ==========================================

  attendancePercentage = 0;

  attendanceTotal = 0;

  attendancePresent = 0;

  // ==========================================
  // Fee
  // ==========================================

  fee: any;

  totalFees = 0;

  paidAmount = 0;

  remainingAmount = 0;

  feeStatus = '';

  feePercentage = 0;

  // ==========================================
  // Weekly Test
  // ==========================================

  tests: Test[] = [];

  upcomingTest: any;

  latestResult: any;

  // ==========================================
  // Announcement
  // ==========================================

  announcements: Announcement[] = [];

  // ==========================================
  // Today's Class
  // ==========================================

  todaysClass: any;

  // ==========================================
  // Buddy AI
  // ==========================================

  

  buddyMessages: string[] = [];

  currentBuddyIndex = 0;

  buddyInterval: any;

  // ==========================================
  // Typing Animation
  // ==========================================

  displayMessage = '';

  private typingSpeed = 35;

  private typingInterval: any;

  // ==========================================
  // Constructor
  // ==========================================

  constructor(

    private studentService: StudentService,

    private homeworkService: HomeworkService,

    private auth: AuthService,

    private attendanceService: Attendance,

    private feeService: FeeService,

    private classService: ClassService,

    private weeklyTestService: WeeklyTestService,

    private announcementService: AnnouncementService,

    private router: Router

  ) {}



  // ==========================================
// On Init
// ==========================================

ngOnInit(): void {

  // ==========================
  // Greeting
  // ==========================

  this.setGreeting();

  // Default Buddy Message

  this.updateBuddyMessage();

  // ==========================
  // Logged In Student
  // ==========================

  const user = this.auth.getUser();

  if (!user) {

    return;

  }

  this.student = user;

  // ==========================
  // First Name
  // ==========================

  this.firstName = this.student.fullName
    ? this.student.fullName.split(' ')[0]
    : '';

  // Welcome Message

  this.addBuddyMessage(

    `👋 Welcome back ${this.firstName}! Ready to learn today?`

  );

  // ==========================
  // Attendance
  // ==========================

  if (this.student._id) {

    this.attendanceService
      .getStudentAttendance(this.student._id)
      .subscribe({

        next: (res: any) => {

          this.attendancePercentage = res.percentage;

          this.attendanceTotal = res.total;

          this.attendancePresent = res.present;

          console.log("Attendance:", res);

          if (this.attendancePercentage >= 90) {

            this.addBuddyMessage(

              `🏆 Amazing! Your attendance is ${this.attendancePercentage}%`

            );

          }

          else if (this.attendancePercentage >= 75) {

            this.addBuddyMessage(

              `🙂 Good job! Attendance is ${this.attendancePercentage}%`

            );

          }

          else {

            this.addBuddyMessage(

              `⚠️ Your attendance is only ${this.attendancePercentage}%`

            );

          }

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // ==========================
  // Homework
  // ==========================

  if (this.student._id) {

    this.homeworkService
      .getHomeworkByStudent(this.student._id)
      .subscribe({

        next: (data: Homework[]) => {

          this.homework = data;

          this.pendingHomework = data.filter(

            hw => hw.status === "Pending"

          ).length;

          console.log("Homework:", data);

          if (this.pendingHomework === 0) {

            this.addBuddyMessage(

              "🎉 Excellent! No homework pending."

            );

          }

          else if (this.pendingHomework === 1) {

            this.addBuddyMessage(

              "📚 You have only 1 homework pending."

            );

          }

          else {

            this.addBuddyMessage(

              `📚 You have ${this.pendingHomework} homework pending.`

            );

          }

        },

        error: (err) => {

          console.log(err);

        }

      });

  }


    // ==========================
  // Fee
  // ==========================

  if (this.student._id) {

    this.feeService
      .getStudentFee(this.student._id)
      .subscribe({

        next: (res: any) => {

          this.fee = res.data;

          if (this.fee) {

            this.totalFees = this.fee.totalFees;

            this.paidAmount = this.fee.paidAmount;

            this.remainingAmount = this.fee.remainingAmount;

            this.feeStatus = this.fee.status;

            this.feePercentage =
              this.totalFees > 0
                ? Math.round(
                    (this.paidAmount / this.totalFees) * 100
                  )
                : 0;

            if (this.remainingAmount > 0) {

              this.addBuddyMessage(

                `💰 Fee Reminder! ₹${this.remainingAmount} is still pending.`

              );

            }

            else {

              this.addBuddyMessage(

                "🎉 Awesome! Your fees are fully paid."

              );

            }

          }

          console.log("Fee :", this.fee);

        },

        error: (err) => {

          console.log(err);

        }

      });

  }



  this.classService
  .getTodaysClass()
  .subscribe({

    next: (res:any)=>{

      if(res.data.length){

        this.todaysClass = res.data[0];

        console.log(this.todaysClass);

        this.addBuddyMessage(
          `🎯 Today's Topic: ${this.todaysClass.topic}`
        );

        this.addBuddyMessage(
          `🕒 Class starts at ${this.todaysClass.startTime}`
        );

      }
      else{

        this.todaysClass = null;

        this.addBuddyMessage(
          "😎 No class scheduled today."
        );

      }

    },

    error:(err)=>{

      console.log(err);

    }

  });

  // ==========================
  // Weekly Tests
  // ==========================

  if (this.student._id) {

    // Upcoming Test

    this.weeklyTestService
      .getUpcomingTest(this.student._id)
      .subscribe({

        next: (res: any) => {

          this.upcomingTest = res.data;

          console.log("Upcoming Test:", this.upcomingTest);

          if (this.upcomingTest) {

            this.addBuddyMessage(

              `📝 Upcoming ${this.upcomingTest.subject} test on ${new Date(this.upcomingTest.testDate).toLocaleDateString()}`

            );

          }

          else {

            this.addBuddyMessage(

              "🎉 No upcoming tests scheduled."

            );

          }

        },

        error: (err) => {

          console.log(err);

        }

      });

    // ==========================
    // Latest Result
    // ==========================

    this.weeklyTestService
      .getLatestResult(this.student._id)
      .subscribe({

        next: (res: any) => {

          this.latestResult = res.data;

          console.log("Latest Result:", this.latestResult);

          if (this.latestResult) {

            this.addBuddyMessage(

              `🏅 Latest Score: ${this.latestResult.marks}/${this.latestResult.totalMarks} in ${this.latestResult.subject}`

            );

          }

        },

        error: (err) => {

          console.log(err);

        }

      });

  }


    // ==========================
  // Announcements
  // ==========================

  this.announcementService
    .getAnnouncements()
    .subscribe({

      next: (res: any) => {

        this.announcements = res.data;

        console.log("Announcements:", this.announcements);

        if (this.announcements.length > 0) {

          this.addBuddyMessage(

            `📢 ${this.announcements[0].title}`

          );

        }

        else {

          this.addBuddyMessage(

            "📢 No new announcements."

          );

        }

        // Start Buddy Rotation

        this.startBuddyRotation();
        this.randomMotivation();

this.randomJoke();

this.randomStudyTip();

      },

      error: (err) => {

        console.log(err);

        this.startBuddyRotation();

      }

    });

} // <-- ngOnInit Ends Here



// ==========================
// Greeting
// ==========================

private setGreeting(): void {

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {

    this.greeting = "Good Morning ☀️";

  }

  else if (hour >= 12 && hour < 17) {

    this.greeting = "Good Afternoon 🌤️";

  }

  else if (hour >= 17 && hour < 21) {

    this.greeting = "Good Evening 🌇";

  }

  else {

    this.greeting = "Good Night 🌙";

  }

}

// ==========================
// Default Buddy
// ==========================

private updateBuddyMessage(): void {

  this.buddy.message =

    "🤖 Hi! I'm RM Buddy.";

}


// ==========================
// Add Buddy Message
// ==========================

private addBuddyMessage(message: string): void {

  if (!this.buddyMessages.includes(message)) {

    this.buddyMessages.push(message);

  }

}


// ==========================
// Typing Effect
// ==========================

private typeMessage(message: string): void {

  this.updateBuddyMood(message);

  clearInterval(this.typingInterval);

  this.displayMessage = '';

  let index = 0;

  this.typingInterval = setInterval(() => {

    this.displayMessage += message.charAt(index);

    index++;

    if (index >= message.length) {

      clearInterval(this.typingInterval);

    }

  }, this.typingSpeed);

}


// ==========================
// Buddy Rotation
// ==========================

private startBuddyRotation(): void {

  if (this.buddyMessages.length === 0) {

    return;

  }

  this.currentBuddyIndex = 0;

  this.typeMessage(

    this.buddyMessages[0]

  );

  clearInterval(this.buddyInterval);

  this.buddyInterval = setInterval(() => {

    this.currentBuddyIndex++;

    if (

      this.currentBuddyIndex >= this.buddyMessages.length

    ) {

      this.currentBuddyIndex = 0;

    }

    this.typeMessage(

      this.buddyMessages[this.currentBuddyIndex]

    );

  }, 8000);

}

// ==========================
// Destroy
// ==========================

ngOnDestroy(): void {

  clearInterval(this.buddyInterval);

  clearInterval(this.typingInterval);

}

buddy = {

  message: '',

  type: 'General',

  mood: 'happy',

  emoji: '😊',

  color: 'bg-green-500'

};

// ==========================================
// Update Buddy Mood
// ==========================================

private updateBuddyMood(message: string): void {

  const text = message.toLowerCase();

  if (
    text.includes("fee") ||
    text.includes("pending")
  ) {

    this.buddy.mood = "warning";

    this.buddy.emoji = "😟";

    this.buddy.color = "bg-red-500";

  }

  else if (
    text.includes("attendance") ||
    text.includes("excellent") ||
    text.includes("amazing")
  ) {

    this.buddy.mood = "happy";

    this.buddy.emoji = "🥳";

    this.buddy.color = "bg-green-500";

  }

  else if (
    text.includes("test") ||
    text.includes("exam")
  ) {

    this.buddy.mood = "study";

    this.buddy.emoji = "🤓";

    this.buddy.color = "bg-blue-500";

  }

  else if (
    text.includes("class")
  ) {

    this.buddy.mood = "teaching";

    this.buddy.emoji = "👨‍🏫";

    this.buddy.color = "bg-purple-500";

  }

  else if (
    text.includes("holiday")
  ) {

    this.buddy.mood = "party";

    this.buddy.emoji = "🎉";

    this.buddy.color = "bg-yellow-500";

  }

  else {

    this.buddy.mood = "normal";

    this.buddy.emoji = "😊";

    this.buddy.color = "bg-green-500";

  }

}

// ==========================================
// Random Motivation
// ==========================================

private randomMotivation(): void {

  const messages = [

    `🚀 ${this.firstName}, every chapter completed is one step closer to success.`,

    `💯 Consistency beats talent. Keep studying!`,

    `🔥 Small progress every day becomes big results.`,

    `🌟 Believe in yourself. You can do it.`,

    `📚 Learning never stops.`,

    `🏆 Future topper detected.`,

    `😎 Don't give up now.`,

    `💪 Hard work always pays off.`,

    `🎯 Focus. Learn. Repeat.`

  ];

  const random =
    messages[Math.floor(Math.random() * messages.length)];

  this.addBuddyMessage(random);

}

// ==========================================
// Random Joke
// ==========================================

private randomJoke(): void {

  const jokes = [

    "😂 Why was the Math book sad? Because it had too many problems.",

    "🤣 Teacher: Why are you late? Student: Traffic in my dreams.",

    "😆 Studying is like WiFi. The closer you are, the stronger the connection.",

    "😂 Homework loves you. That's why it always comes back.",

    "🤓 Coffee + Study = Exam Survival."

  ];

  const random =
    jokes[Math.floor(Math.random() * jokes.length)];

  this.addBuddyMessage(random);

}

// ==========================================
// Random Study Tip
// ==========================================

private randomStudyTip(): void {

  const tips = [

    "🧠 Revise within 24 hours to remember longer.",

    "📚 Study 25 minutes, then take a 5 minute break.",

    "✍️ Writing improves memory.",

    "🎧 Avoid distractions while studying.",

    "📖 Read aloud for difficult topics.",

    "💤 Good sleep improves learning."

  ];

  const random =
    tips[Math.floor(Math.random() * tips.length)];

  this.addBuddyMessage(random);

}

logout() {

  if (!confirm("Are you sure you want to logout?")) {
    return;
  }

  this.auth.logout();

  this.router.navigate(['/login']);

}
}