export interface Announcement {
  _id?: string;
  title: string;
  description: string;
  priority: 'Normal' | 'Important' | 'Holiday';
  date: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}