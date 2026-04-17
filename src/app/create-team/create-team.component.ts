import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-team',
  standalone: false,
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {

  isEditMode = false; 
  isHovering: any = {
  name: false,
  challenge: false,
  domain: false,
  role: false,
  members: false
};

  team: any = {
    name: '',
    challenge: '',
    domain: '',
    role: '',
    members: [],
    progress: 65,
    submissions: 2,
    status: 'active'
  };

  membersInput = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = history.state.teamData;

    if (data) {
      this.isEditMode = true; 
      this.team = { ...data };
      this.membersInput = this.team.members.join(', ');
    }
  }

  createTeam() {

    this.team.members = this.membersInput
      .split(',')
      .map(m => m.trim())
      .filter(m => m !== '');

    let teams = JSON.parse(localStorage.getItem('teams') || '[]');

    const index = teams.findIndex((t: any) => t.name === this.team.name);

    if (index !== -1) {
      teams[index] = this.team; 
    } else {
      teams.push(this.team); // 
    }

    localStorage.setItem('teams', JSON.stringify(teams));

    this.router.navigate(['/teams']);
  }
  onSubmit(form: NgForm) {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  this.team.members = this.membersInput
    .split(',')
    .map(m => m.trim())
    .filter(m => m !== '');

  let teams = JSON.parse(localStorage.getItem('teams') || '[]');

  const index = teams.findIndex((t: any) => t.name === this.team.name);

  if (index !== -1) {
    teams[index] = this.team;
  } else {
    teams.push(this.team);
  }

  localStorage.setItem('teams', JSON.stringify(teams));
  this.router.navigate(['/teams']);
}
}