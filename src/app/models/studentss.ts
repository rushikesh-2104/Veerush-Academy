export interface Student {

  _id?: string;

  fullName: string;

  email: string;

  phone: string;

  parentPhone?: string;

  fatherName?: string;

  motherName?: string;

  gender?: string;

  dob?: Date;

  address?: string;

  school?: string;

  standard: string;

  board?: string;

  course?: string;

  batch?: string;

  joiningDate?: Date;

  monthlyFees?: number;

  admissionFees?: number;

  role?: string;

  profileImage?: string;

  isActive?: boolean;

}