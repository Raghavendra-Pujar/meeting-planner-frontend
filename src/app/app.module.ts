import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService} from 'ngx-cookie-service';
import { ApiService } from './api.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { SocketService } from './socket.service';
import { ForbiddenComponent } from './error-views/forbidden/forbidden.component';
import { NotFoundComponent } from './error-views/not-found/not-found.component';
import { ErrorViewsModule } from './error-views/error-views.module';


@NgModule({
  declarations: [
    AppComponent
        ],
  imports: [
    BrowserModule,
    FormsModule,
    DashboardModule,
    UserModule,
    ErrorViewsModule,
    RouterModule.forRoot([
      { path : 'login', component : LoginComponent, pathMatch : 'full'},
      { path : '', redirectTo: 'login', pathMatch : 'full'},
      { path : '*', component: LoginComponent},
      { path: '500', component:ForbiddenComponent},
      { path: '404', component: NotFoundComponent},
      { path:'**',component:NotFoundComponent},
      { path : '*', component: LoginComponent}
    ]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [ApiService,CookieService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
