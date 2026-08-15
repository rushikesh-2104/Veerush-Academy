import { Injectable } from '@angular/core';

import { Test } from '../models/test.model';
import { Announcement } from '../models/accouncement.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  // ==========================
  // Tests
  // ==========================

  getTests(): Test[] {

    return [

      {
        id: 1,
        subject: 'Olympiad MCQ Practice Test',
        date: '14 Aug'
      }

    ];

  }

 

  

}