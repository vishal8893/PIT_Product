import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { HomeComponent } from './default-layout/components/home/home.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { UiRoleConfigComponent } from './default-layout/components/ui-role-config/ui-role-config.component';
import { LoginComponent } from './login/login.component';
// import { UserMasterComponent } from './default-layout/components/user-master/user-master.component';
import { RoleMasterComponent } from './default-layout/components/role-master/role-master.component';
import { ExpiraydateMasterComponent } from './default-layout/components/expiraydate-master/expiraydate-master.component';
import { ITradingGreyListComponent } from './default-layout/components/itrading-grey-list/itrading-grey-list.component';
import { ITradingRestrictedListComponent } from './default-layout/components/itrading-restricted-list/itrading-restricted-list.component';
import { ItradingPrimaryIssueMasterComponent } from './default-layout/components/itrading-primary-issue-master/itrading-primary-issue-master.component';
import { ScriptMasterComponent } from './default-layout/components/script-master/script-master.component';
import { MaterialsubdiaryMasterComponent } from './default-layout/components/materialsubdiary-master/materialsubdiary-master.component';
import { EntityMasterComponent } from './default-layout/components/entity-master/entity-master.component';
import { BusineesgroupMasterComponent } from './default-layout/components/busineesgroup-master/busineesgroup-master.component';
import { SbuMasterComponent } from './default-layout/components/sbu-master/sbu-master.component';
import { LobMasterComponent } from './default-layout/components/lob-master/lob-master.component';
import { SubLobMasterComponent } from './default-layout/components/sub-lob-master/sub-lob-master.component';
import { UserMasterComponent } from './default-layout/components/user-master/user-master.component';
import { M3andupsiadminMasterComponent } from './default-layout/components/m3andupsiadmin-master/m3andupsiadmin-master.component';
import { UpsiMasterComponent } from './default-layout/components/upsi-master/upsi-master.component';
import { EntityCeoBhMappingMasterComponent } from './default-layout/components/entity-ceo-bh-mapping-master/entity-ceo-bh-mapping-master.component';
import { EntityMaterialsubsidiaryCeoBhMappingMasterComponent } from './default-layout/components/entity-materialsubsidiary-ceo-bh-mapping-master/entity-materialsubsidiary-ceo-bh-mapping-master.component';
import { TreadingwindowcloseMasterComponent } from './default-layout/components/treadingwindowclose-master/treadingwindowclose-master.component';
import { JoiningDeclarationFormComponent } from './default-layout/components/joining-declaration-form/joining-declaration-form.component';
// import { ScriptMasterComponent } from './default-layout/components/script-master/script-master.component';
// { path: 'script-master', component: ScriptMasterComponent },
import { DesginatedCeoMappingComponent } from './default-layout/components/desginated-ceo-mapping/desginated-ceo-mapping.component';
import { BusinessHeadComponent } from './default-layout/components/business-head/business-head.component';
import { UserCategorizationMasterComponent } from './default-layout/components/user-categorization-master/user-categorization-master.component';
import { FromdeclartionComponent } from './default-layout/components/fromdeclartion/fromdeclartion.component';
import { PITCodeAcceptComponent } from './default-layout/components/pitcode-accept/pitcode-accept.component';
import { InvestmentApprovalFormComponent } from './default-layout/components/investment-approval-form/investment-approval-form.component';
import { EAHComponent } from './default-layout/components/eah/eah.component';
import { PcofinComponent } from './default-layout/components/pcofin/pcofin.component';
import { ReportComponent } from './default-layout/components/report/report.component';
import { PrimaryRejectionMasterComponent } from './default-layout/components/primary-rejection-master/primary-rejection-master.component';
import { CreateUpsiProjectComponent } from './default-layout/components/create-upsi-project/create-upsi-project.component';
import { EirfMailDiscosureComponent } from './default-layout/components/eirf-mail-discosure/eirf-mail-discosure.component';
import { SubstantialInterestDeclarationFormComponent } from './default-layout/components/substantial-interest-declaration-form/substantial-interest-declaration-form.component';
import { QuarterMasterComponent } from './default-layout/components/quarter-master/quarter-master.component';
import { ViolationReportComponent } from './default-layout/components/violation-report/violation-report.component';
import { UploadsComponent } from './default-layout/components/uploads/uploads.component';
import { HrmsUploadsComponent } from './default-layout/components/hrms-uploads/hrms-uploads.component';
import { UploadBenposFileComponent } from './default-layout/components/upload-benpos-file/upload-benpos-file.component';
import { UploadNwilComponent } from './default-layout/components/upload-nwil/upload-nwil.component';
import { ReportNwilComponent } from './default-layout/components/report-nwil/report-nwil.component';
import { ComplianceApproveComponent } from './default-layout/components/Compliance-Approve-Master/Compliance-Approve.component'
import { DarkPoolComponent } from './default-layout/components/dark-pool/dark-pool.component';
import { DarkPoolApprovalComponent } from './default-layout/components/dark-pool-approval/dark-pool-approval.component';
import { AutoIrfApprovalComponent } from './default-layout/components/auto-irf-approval/auto-irf-approval.component';
import { TreadReportingComponent } from './default-layout/components/tread-reporting/tread-reporting.component';
const routes: Routes = [
  { path: '', redirectTo: 'pit/login', pathMatch: 'full' },

  {
    path: 'pit',
    component: DefaultLayoutComponent,
    children: [
      { path: 'Home', component: HomeComponent },
      { path: 'uiroleconfig', component: UiRoleConfigComponent },
      { path: 'usermaster', component: UserMasterComponent },
      { path: 'rolemaster', component: RoleMasterComponent },
      { path: 'expiraymaster', component: ExpiraydateMasterComponent },
      { path: 'greylistmaster', component: ITradingGreyListComponent },
      { path: 'restrictedlistmaster', component: ITradingRestrictedListComponent },
      { path: 'primaryissuemaster', component: ItradingPrimaryIssueMasterComponent },
      { path: 'script-master', component: ScriptMasterComponent },
      { path: 'materialsubdiary', component: MaterialsubdiaryMasterComponent },
      { path: 'entity', component: EntityMasterComponent },
      { path: 'business', component: BusineesgroupMasterComponent },
      { path: 'sbu', component: SbuMasterComponent },
      { path: 'lob', component: LobMasterComponent },
      { path: 'sublob', component: SubLobMasterComponent },
      { path: 'treadingwindow', component: TreadingwindowcloseMasterComponent },
      { path: 'meupsimaster', component: M3andupsiadminMasterComponent },
      { path: 'upsimaster', component: UpsiMasterComponent },
      { path: 'entityceobhmaster', component: EntityCeoBhMappingMasterComponent },
      { path: 'entitymaterialsubdiary', component: EntityMaterialsubsidiaryCeoBhMappingMasterComponent },
      { path: 'joiningdeclaration', component: JoiningDeclarationFormComponent },
      { path: 'desginatedceomap', component: DesginatedCeoMappingComponent },
      { path: 'businesshead', component: BusinessHeadComponent },
      { path: 'usercategorization', component: UserCategorizationMasterComponent },
      { path: 'InvestmentApprovalForm', component: InvestmentApprovalFormComponent },
      { path: 'pobdeclartion', component: FromdeclartionComponent },
      { path: 'pitcodeaccept', component: PITCodeAcceptComponent },
      { path: 'eah', component: EAHComponent },
      { path: 'pcoin', component: PcofinComponent },
      { path: 'report', component: ReportComponent },
      { path: 'itradingprimarymaster', component: PrimaryRejectionMasterComponent },
      { path: 'upsiproject', component: CreateUpsiProjectComponent },
      { path: 'EirfMailDisclosure', component: EirfMailDiscosureComponent },
      { path: 'scoi', component: SubstantialInterestDeclarationFormComponent },
      { path: 'quarter', component: QuarterMasterComponent },
      { path: 'violationreport', component: ViolationReportComponent },
      { path: 'uploads', component: UploadsComponent },
      { path: 'hrmsuploads', component: HrmsUploadsComponent },
      { path: 'benposuploads', component: UploadBenposFileComponent },
      { path: 'nwilupload', component: UploadNwilComponent },
      { path: 'nwilreport', component: ReportNwilComponent },
      { path: 'cam', component: ComplianceApproveComponent },
      { path: 'dark-pool', component: DarkPoolComponent }, //kalinditech
      { path: 'dark-pool-approval', component: DarkPoolApprovalComponent }, //kalinditech
      { path: 'aia', component: AutoIrfApprovalComponent },
      { path: 'TreadReporting', component: TreadReportingComponent}
    ],
    // canActivate: [AuthGuard]
  },
  { path: 'pit/login', component: LoginComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
