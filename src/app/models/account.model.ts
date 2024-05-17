import {Customer} from "./customer.model";

export interface Account {
  id: number;
  customer: Customer;
  currency: string;
  balance: number;
  status: string;
  createdAt?: string;
}
