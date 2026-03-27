import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SubmissionComponent } from './submission/submission.component';
import { RewardsComponent } from './rewards/rewards.component';
import { RegisterComponent } from './register/register.component';
import { DetailComponent } from './detail/detail.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // LAYOUT 1: Dashboard (With Sidebar)
  {
    path: 'dashboard',
    component: SidebarComponent, 
    children: [
      { path: '', component: DashboardComponent } // Loads at /dashboard
    ]
  },


  { path: 'detail', component: DetailComponent },
  { path: 'submission', component: SubmissionComponent },
  { path: 'rewards', component: RewardsComponent },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }