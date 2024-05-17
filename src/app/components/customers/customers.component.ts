import { Customer } from './../../models/customer.model';
import { Component, OnInit } from '@angular/core';
import { catchError, ignoreElements, Observable, of } from 'rxjs';
import { Page } from '../../models/page.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers$ = this.customerService.observeCustomers();

  keyword!: string;

  size: number = 5;
  currentPage: number = 0;

  customersError$ = this.customers$.pipe(
    ignoreElements(),
    catchError((err) => of(err))
  );

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getCustomers()
  }

  search(event: any | null = null) {
    if (event)
      this.keyword = event.target.value;
    this.customerService.searchCustomers(this.keyword, this.currentPage, this.size)
  }

  deleteCustomer(customer: Customer) {
    let confirmed = confirm(`Supprimer le client ${customer.name}?`)
    if (confirmed) {
      this.customerService.deleteCustomer(customer).subscribe({
        next: () => {
          this.search()
        }
      })
    }
  }

  loadCustomers(page: number) {
    this.currentPage = page;
    this.search()
  }
}
