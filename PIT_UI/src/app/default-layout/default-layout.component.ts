import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router ,NavigationEnd} from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Location } from '@angular/common';
import { Global } from 'src/app/common/global';
import { RestService } from 'src/app/services/rest.service';
import { MenuService } from 'src/app/services/menus.service';
import { jwtDecode } from 'jwt-decode';
import { PageNameService } from 'src/app/services/sharedService'; // Adjust the path accordingly


@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnInit {
  shortname: any
  items: MenuItem[] | undefined;
  UserName: any = '';
  menuItems: any[] = [];
  PageName: any
  RoleId: any
  userLoggedIn: any;
  UIObj: any;
  userId: any;
  getId: any;
  location: Location;
  styleOBJ = { 'background': 'lightblue' }
  alphausername: any;
  DEPARTMENT: any;

  isVisible: boolean = false;
  sidebar;
  // items: MenuItem[];
  active: boolean;
  mobileItems: any;
  SubmenuItem = [];
  menuItem: any = [];
  NewMenu = [];
  menuarray: any = [];
  showDesignation: boolean = false;

  constructor(
    private router: Router, location: Location, private global: Global, private rest: RestService,
    private route: ActivatedRoute, private menus: MenuService, private pageNameService: PageNameService) {
    this.location = location;
  }


  ngOnInit(): void {
    var path = this.location.prepareExternalUrl(this.location.path());
    if (path.charAt(0) === '#') {
      path = path.slice(2);
    }
    this.pageNameService.currentPageName.subscribe(name => {
      this.PageName = name;
    });
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    this.userId = this.userLoggedIn.ID;

    // Retrieve menu items from sessionStorage
    const menuItemsString = sessionStorage.getItem('menuItems');
    const menuItems = menuItemsString ? JSON.parse(menuItemsString) : null;
    var menuData = menuItems;
    this.menuItems = menuData
    // console.log("menuData", menuData);

    // this.menus.currentMenus.subscribe(MenuData => this.menuItems = MenuData);
    // var menuData = JSON.parse(sessionStorage.getItem('menuItems')!);
    // this.menus.changeMenus(menuData);
    // this.userLoggedIn = JSON.parse(sessionStorage.getItem('userLoggedIn')!);
    // this.UserName = this.userLoggedIn.EmpName;


    let menu = menuData.filter(function (obj: any) {
      return obj.PARENETID == "0"
    });

    let SubMenu = menuData.filter(function (obj: any) {
      return obj.PARENETID != "0"
    });

    this.menuItem = menu
    this.SubmenuItem = SubMenu

    this.alphausername = this.userLoggedIn.LOGINID;
    this.DEPARTMENT = this.userLoggedIn.DEPARTMENT;
    // this.getalphausername()

    this.NewMenu = []
    for (var i = 0; i < this.menuItem.length; i++) {
      var NewSubMenu = []
      // console.log('new sub menu ',NewSubMenu)

      if (this.menuItem[i].ISCHILD == true) {

        for (var j = 0; j < this.SubmenuItem.length; j++) {
          if (this.SubmenuItem[j].PARENETID == this.menuItem[i].ID) {
            NewSubMenu.push({
              label: this.SubmenuItem[j].TITLE,
              title: this.SubmenuItem[j].TITLE, icon: this.SubmenuItem[j].ICON,
              styleClass: 'st222',

              routerLink: this.SubmenuItem[j].PATH


            })
          }
        }

        this.NewMenu.push({
          label: this.menuItem[i].TITLE,
          title: this.menuItem[i].TITLE, icon: this.menuItem[i].ICON,
          styleClass: "c2",
          items: NewSubMenu,

        })

      }
      else {
        this.NewMenu.push({
          label: this.menuItem[i].TITLE,
          title: this.menuItem[i].TITLE, icon: this.menuItem[i].ICON,
          styleClass: "c2",
          routerLink: this.menuItem[i].PATH

        })
      }

    }
    this.items = this.NewMenu
    this.setPageName();
    // this.PageName = 'Dashboard'
    // this.shortname = 'HOME'
    // Subscribe to router events to update PageName on route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setPageName();
      }
    })
  }

  setpagename() {
    this.PageName = 'Dashboard'
    this.router.navigate(['/pit/Home']);
  }

  private setPageName() {
    const currentRoute = this.router.url.split('?')[0]; // Get the current route without query params
 
    // Retrieve menu items from sessionStorage
    const menuItemsString = sessionStorage.getItem('menuItems');
    const menuItems = menuItemsString ? JSON.parse(menuItemsString) : [];
 
    // Find the menu item that matches the current route
    let matchingMenuItem = null;
    for (const item of menuItems) {
      if (item.PATH === currentRoute) {
        matchingMenuItem = item;
        break;
      }
      if (item.ISCHILD && item.items) {
        for (const subItem of item.items) {
          if (subItem.PATH === currentRoute) {
            matchingMenuItem = subItem;
            break;
          }
        }
      }
      if (matchingMenuItem) break;
    }
 
    if (matchingMenuItem) {
      this.PageName = matchingMenuItem.TITLE;
      this.shortname = matchingMenuItem.CSSCLASS || 'HOME';
    } else {
      this.PageName = 'Dashboard';
      this.shortname = 'HOME';
    }
  }

  decrypt(encryptedString: any) {

    let plainText = jwtDecode(encryptedString);
    return plainText;

  }


  onMenuClick(selectedMenuData: any) {

    if (selectedMenuData.PARENETID == 0 && selectedMenuData.ISCHILD == false && selectedMenuData.IS_ACTIVE == true) {
      this.router.navigate([selectedMenuData.PATH]);
    }
  }

  onSubMenuClick(selectedSubMenuData: any) {
    // console.log("selectedSubMenuData", selectedSubMenuData);

    this.router.navigate([selectedSubMenuData.PATH]);

    // this.PageName = selectedSubMenuData.TITLE
    this.pageNameService.updatePageName(selectedSubMenuData.TITLE); // Update the PageName
    this.shortname = selectedSubMenuData.CSSCLASS

  }


  getalphausername() {
    // debugger;

    var model = {

      loginid: this.userId

    }
    // console.log("getalphausername", model);

    this.rest.postParams(this.global.getapiendpoint() + "user/GetAllUsers", model).subscribe((data: any) => {

      if (data.Success == true) {
        this.alphausername = data.Data.LOGINID;
        this.DEPARTMENT = data.Data.DEPARTMENT;

      }



    })

  }


}




