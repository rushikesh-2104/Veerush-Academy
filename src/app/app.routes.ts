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
import { Reports } from './pages/reports/reports';

export const routes: Routes = [

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  {
    path: '',
    component: Login
  },


  // ==========================================
  // ADMIN ROUTES
  // ==========================================

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'studentsL',
    component: StudentList,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'students',
    component: Students,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'classesForm',
    component: ClassesForm,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'classes',
    component: Classes,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'tests',
    component: Test,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'homework',
    component: Homeworkc,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'admission',
    component: AdmissionForm,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'fees',
    component: Fees,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },

  {
    path: 'announcements',
    component: Announcement,
    canActivate: [authGuard],
    data: {
      role: 'ADMIN'
    }
  },


  // ==========================================
  // STUDENT ROUTES
  // ==========================================

  {
    path: 'student-dashboard',
    component: StudentDashboard,
    canActivate: [authGuard],
    data: {
      role: 'STUDENT'
    }
  },

  {
  path: 'reports',
  component: Reports,
  canActivate: [authGuard],
  data: {
    role: 'ADMIN'
  }
},


  // ==========================================
  // INVALID ROUTE
  // ==========================================

  {
    path: '**',
    redirectTo: ''
  }

];