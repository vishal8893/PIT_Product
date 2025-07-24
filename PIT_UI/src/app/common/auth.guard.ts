import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.verifyLogin(url)!;
    }

    verifyLogin(url: any) {
        if (!this.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        else{
            return true;
        }
    }

    // public isLoggedIn(): boolean {
    //     let status = false;
    //     if (localStorage.getItem('isLoggedIn') == 'true') {
    //         status = true;
    //     }
    //     else {
    //         status = false;
    //     }
    //     return status;
    // }
    public isLoggedIn(): boolean {
        let status = false;
        if (sessionStorage.getItem('isLoggedIn') == 'true') {
            status = true;
        }
        else {
            status = false;
        }
        return status;
    }

}