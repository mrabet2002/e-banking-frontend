import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {catchError, ignoreElements, of} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  account$ = this.accountService.observeAccount();
  accountError$ = this.account$.pipe(
    ignoreElements(),
    catchError((err) => of(err))
  );

  operations$ = this.accountService.observeOperations();

  accounts$ = this.accountService.observeAccounts();

  accountId!: string;
  accountIdFormControl: FormControl = new FormControl('', Validators.required);
  type: 'credit' | 'debit' | 'transfer' = 'credit'
  amount: FormControl = new FormControl('', Validators.required);
  destination: FormControl = new FormControl('', Validators.required);

  currentPage = 0;

  loadingOperations = false;

  constructor(private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // getting path variable id
    this.route.params.subscribe(params => {
      this.accountId = params['id'];
      if (this.accountId) {
        this.accountService.getAccountHistory(this.accountId)
        this.accountIdFormControl.setValue(this.accountId)
      }
    })

  }

  onSubmit() {
    this.router.navigate([`/accounts`, this.accountIdFormControl.value])
  }

  onSubmitOperation() {

    // format date as month day year
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    switch (this.type) {
      case 'credit':
        this.accountService.credit({
          accountId: this.accountId,
          amount: this.amount.value,
          description: `Credit operation of ${this.amount.value} at ${date}`
        })
        break
      case 'debit':
        this.accountService.debit({
          accountId: this.accountId,
          amount: this.amount.value,
          description: `Debit operation of ${this.amount.value} at ${date}`
        })
        break
      case 'transfer':
        this.accountService.transfert({
          fromAccountId: this.accountId,
          toAccountId: this.destination.value,
          amount: this.amount.value,
          description: `Transfert operation of ${this.amount.value} to ${this.destination.value} at ${new Date()}`,
        })
        break
    }
  }

  isOperationValid(accountBalance: number) {
    let valid = true;
    if (this.amount.valid) {
      if (this.type == 'debit' || this.type == 'transfer')
        valid = this.amount.value <= accountBalance
    } else valid = false
    if (this.type == 'transfer') valid = this.destination.valid
    return valid
  }

//   Get next operations page when scrolling down in .operations-history
  onScroll(totalPages: number) {
    const element = document.querySelector('.operations-history');
    if (element) {
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        // User has scrolled to the bottom, load next page of operations
        // making somthing after get next page
        if (this.currentPage < totalPages - 1) {
          this.loadingOperations = true;
          this.accountService
            .getNextOperationsPage(this.accountId, ++this.currentPage, 5)
            ?.add(() => {
              this.loadingOperations = false;
            });
        }
      }
    }
  }
}
