import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Page } from '../models/page.model';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customers$ = new BehaviorSubject<Page<Customer> | null>(null);

  customer$ = new BehaviorSubject<Customer | null>(null);

  constructor(private http: HttpClient) { }

  observeCustomers() {
    return this.customers$.asObservable()
  }

  observeCustomer() {
    return this.customer$.asObservable()
  }

  getCustomers(page: number = 0, size: number = 5) {
    let params = new HttpParams()
    params = params.append("page", page).append("size", size)
    this.customers$.next(null)
    this.http.get<Page<Customer>>("http://localhost:8080/api/customers", { params })
      .subscribe({
        next: (customers: any) => this.setCustomers(customers),
        error: err => {
          this.customers$.error(new Error(err.message))
        }
      })
  }

  searchCustomers(keyword: string, page: number = 0, size: number = 5) {
    let params = new HttpParams()
    params = params
      .append("page", page)
      .append("size", size)
    if (keyword)
      params = params.append("keyword", keyword)
    this.customers$.next(null)
    this.http.get<Page<Customer>>("http://localhost:8080/api/customers/search", { params })
      .subscribe({
        next: (customers: any) => this.setCustomers(customers),
        error: err => {
          this.customers$.error(new Error(err.message))
        }
      })
  }

  addCustomer(customer: any) {
    return this.http.post("http://localhost:8080/api/customers", customer);
  }

  deleteCustomer(toDelete: Customer) {
    return this.http.delete(`http://localhost:8080/api/customers/${toDelete.id}`);
  }

  getCustomer(customerId: number) {
    this.http.get<Customer>(`http://localhost:8080/api/customers/${customerId}`)
      .subscribe({
        next: (customer: any) => this.setCustomer(customer),
        error: err => {
          this.customer$.error(new Error(err.message))
        }
      })
  }


  setCustomers(customers: Page<Customer>) {
    this.customers$.next(customers);
  }

  setCustomer(customer: Customer) {
    this.customer$.next(customer)
  }
}
