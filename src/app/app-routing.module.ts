import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DialogEntryComponent } from './dialog/login-signup-dialog';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'login', component: DialogEntryComponent, canActivate: [AuthGuard] },
      { path: 'signup', component: DialogEntryComponent, canActivate: [AuthGuard] },
      { path: 'register', component: DialogEntryComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
