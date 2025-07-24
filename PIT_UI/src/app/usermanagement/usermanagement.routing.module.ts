import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../common/auth.guard';
// import { UiRoleConfigComponent } from './ui-role-config/ui-role-config.component';
import { UsermanagementComponent } from './usermanagement.component';

const routes : Routes = [
    {
        path : '', component: UsermanagementComponent, children: [
            // { path : 'role', component: UiRoleConfigComponent, canActivate: [AuthGuard] },             
        ]
    }
];

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports:  [RouterModule]
})

export class usermanagementModule { }
