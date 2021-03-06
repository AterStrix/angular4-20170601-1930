import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';
import { User } from '../../user'

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: User;
  emailIsUnique: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.emailIsUnique = true;
  }

  ngOnInit() {
    this.route.params
      .switchMap(params => this.userService.getUser(params.id))
      .subscribe(user => this.user = user);
  }

  goBack() {
    this.router.navigate(['/users']);
  }

  cancel() {
    this.goBack();
  }

  updateInfo(f) {
    const { firstName, surname, email } = f.form.controls;
    if (this.emailIsUnique && f.valid) {
      this.userService
        .setUserData(
          {
            name: firstName.value,
            surname: surname.value,
            email: email.value
          },
          this.user.id
        ).subscribe(_ => this.goBack());
    } else {
      alert('form is not valid');
    }
  }

  checkEmailUnique(email: string): void {
    if (email === this.user.email) { return }
    this.userService.checkEmailUnique(email)
      .subscribe(res => this.emailIsUnique = res);
  }

}
