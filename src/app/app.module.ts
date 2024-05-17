import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './components/list/list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { CustomersComponent } from './components/customers/customers.component';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { LoginComponent } from './components/login/login.component';
import {httpInterceptor} from "./services/http.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    NavbarComponent,
    AccountsComponent,
    CustomersComponent,
    AddCustomerComponent,
    PaginationComponent,
    EditCustomerComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([httpInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
