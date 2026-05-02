import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SubmissionComponent } from './submission/submission.component';
import { RewardsComponent } from './rewards/rewards.component';
import { RegisterComponent } from './register/register.component';
import { DetailComponent } from './detail/detail.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ChallengesComponent } from './challenges/challenges.component';
import { PostchallengeComponent } from './postchallenge/postchallenge.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { TeamsComponent } from './teams/teams.component';
import { DiscussionComponent } from './detail/discussion/discussion.component';
import { OverviewComponent } from './detail/overview/overview.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';  
import { CertificatesComponent } from './certificates/certificates.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { ResourcesComponent } from './detail/resources/resources.component';
import { SubmissionsComponent } from './detail/submissions/submissions.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },

  // LAYOUT 1: Dashboard (With Sidebar)
  {
    path: 'dashboard',
    component: SidebarComponent, 
    children: [
      { path: '', component: DashboardComponent } // Loads at /dashboard
    ]
  },

  // Challenge Details (Nested under challenges)
  {
    path: 'challenges/detail',
    component: DetailComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'discussion', component: DiscussionComponent },
      { path: 'submissions', component: SubmissionsComponent },
      { path: 'resources', component: ResourcesComponent }
    ]
  },

  { path: 'submission', component: SubmissionComponent },
  { path: 'rewards', component: RewardsComponent },
  { path: 'home', component: HomeComponent},
  { path: 'challenges', component: ChallengesComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'postchallenge', component: PostchallengeComponent },
  { path: 'evaluation', component: EvaluationComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'discussion', component: DiscussionComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'certificates', component: CertificatesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'create-team', component: CreateTeamComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }