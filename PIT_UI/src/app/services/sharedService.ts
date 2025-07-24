// page-name.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class PageNameService {
  private pageNameSource = new BehaviorSubject<string>('');
  currentPageName = this.pageNameSource.asObservable();
 
  constructor() {}
 
  updatePageName(name: string) {
    this.pageNameSource.next(name);
  }
}
 