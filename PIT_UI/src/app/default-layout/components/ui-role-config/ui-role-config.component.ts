import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { Validators, FormBuilder, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { RequireMatch } from 'src/app/validators/requiredmatch.validator';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';

export interface GridRowObject {
  uuid: number;
  UI: string;
  parentid: string;
  viewer: boolean;
  maker: boolean;
  checker: boolean;
  approver: Boolean;
  edit: boolean;
  export: boolean;
  upload: boolean;
}
@Component({
  selector: 'app-ui-role-config',
  templateUrl: './ui-role-config.component.html',
  styleUrls: ['./ui-role-config.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class UiRoleConfigComponent implements OnInit {
  uiRoleMapStatus: string = 'create';

  roleList!: any[];
  roles: any = [];
  isLoadingResults = false;
  filteredRole!: Observable<any[]>;
  @ViewChild('form', { static: true }) form: any;

  home: { icon: string; routerLink: string; };
  items: { label: string; url: string; }[];
  countries: { name: string; code: string; }[];
  selectedCountry: string;
  checked: boolean;
  checkedt: boolean = true;

  RoleId1: any
  userLoggedIn: any;
  UIObj: any;
  userId: any;
  getId: any;
  location: Location;
  rows: FormArray = this.formBuilder.array([]);

  UIRoleMapData!: GridRowObject[];
  uimenus: any = [];

  // UIRoleMapDataSource = new MatTableDataSource(this.UIRoleMapData);
  dataSource1: any = []
  UIRoleConfigForm: FormGroup = this.formBuilder.group({
    RoleId: [''],
    Role: ['', [Validators.required, RequireMatch]],
    'UIRoleMap': this.rows
  });
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  constructor(
    private messageService: MessageService, private formBuilder: FormBuilder, private rest: RestService,
    private global: Global,
    private confirmationService: ConfirmationService, location: Location,
  ) {
    this.location = location;
    this.items = [
      { label: 'UI Role Configuration', url: 'ui-role-config' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  ngOnInit(): void {
    var path = this.location.prepareExternalUrl(this.location.path());
    if (path.charAt(0) === '#') {
      path = path.slice(2);
    }
    // this.UIObj = this.global.getUIObj(path);
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
  
    
    this.userId = this.userLoggedIn.ROLEID;
    // console.log("userId", this.userId);

    // this.RoleId1 = this.UIObj.roleid
    this.getMenuList();
    this.getRoleList()
    this.UIRoleMapData = [];
    this.UIRoleMapData.forEach((d: GridRowObject) => this.addRow(d, false));
    this.updateView();
  }
  decrypt(encryptedString: any) {

    let plainText = jwtDecode(encryptedString);
    return plainText;

  }
  emptyTable() {
    while (this.rows.length !== 0) {
      this.rows.removeAt(0);
    }
  }

  addRow(d?: GridRowObject, noUpdate?: boolean) {
    var uiTitle = this.uimenus.find((x: any) => x.ID == d?.uuid);
    uiTitle = uiTitle ? uiTitle.TITLE : '';
    const row = this.formBuilder.group({
      'uuid': [d && d.uuid ? d.uuid : null, []],
      'UI': [d && uiTitle ? uiTitle : null, []],
      'parentid': [d && d.parentid ? d.parentid : null, []],
      'viewer': [d && d.viewer ? d.viewer : null, []],
      'maker': [d && d.maker ? d.maker : null, []],
      'checker': [d && d.checker ? d.checker : null, []],
      'approver': [d && d.approver ? d.approver : null, []],
      'edit': [d && d.edit ? d.edit : null, []],
      'export': [d && d.export ? d.export : null, []],
      'upload': [d && d.upload ? d.upload : null, []],
    });
    this.rows.push(row);
    if (!noUpdate) { this.updateView(); }
  }
  updateView() {
    this.dataSource.next(this.rows.controls);
  }

  clearView() {
    this.UIRoleMapData = [];
    this.dataSource.next(this.rows.controls);


  }

  get RoleId() { return this.UIRoleConfigForm.get('RoleId'); }
  get Role() { return this.UIRoleConfigForm.get('Role'); }

  inputRole(role: any) {
    this.RoleId?.setValue(null);
  }

  onFocusRole(role: any) {
    if (this.Role) {
      this.filteredRole = this.Role.valueChanges
        .pipe(
          startWith(null),
          map((value: any | null) => {
            return value ? this._filterRoles(value) : this.roles.slice()
          })
        );
    }

  }

  selectedRole(event: any): void {
    if (event != undefined) {
      this.RoleId?.setValue(event.value.ID);
      this.loadUIRoleMapping(event.value.ID);
    }
    else {
      this.emptyTable();
      this.updateView();
      this.UIRoleConfigForm.reset();
      this.form.resetForm();
      this.UIRoleConfigForm.markAsUntouched();
    }
  }

  clearRole() {
    this.RoleId?.setValue(null);
    this.Role?.setValue(null);
    this.emptyTable();
    this.updateView();
    this.UIRoleConfigForm.reset();
    this.form.resetForm();
    this.UIRoleConfigForm.markAsUntouched();
  }

  private _filterRoles(value: any): any {
    const filterValue = (value ? (value.Code ? value.Code.toLowerCase() : value.toLowerCase()) : '');
    return this.roles.filter((o: any) => o.Code.toLowerCase().includes(filterValue));
  }

  displayWithRole(obj?: any): string | undefined {
    return obj ? obj.Code : undefined;
  }

  getMenuList() {
    this.uimenus = [];
    this.rest.getAll(this.global.getapiendpoint() + 'newmenu/GetAllActiveMenu').subscribe((data: any) => {
      this.uimenus = data.Data;

    });
  }

  getRoleList() {
    this.roleList = [];
    this.rest.getAll(this.global.getapiendpoint() + 'userrole/GetAllActiveRole').subscribe((data: any) => {
      var Result = JSON.parse(this.global.decrypt1(data.Data));
      this.roleList = Result;
      this.roles = Result;


    });
  }

  saveUIRoleConfig() {
    const UIRoleMap = this.UIRoleConfigForm.get('UIRoleMap')?.value;
    // console.log("UIRoleMap", UIRoleMap);

    const model: any = {
      RoleId: this.RoleId?.value,
      UIRoleMap: JSON.stringify(UIRoleMap),
      UserId: this.userId,
      // UserRoleId: this.userLoggedIn.DefaultRoleId
    }
    // console.log("saveUIRoleConfig", model);

    this.rest.create(this.global.getapiendpoint() + 'uirolemap/CreateUIRoleMap', model).subscribe((data: any) => {
      // this.notification.openSnackBarSuccess('UI Role Mapped Successfully.');
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'UI Role Mapped Successfully.' });
      this.emptyTable();
      this.updateView();
      this.UIRoleConfigForm.reset();
      this.form.resetForm();
      this.UIRoleConfigForm.markAsUntouched();
    });
  }

  loadUIRoleMapping(roleId: any) {

    this.isLoadingResults = true;
    this.emptyTable();
    this.updateView();
    this.rest.getById(this.global.getapiendpoint() + 'uirolemap/GetUIRoleMap/', roleId).subscribe((data: any) => {
      if (data.Success == true) {
        if (data.Data.length !== 0) {
          this.uiRoleMapStatus = 'update';
          const updatedCars = data.Data.map(car => {
            return {
              uuid: car.UUID,
              approver: car.APPROVER,
              viewer: car.VIEWER,
              maker: car.MAKER,
              created_by: car.CREATED_BY,
              roleid: car.ROLEID,
              code: car.TBL_ROLE_MST,
              checker: car.CHECKER,
              edit: car.EDIT,
              export: car.EXPORT,
              upload: car.UPLOAD,
              id: car.ID,

            };
          });
          this.UIRoleMapData = updatedCars;
          // this.dataSource1 = this.rows.value;
          this.uimenus.forEach((menu: any) => {
            const UIRoleMap = this.UIRoleMapData.find(e => e.uuid === menu.ID);
            if (UIRoleMap) {
              this.addRow({
                uuid: menu.ID,
                UI: menu.TITLE,
                parentid: menu.parentid,
                viewer: UIRoleMap.viewer,
                maker: UIRoleMap.maker,
                checker: UIRoleMap.checker,
                approver: UIRoleMap.approver,
                edit: UIRoleMap.edit,
                export: UIRoleMap.export,
                upload: UIRoleMap.upload,
              }, false);

            } else {
              this.addRow({
                uuid: menu.ID,
                UI: menu.TITLE,
                parentid: menu.PARENETID,
                viewer: false,
                maker: false,
                checker: false,
                approver: false,
                edit: false,
                export: false,
                upload: false,
              }, false);
            }
          })
          this.updateView();
          this.isLoadingResults = false;
        }
        else {
          this.setDefaultData();
          this.updateView();
          this.uiRoleMapStatus = 'create';
        }
      } else {
        console.error(data);
      }
    });
  }

  setDefaultData() {
    const menu_list = this.uimenus;
    menu_list.forEach((d: any) => {
      this.addRow({
        uuid: d.ID,
        UI: d.TITLE,
        parentid: d.PARENETID,
        viewer: false,
        maker: false,
        checker: false,
        approver: false,
        edit: false,
        export: false,
        upload: false
      }, false)
    });
    this.updateView();
  }



}
