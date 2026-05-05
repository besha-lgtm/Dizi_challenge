import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TeamsComponent } from '../teams/teams.component';

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
    members: [
      { name: '', email: '', college: '' }
    ],
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
      this.team = {
        ...data,
        members: this.normalizeMembers(data.members)
      };
      this.membersInput = this.team.members
        .map((member: any) => this.getMemberName(member))
        .join(', ');
    }
  }

  addMember() {
    this.team.members.push({
      name: '',
      email: '',
      college: ''
    });
  }

  removeMember(index: number) {
    if (this.team.members.length > 1) {
      this.team.members.splice(index, 1);
    }
  }

  private getTeamsData(): any[] {
    const savedTeams = localStorage.getItem('teams');

    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        return Array.isArray(parsedTeams) ? parsedTeams : [];
      } catch {
        return [];
      }
    }

    return new TeamsComponent(this.router).teams;
  }

  private getMemberName(member: any): string {
    return typeof member === 'string' ? member : member?.name || '';
  }

  private normalizeMembers(members: any[]): any[] {
    if (!Array.isArray(members) || members.length === 0) {
      return [{ name: '', email: '', college: '' }];
    }

    return members.map((member: any) => {
      if (typeof member === 'string') {
        return { name: member, email: '', college: '' };
      }

      return {
        name: member?.name || '',
        email: member?.email || '',
        college: member?.college || ''
      };
    });
  }

  createTeam() {
    this.team.members = this.normalizeMembers(this.team.members);
    const teams = this.getTeamsData();
    const index = teams.findIndex((t: any) => t.name === this.team.name);

    if (index !== -1) {
      teams[index] = this.team; 
    } else {
      teams.push(this.team);
    }

    localStorage.setItem('teams', JSON.stringify(teams));

    this.router.navigate(['/teams']);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const teams = this.getTeamsData();
    this.team.members = this.normalizeMembers(this.team.members);

    const index = teams.findIndex((t: any) => t.name === this.team.name);

    if (index !== -1) {
      teams[index] = { ...this.team };
    } else {
      teams.push({ ...this.team });
    }

    localStorage.setItem('teams', JSON.stringify(teams));
    this.router.navigate(['/teams']);
  }
}
