import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Subscription } from 'rxjs';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IUser } from 'app/entities/user/user.model';

@Component({
  selector: 'jhi-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  account: Account | null = null;
  authSubscription?: Subscription;

  person?: IPerson;
  user?: IUser;

  constructor(private accountService: AccountService, private personService: PersonService) {}

  ngOnInit(): void {
    /* eslint-disable no-console */
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }
}
