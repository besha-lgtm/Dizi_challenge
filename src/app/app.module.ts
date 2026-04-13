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
    PostchallengeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,  
    ReactiveFormsModule,
    FormsModule,
    EvaluationComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }