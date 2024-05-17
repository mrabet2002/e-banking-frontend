import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  formGroup!: FormGroup;

  errorMessage!: string;

  loading: boolean = false;

  constructor(private customerService: CustomerService,
    private router: Router) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  onSubmit() {
    this.loading = true;
    this.customerService.addCustomer(this.formGroup.value).subscribe({
      next: customer => {
        this.router.navigate(["/customers"])
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    })
  }
}
