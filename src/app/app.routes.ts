import { Routes } from '@angular/router';

import { Login } from './features/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { StudentList } from './features/students/student-list/student-list';
import { Students } from './features/students/students';
import { StudentDashboard } from './student-portal/student-dashboard/student-dashboard';
import { Homeworkc } from './features/homework/homework';
import { AdmissionForm } from './features/admission/admission-form/admission-form';
import { AttendanceComponent } from './pages/admin/attendance/attendance';
import { Fees } from './pages/admin/fees/fees';
import { ClassesForm } from './components/admin/classes/classes-form/classes-form';
import { Classes } from './components/admin/classes/classes';
import { Test } from './pages/test/test';
import { Announcement } from './pages/accouncement/announcement';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [

  // ==========================
  // Public Route
  // ==========================

  {
    path: "",
    component: Login
  },

  // ==========================
  // Protected Routes
  // ==========================

  {
    path: "dashboard",
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: "studentsL",
    component: StudentList,
    canActivate: [authGuard]
  },

  {
    path: "students",
    component: Students,
    canActivate: [authGuard]
  },

  {
    path: "classesForm",
    component: ClassesForm,
    canActivate: [authGuard]
  },

  {
    path: "classes",
    component: Classes,
    canActivate: [authGuard]
  },

  {
    path: "tests",
    component: Test,
    canActivate: [authGuard]
  },

  {
    path: "student-dashboard",
    component: StudentDashboard,
    canActivate: [authGuard]
  },

  {
    path: "homework",
    component: Homeworkc,
    canActivate: [authGuard]
  },

  {
    path: "admission",
    component: AdmissionForm,
    canActivate: [authGuard]
  },

  {
    path: "attendance",
    component: AttendanceComponent,
    canActivate: [authGuard]
  },

  {
    path: "fees",
    component: Fees,
    canActivate: [authGuard]
  },

  {
    path: "announcements",
    component: Announcement,
    canActivate: [authGuard]
  },

  // ==========================
  // Invalid Route
  // ==========================

  {
    path: "**",
    redirectTo: ""
  }

];