import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { CalendarCommonModule, CalendarMonthModule,CalendarModule } from 'angular-calendar';
import { DetailsViewComponent } from './details-view/details-view.component';
import { FormsModule } from '@angular/forms';
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path :'admin-dashboard', component : AdminDashboardComponent, pathMatch: 'full'},
      { path : 'user-dashboard', component : UserDashboardComponent, pathMatch : 'full'},
      { path : 'user/:userId', component :UserDashboardComponent, pathMatch: 'full'},
      { path : 'details/:userId', component: DetailsViewComponent, pathMatch: 'full'},
      { path : 'edit/:meetingId', component: EditMeetingComponent}
    ]),
    CalendarMonthModule,
    CalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    FormsModule
  ],
  declarations: [AdminDashboardComponent, UserDashboardComponent, DetailsViewComponent, EditMeetingComponent]
})
export class DashboardModule { }
