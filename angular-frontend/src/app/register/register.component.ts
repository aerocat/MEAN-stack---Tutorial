import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(private validateService: ValidateService,
              private flashMessage: FlashMessagesService,
              private AuthService: AuthService,
              private router: Router) { }

  ngOnInit() {

  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

  // Required fields
  if(!this.validateService.validateRegister(user)) {
    this.flashMessage.show('All fields are required', {cssClass: 'alert-danger', timeout: 3000});
    return false;
    }

  if(!this.validateService.validateEmail(user.email)) {
    this.flashMessage.show('You did not provide a valid email', {cssClass: 'alert-danger', timeout: 3000});
    return false;
      }


  // Register user
  this.AuthService.registerUser(user).subscribe(data => {
    if (data.success) {
      this.flashMessage.show('You registered successfully!', {cssClass: 'alert-success', timeout: 3000});
      this.router.navigate(['/login']);
    } else {
      this.flashMessage.show('Oops, something went wrong!', {cssClass: 'alert-danger', timeout: 3000});
      this.router.navigate(['/register']);
    }
    });
  }
}
