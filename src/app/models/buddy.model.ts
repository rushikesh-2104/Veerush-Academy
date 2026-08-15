export interface Buddy {

  _id?: string;

  message: string;

  type:
    | 'General'
    | 'Homework'
    | 'Fee'
    | 'Attendance'
    | 'Test'
    | 'Class'
    | 'Motivation'
    | 'Holiday'
    | 'Announcement';

  priority:
    | 'Low'
    | 'Medium'
    | 'High';

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;

}