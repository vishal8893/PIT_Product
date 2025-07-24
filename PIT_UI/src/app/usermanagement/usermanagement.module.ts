import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { usermanagementModule } from './usermanagement.routing.module';
import { UsermanagementComponent } from './usermanagement.component';
// import { UiRoleConfigComponent } from './ui-role-config/ui-role-config.component';
import { SharedModule } from 'primeng/api';

@NgModule ({
    imports: [
        CommonModule,
        usermanagementModule,
        SharedModule
    ],
    declarations: [
        UsermanagementComponent,
        // RoleComponent,
        // UIRoleComponent,
        // UiRoleConfigComponent
    ],
    exports: [
        SharedModule
    ],
    entryComponents: [

    ]
})

export class UserModule { }
