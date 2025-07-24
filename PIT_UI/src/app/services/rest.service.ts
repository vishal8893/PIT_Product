import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// const httpOptions = {
//     headers: new HttpHeaders({
//         //'Content-Type' : 'application/json'
//     })
// };

const httpOptions_forUpload = {
    headers: new HttpHeaders({
        // 'Content-Type' : 'application/json'

        'X-Requested-With': 'XMLHttpRequest',
    })
}

@Injectable({
    providedIn: 'root'
})
export class RestService {

    constructor(private http: HttpClient, private router: Router) { }
    // getAll(endpoint: string): Observable<any> {
    //     return this.http.get(endpoint).pipe(catchError(this.handleError()));
    // }
    getAll(endpoint: string): Observable<any> {        
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };
        
        return this.http.get(endpoint, httpOptions).pipe(catchError(this.handleError()));
    }


    // getById(endpoint: string, Id: string): Observable<any> {
    //     return this.http.get(endpoint + Id).pipe(catchError(this.handleError()));
    // }
    getById(endpoint: string, Id: string): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };
        
        return this.http.get(endpoint + Id, httpOptions).pipe(catchError(this.handleError()));
    }


    // create(endpoint: string, model: any): Observable<any> {
    //     return this.http.post(endpoint, model, httpOptions).pipe(catchError(this.handleError()));
    // }
    create(endpoint: string, model: any): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };
        
        return this.http.post(endpoint, model, httpOptions).pipe(catchError(this.handleError()));
    }


    // postParams(endpoint: string, params: any): Observable<any> {
    //     return this.http.post(endpoint, params, httpOptions).pipe(catchError(this.handleError()));
    // }
    postParams(endpoint: string, params: any): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };

        return this.http.post(endpoint, params, httpOptions).pipe(catchError(this.handleError()));
    }


    // postParams1(endpoint: string, params: any, options?: any): Observable<any> {
    //     // Add additional options like responseType if provided
    //     return this.http.post(endpoint, params, options).pipe(catchError(this.handleError()));
    // }
    postParams1(endpoint: string, params: any, options?: any): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };
        // Merge default options with additional options, if provided
        let mergedOptions = Object.assign({}, httpOptions, options);

        return this.http.post(endpoint, params, mergedOptions).pipe(catchError(this.handleError()));
    }


    // checkDuplicate(endpoint: string, Value: string, Id: string): Observable<any> {
    //     return this.http.get(endpoint + Value + '/' + Id).pipe(catchError(this.handleError()));
    // }
    checkDuplicate(endpoint: string, Value: string, Id: string): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };

        return this.http.get(endpoint + Value + '/' + Id, httpOptions).pipe(catchError(this.handleError()));
    }


    // checkDuplicateParam(endpoint: string, Value: string): Observable<any> {
    //     return this.http.get(endpoint + Value).pipe(catchError(this.handleError()));
    // }
    checkDuplicateParam(endpoint: string, Value: string): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };

        return this.http.get(endpoint + Value, httpOptions).pipe(catchError(this.handleError()));
    }


    // postParams_forupload(endpoint: string, params: any): Observable<any>{
    //     return this.http.post(endpoint, params, httpOptions_forUpload).pipe (catchError(this.handleError()));
    // }
    postParams_forupload(endpoint: string, params: any): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'jwt_token': sessionStorage.getItem('jwt_token') == null ? '' : sessionStorage.getItem('jwt_token')
            })
        };
        
        return this.http.post(endpoint, params, httpOptions).pipe(catchError(this.handleError()));
    }


    // private handleError<T>(operation = 'operation', result?: T) {
    //     return (error: any): Observable<T> => {
    //         console.error(error);
    //         return of(result as T);
    //     };
    // }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            if (error.status === 403) {
                sessionStorage.setItem('isLoggedIn', "false");
                sessionStorage.removeItem('jwt_token');
                sessionStorage.removeItem('menuItems');
                this.router.navigate(['/pit/login']);
            }
            return of(result as T);
        };
    }

}