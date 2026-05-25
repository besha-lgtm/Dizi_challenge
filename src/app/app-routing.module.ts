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
import { authGuard, adminGuard, guestGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  {
    path: 'dashboard',
    component: SidebarComponent,
    canActivate: [authGuard, adminGuard],
    children: [{ path: '', component: DashboardComponent }]
  },

  {
    path: 'challenges/detail',
    component: DetailComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'discussion', component: DiscussionComponent, canActivate: [adminGuard] },
      { path: 'submissions', component: SubmissionsComponent, canActivate: [adminGuard] },
      { path: 'resources', component: ResourcesComponent }
    ]
  },

  { path: 'submission', component: SubmissionComponent, canActivate: [authGuard] },
  { path: 'rewards', component: RewardsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard, adminGuard] },
  { path: 'challenges', component: ChallengesComponent, canActivate: [authGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'postchallenge', component: PostchallengeComponent, canActivate: [authGuard, adminGuard] },
  { path: 'evaluation', component: EvaluationComponent, canActivate: [authGuard, adminGuard] },
  { path: 'teams', component: TeamsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'discussion', component: DiscussionComponent, canActivate: [authGuard, adminGuard] },
  { path: 'overview', component: OverviewComponent, canActivate: [authGuard, adminGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [guestGuard] },
  { path: 'certificates', component: CertificatesComponent, canActivate: [authGuard, adminGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'create-team', component: CreateTeamComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
