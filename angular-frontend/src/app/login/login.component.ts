import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(private flashMessage: FlashMessagesService,
              private AuthService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    // Send this data to a service that makes a post request to the database with said data,
    // in order to verify it. no need to send it to the validateService.
    // Basically we rely on the backend (Express) to do the hard work, instead of the frontend
    this.AuthService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.AuthService.storeUserData(data.token, data.user);
        this.flashMessage.show('You are logged in!', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/dashboard']);
      } else {
        // the ".msg" is coming from users.js (backend), but it's only appended when the data.sucess == false
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/login']);
      }
    });
  }
}
