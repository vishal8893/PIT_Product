import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuData !: any;
    private menuSource = new BehaviorSubject(this.menuData);
    currentMenus = this.menuSource.asObservable();

    constructor() { }

    changeMenus(menuData: any) {
        this.menuSource.next(this.BindMenuVariable(menuData));
    }

    BindMenuVariable(menuData: any) {
        return menuData;
    }
}
