export interface Homework {

  _id?: string;

  title: string;

  description: string;

  subject: string;

  studentId: {
    _id: string;
    fullName: string;
    standard: string;
  };

  dueDate: string;

  attachment?: string;

  status: 'Pending' | 'Completed' | 'Late';

}