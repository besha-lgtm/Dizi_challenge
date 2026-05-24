import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RewardsComponent } from './rewards/rewards.component';
import { SubmissionComponent } from './submission/submission.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DetailComponent } from './detail/detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ChallengesComponent } from './challenges/challenges.component';
import { PostchallengeComponent } from './postchallenge/postchallenge.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { TeamsComponent } from './teams/teams.component';
import { OverviewComponent } from './detail/overview/overview.component';
import { DiscussionComponent } from './detail/discussion/discussion.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SettingsComponent } from './settings/settings.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { SubmissionsComponent } from './detail/submissions/submissions.component';
import { ResourcesComponent } from './detail/resources/resources.component';
import { RegistrationComponent } from './detail/registration/registration.component';
import { CommonModule } from '@angular/common';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { TruncatedTooltipDirective } from './directives/truncated-tooltip.directive';
import { authInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RewardsComponent,
    SubmissionComponent,
    HeaderComponent,
    SidebarComponent,
    DetailComponent,
    DashboardComponent,
    HomeComponent,
    LeaderboardComponent,
    ChallengesComponent,
    PostchallengeComponent,
    TeamsComponent,
    OverviewComponent,
    DiscussionComponent,
    ResetPasswordComponent,
    SettingsComponent,
    CertificatesComponent,
    CreateTeamComponent,
    SubmissionsComponent,
    ResourcesComponent,
    EvaluationComponent,
    RegistrationComponent,
    TruncatedTooltipDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,  
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }