import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { PersonService } from 'app/entities/person/service/person.service';
import { Account } from 'app/core/auth/account.model';
import { IPerson } from 'app/entities/person/person.model';
@Component({
  selector: 'jhi-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  account!: Account;
  image?: string | null;
  acronym?: string | null;

  constructor(protected personService: PersonService, protected accountService: AccountService) {}

  load(): void {
    this.personService.findAvatar(this.account.id).subscribe(a => {
      this.image = a.body?.image;
      this.acronym = a.body?.acronym;
    });
  }
  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
      this.load();
    });
  }
}
