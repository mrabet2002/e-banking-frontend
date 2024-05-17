import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, map} from 'rxjs';
import {Page} from '../models/page.model';
import {Account} from '../models/account.model';
import {endpoints} from "./endpoints";
import {OperationRequest} from "../models/operation-request.model";
import {TransfertRequest} from "../models/transfert-request.model";
import {Operation} from "../models/operation.model";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  accounts$ = new BehaviorSubject<Page<Account> | null>(null);

  operations$ = new BehaviorSubject<Page<Operation> | null>(null);

  totalOperationsPages!: number;

  account$ = new BehaviorSubject<Account | null>(null);

  constructor(private http: HttpClient) {
  }

  observeAccounts() {
    return this.accounts$.asObservable()
  }

  observeAccount() {
    return this.account$.asObservable()
  }

  observeOperations() {
    return this.operations$.asObservable()
  }

  getAccounts(page: number = 0, size: number = 5) {
    let params = new HttpParams()
    params = params.append("page", page).append("size", size)
    this.accounts$.next(null)
    this.http.get<Page<Account>>(endpoints.accounts(), {params})
      .subscribe({
        next: (accounts: any) => this.setAccounts(accounts),
        error: err => {
          this.accounts$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }

  searchAccounts(keyword: string, page: number = 0, size: number = 5) {
    let params = new HttpParams()
    params = params
      .append("page", page)
      .append("size", size)
    if (keyword)
      params = params.append("keyword", keyword)
    this.accounts$.next(null)
    this.http.get<Page<Account>>("http://localhost:8080/api/accounts/search", {params})
      .subscribe({
        next: (accounts: any) => this.setAccounts(accounts),
        error: err => {
          this.accounts$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }

  addAccount(account: any) {
    return this.http.post("http://localhost:8080/api/accounts", account);
  }

  deleteAccount(toDelete: Account) {
    return this.http.delete(`http://localhost:8080/api/accounts/${toDelete.id}`);
  }

  getAccount(accountId: string) {
    this.http.get<Account>(endpoints.account(accountId))
      .subscribe({
        next: (account: any) => this.setAccount(account),
        error: err => {
          this.account$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }


  setAccounts(accounts: Page<Account>) {
    this.accounts$.next(accounts);
  }

  setOperations(operations: Page<Operation>) {
    this.operations$.next(operations);
  }

  setAccount(account: Account) {
    this.account$.next(account)
  }

  credit(operation: OperationRequest) {
    this.http.post(endpoints.credit(), operation)
      .subscribe({
        next: () => this.getAccountHistory(operation.accountId),
        error: err => {
          this.account$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }

  debit(operation: OperationRequest) {
    this.http.post(endpoints.debit(), operation)
      .subscribe({
        next: () => {
          this.getAccountHistory(operation.accountId)
        },
        error: err => {
          console.log(err)
          this.account$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }

  transfert(operation: TransfertRequest) {
    this.http.post(endpoints.transfer(), operation)
      .subscribe({
        next: () => this.getAccountHistory(operation.fromAccountId),
        error: err => {
          this.account$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }

  getAccountHistory(accountId: string, page: number = 0, size: number = 5) {
    let params = new HttpParams()
    params = params.append("page", page).append("size", size)
    this.operations$.next(null)
    this.http.get<any>(endpoints.account(accountId) + "/operations", {params})
      .subscribe({
        next: (accountHistory: any) => {
          this.setOperations(accountHistory.operations)
          this.totalOperationsPages = accountHistory.operations.totalPages
          this.setAccount({
            id: accountHistory.id,
            balance: accountHistory.balance,
            currency: accountHistory.currency,
            status: accountHistory.status,
            customer: accountHistory.customer
          })
        },
        error: err => {
          this.operations$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }

  getNextOperationsPage(accountId: string, page: number = 0, size: number = 5) {
    if (page >= this.totalOperationsPages) return
    let params = new HttpParams()
    params = params.append("page", page).append("size", size)
    return this.http.get<any>(endpoints.account(accountId) + "/operations", {params})
      .subscribe({
        next: (accountHistory: any) => {
          // append operations to the current operations list
          this.appendOperations(accountHistory.operations.content)
        },
        error: err => {
          this.operations$.error(new Error(err.error ? err.error.message : err.message))
        }
      })
  }

  appendOperations(operations: Operation[]) {
    this.operations$.next({
      content: this.operations$.value?.content.concat(operations)!,
      totalPages: this.operations$.value?.totalPages!,
      totalElements: this.operations$.value?.totalElements!,
      last: this.operations$.value?.last!,
      size: this.operations$.value?.size!,
      number: this.operations$.value?.number!,
      first: this.operations$.value?.first!,
    })
  }
}
