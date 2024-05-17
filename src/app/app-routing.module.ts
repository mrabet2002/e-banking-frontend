import { CustomersComponent } from './components/customers/customers.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: "accounts",
    component: AccountsComponent
  },
  {
    path: "accounts/:id",
    component: AccountsComponent
  },
  {
    path: "customers",
    component: CustomersComponent,
  },
  {
    path: "customers/add",
    component: AddCustomerComponent
  },
  {
    path: "customers/edit/:id",
    component: EditCustomerComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
