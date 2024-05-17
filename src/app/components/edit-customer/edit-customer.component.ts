import { Customer } from './../../models/customer.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {

  customer$ = this.customerService.observeCustomer();

  customer!: Customer | null;

  formGroup!: FormGroup;

  errorMessage!: string;

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const customerId = Number(param.get('id'));
      this.customerService.getCustomer(customerId);
    })

    this.customer$.subscribe(customer => {
      this.customer = customer;
      if (customer)
        this.formGroup = new FormGroup({
          name: new FormControl(customer.name, Validators.required),
          email: new FormControl(customer.email, [Validators.required, Validators.email])
        })
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
