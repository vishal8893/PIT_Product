import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
constructor (){}

// logout(): void {
//     localStorage.setItem('isLoggedIn', "false");
//     localStorage.removeItem('userLoggedIn');
//     localStorage.removeItem('menuItems');
// }

logout(): void {
    sessionStorage.setItem('isLoggedIn', "false");
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('menuItems');
}

}