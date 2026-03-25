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
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'submission', component: SubmissionComponent},
  {path: 'rewards', component: RewardsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'detail', component: DetailComponent},
  {path: 'sidebar', component: SidebarComponent},
  {path: 'dashboard', component: DashboardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
