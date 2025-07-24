import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
// components
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
// import { MessageService } from 'primeng/api';
//primeng modules
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChartModule } from 'primeng/chart';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { LoginComponent } from './login/login.component';
import { UiRoleConfigComponent } from './default-layout/components/ui-role-config/ui-role-config.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { HomeComponent } from './default-layout/components/home/home.component';
import { UserMasterComponent } from './default-layout/components/user-master/user-master.component';
import { RoleMasterComponent } from './default-layout/components/role-master/role-master.component';
import { ExpiraydateMasterComponent } from './default-layout/components/expiraydate-master/expiraydate-master.component';
import { ItradingPrimaryIssueMasterComponent } from './default-layout/components/itrading-primary-issue-master/itrading-primary-issue-master.component';
import { ScriptMasterComponent } from './default-layout/components/script-master/script-master.component';
import { ITradingGreyListComponent } from './default-layout/components/itrading-grey-list/itrading-grey-list.component';
import { ITradingRestrictedListComponent } from './default-layout/components/itrading-restricted-list/itrading-restricted-list.component';
import { MaterialsubdiaryMasterComponent } from './default-layout/components/materialsubdiary-master/materialsubdiary-master.component';
import { EntityMasterComponent } from './default-layout/components/entity-master/entity-master.component';
import { BusineesgroupMasterComponent } from './default-layout/components/busineesgroup-master/busineesgroup-master.component';
import { SbuMasterComponent } from './default-layout/components/sbu-master/sbu-master.component';
import { LobMasterComponent } from './default-layout/components/lob-master/lob-master.component';
import { SubLobMasterComponent } from './default-layout/components/sub-lob-master/sub-lob-master.component';
// import { UsermanagementComponent } from './usermanagement/usermanagement.component';
// import { UserMasterComponent } from './default-layout/components/user-master/user-master.component';
import { M3andupsiadminMasterComponent } from './default-layout/components/m3andupsiadmin-master/m3andupsiadmin-master.component';
import { UpsiMasterComponent } from './default-layout/components/upsi-master/upsi-master.component';
import { EntityCeoBhMappingMasterComponent } from './default-layout/components/entity-ceo-bh-mapping-master/entity-ceo-bh-mapping-master.component';
import { EntityMaterialsubsidiaryCeoBhMappingMasterComponent } from './default-layout/components/entity-materialsubsidiary-ceo-bh-mapping-master/entity-materialsubsidiary-ceo-bh-mapping-master.component';
import { TreadingwindowcloseMasterComponent } from './default-layout/components/treadingwindowclose-master/treadingwindowclose-master.component';
import { JoiningDeclarationFormComponent } from './default-layout/components/joining-declaration-form/joining-declaration-form.component';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DesginatedCeoMappingComponent } from './default-layout/components/desginated-ceo-mapping/desginated-ceo-mapping.component';
// import { BusinessHeadComponent } from './default-layout/business-head/business-head.component';
import { BusinessHeadComponent } from './default-layout/components/business-head/business-head.component';
// import { ScriptMasterComponent } from './default-layout/components/script-master/script-master.component';
import { UserCategorizationMasterComponent } from './default-layout/components/user-categorization-master/user-categorization-master.component';
import { FromdeclartionComponent } from './default-layout/components/fromdeclartion/fromdeclartion.component';
import { PITCodeAcceptComponent } from './default-layout/components/pitcode-accept/pitcode-accept.component';
import {MessagesModule} from 'primeng/messages';
import { InvestmentApprovalFormComponent } from './default-layout/components/investment-approval-form/investment-approval-form.component';
import { EAHComponent } from './default-layout/components/eah/eah.component';
import { PcofinComponent } from './default-layout/components/pcofin/pcofin.component';
import { ReportComponent } from './default-layout/components/report/report.component';
import { PrimaryRejectionMasterComponent } from './default-layout/components/primary-rejection-master/primary-rejection-master.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { CreateUpsiProjectComponent } from './default-layout/components/create-upsi-project/create-upsi-project.component';
import { StepsModule } from 'primeng/steps';
import { EirfMailDiscosureComponent } from './default-layout/components/eirf-mail-discosure/eirf-mail-discosure.component'
import { SubstantialInterestDeclarationFormComponent } from './default-layout/components/substantial-interest-declaration-form/substantial-interest-declaration-form.component';
import { QuarterMasterComponent } from './default-layout/components/quarter-master/quarter-master.component';
import { ViolationReportComponent } from './default-layout/components/violation-report/violation-report.component';
import { UploadsComponent } from './default-layout/components/uploads/uploads.component';
import { HrmsUploadsComponent } from './default-layout/components/hrms-uploads/hrms-uploads.component';
import { UploadBenposFileComponent } from './default-layout/components/upload-benpos-file/upload-benpos-file.component'
import {ComplianceApproveComponent} from './default-layout/components/Compliance-Approve-Master/Compliance-Approve.component'
import { DarkPoolComponent } from './default-layout/components/dark-pool/dark-pool.component';
import { ReportNwilComponent } from './default-layout/components/report-nwil/report-nwil.component';
import { DarkPoolApprovalComponent } from './default-layout/components/dark-pool-approval/dark-pool-approval.component';
import { AutoIrfApprovalComponent } from './default-layout/components/auto-irf-approval/auto-irf-approval.component';
import { TreadReportingComponent } from './default-layout/components/tread-reporting/tread-reporting.component';
@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    LoginComponent,
    HomeComponent,
    UiRoleConfigComponent,
    UserMasterComponent,
    RoleMasterComponent,
    ExpiraydateMasterComponent,
    ItradingPrimaryIssueMasterComponent,
    ScriptMasterComponent,
    ITradingGreyListComponent,
    ITradingRestrictedListComponent,
    MaterialsubdiaryMasterComponent,
    EntityMasterComponent,
    BusineesgroupMasterComponent,
    SbuMasterComponent,
    LobMasterComponent,
    SubLobMasterComponent,
    M3andupsiadminMasterComponent,
    UpsiMasterComponent,
    EntityCeoBhMappingMasterComponent,
    EntityMaterialsubsidiaryCeoBhMappingMasterComponent,
    TreadingwindowcloseMasterComponent,
    JoiningDeclarationFormComponent,
    DesginatedCeoMappingComponent,
    BusinessHeadComponent,
    UserCategorizationMasterComponent,
    FromdeclartionComponent,
    InvestmentApprovalFormComponent,
    PITCodeAcceptComponent,
    EAHComponent,
    PcofinComponent,
    ReportComponent,
    PrimaryRejectionMasterComponent,
    CreateUpsiProjectComponent,
    EirfMailDiscosureComponent,
    SubstantialInterestDeclarationFormComponent,
    QuarterMasterComponent,
    ViolationReportComponent,
    UploadsComponent,
    HrmsUploadsComponent,
    UploadBenposFileComponent,
    ComplianceApproveComponent,
    DarkPoolComponent,
    ReportNwilComponent,
    DarkPoolApprovalComponent,
    AutoIrfApprovalComponent,
    TreadReportingComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PanelModule,
    PanelMenuModule,
    MultiSelectModule,
    SidebarModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    CheckboxModule,
    InputTextareaModule,
    InputTextModule,
    BreadcrumbModule,
    CardModule,
    CalendarModule,
    RadioButtonModule,
    FileUploadModule,
    InputSwitchModule,
    ToastModule,
    InputNumberModule,
    AutoCompleteModule,
    TabViewModule,
    ToolbarModule,
    DialogModule,MessagesModule,
    StepsModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
