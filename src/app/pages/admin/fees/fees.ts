import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeService } from '../../../services/feeService';
import { FeesForm } from './fees-form/fees-form';


@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FeesForm
  ],
  templateUrl: './fees.html',
  styleUrl: './fees.css'
})
export class Fees implements OnInit {

  // ==========================
  // Data
  // ==========================

  fees: any[] = [];
  filteredFees: any[] = [];

  loading = false;

  searchText = '';

  // Dashboard Stats
  totalStudents = 0;
  totalCollection = 0;
  totalPending = 0;
  overdueStudents = 0;

  constructor(
    private feeService: FeeService
  ) {}

  showFeeModal = false;

students:any[] = [];

fee:any={

student:'',

course:'',

totalFees:0,

installmentCount:1,

dueDate:''

};

showPaymentModal=false;

selectedFee:any;

payment={

amount:0,

method:'Cash',

remarks:''

};

  ngOnInit(): void {
    this.loadFees();
  }

  // ==========================
  // Load Fees
  // ==========================

  loadFees() {

  this.loading = true;

  this.feeService.getFees().subscribe({

    next: (res: any) => {

      

      this.loading = false;

      this.fees = res.data;
      this.filteredFees = res.data;

      this.calculateStats();

    },

    error: (err) => {

      this.loading = false;
      console.log(err);

    }

  });

}

  // ==========================
  // Search
  // ==========================

  searchFees() {

    if (!this.searchText.trim()) {

      this.filteredFees = this.fees;

      return;

    }

    const text = this.searchText.toLowerCase();

    this.filteredFees = this.fees.filter(f =>

      f.student?.fullName?.toLowerCase().includes(text) ||

      f.student?.email?.toLowerCase().includes(text)

    );

  }

  // ==========================
  // Dashboard Cards
  // ==========================

  calculateStats() {

  if (!Array.isArray(this.fees)) {
    this.fees = [];
  }

  this.totalStudents = this.fees.length;

  this.totalCollection = this.fees.reduce(
    (sum, f) => sum + (f.paidAmount || 0),
    0
  );

  this.totalPending = this.fees.reduce(
    (sum, f) => sum + (f.remainingAmount || 0),
    0
  );

  this.overdueStudents = this.fees.filter(
    f => f.paymentStatus === 'Overdue'
  ).length;
}

  // ==========================
  // Payment %
  // ==========================

  getPercentage(fee: any): number {

    if (!fee.totalFees) return 0;

    return Math.round(

      (fee.paidAmount / fee.totalFees) * 100

    );

  }

  // ==========================
  // Status Color
  // ==========================

  getStatusClass(status: string) {

    switch (status) {

      case 'Paid':
        return 'text-green-600 bg-green-100';

      case 'Pending':
        return 'text-orange-600 bg-orange-100';

      case 'Overdue':
        return 'text-red-600 bg-red-100';

      default:
        return 'text-gray-600 bg-gray-100';

    }

  }

  openFeeModal(){

this.showFeeModal=true;

}

closeFeeModal(){

this.showFeeModal=false;

}

saveFee(){

console.log(this.fee);

}

openPaymentModal(fee:any){

this.selectedFee=fee;

this.payment={

amount:fee.remainingAmount,

method:'Cash',

remarks:''

};

this.showPaymentModal=true;

}

deleteFee(id: string) {

  if (!confirm('Delete this fee record?')) {
    return;
  }

  this.feeService.deleteFee(id).subscribe({

    next: () => {

      alert('Fee Deleted Successfully');

      this.loadFees();

    },

    error: (err) => {

      console.log(err);

      alert('Failed to delete');

    }

  });

}

viewStudent(fee: any) {

  console.log(fee);

}

receivePayment(){

this.feeService.receivePayment(

this.selectedFee._id,

this.payment

).subscribe({

next:(res)=>{


this.showPaymentModal=false;

this.loadFees();

},

error:(err)=>{

console.log(err);

}

});

}

}