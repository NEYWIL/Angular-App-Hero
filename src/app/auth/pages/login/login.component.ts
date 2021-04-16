import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  constructor(private router: Router, private athservice: AuthService) {}

  login() {
    this.athservice.login().subscribe((res) => {
      console.log(res)
      if (res.id) {
        this.router.navigate(['./heroes']);
      }
    });

    // this.router.navigate(['./heroes']);
  }

  ingresarSinLogin(){
    this.athservice.logOut();
    this.router.navigate(['./heroes'])
  }
}
