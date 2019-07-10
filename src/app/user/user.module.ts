import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'signup', component: SignupComponent, pathMatch: 'full' },
      { path: 'forgot-password',component: ForgotPasswordComponent, pathMatch: 'full' },
      { path: 'reset-password',component:ResetPasswordComponent, pathMatch: 'full'}
    ])
  ],
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ResetPasswordComponent]
})
export class UserModule { }
