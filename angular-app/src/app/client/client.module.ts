import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { ClientRoutingModule } from './client-routing.module';
import { MaterialModule } from '../material/material.module';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProfileComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ClientRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class ClientModule { }
