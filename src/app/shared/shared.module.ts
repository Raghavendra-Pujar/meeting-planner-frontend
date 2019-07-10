import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NavigationComponent],
  exports:[
    NavigationComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
