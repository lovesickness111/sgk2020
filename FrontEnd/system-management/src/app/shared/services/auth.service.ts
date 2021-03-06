import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthService {
  loggedIn = true;

  constructor(private router: Router) {}

  logIn(login: string, passord: string) {
    this.loggedIn = true;
    this.router.navigate(['/']);
  }

  logOut() {
    this.loggedIn = false;
    localStorage.removeItem('Token');
    localStorage.removeItem('UserInfo');
    this.router.navigate(['/login-form']);
  }

  get isLoggedIn() {
    return this.loggedIn;
  }
  getUserInfo() {
    const userstr = localStorage.getItem("UserInfo");
    return JSON.parse(userstr);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  user : any;
    constructor(private router: Router, private authService: AuthService) {
      this.user = this.authService.getUserInfo();
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const isLoggedIn = this.authService.isLoggedIn;
        const isLoginForm = route.routeConfig.path === 'login-form';

        if (isLoggedIn && isLoginForm && this.user && this.user.RoleCode === "Admin") {
            this.router.navigate(['/']);
            return false;
        }

        if (!isLoggedIn && !isLoginForm && (!this.user || this.user.RoleCode !== "Admin" ) ) {
            this.authService.logOut();
            this.router.navigate(['/login-form']);
        }

        return isLoggedIn || isLoginForm;
    }
}
