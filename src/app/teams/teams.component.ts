import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  standalone: false,
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {

  activeFilter = 'all';
  searchText = '';

  constructor(private router: Router) {}

  teams: any[] = [
    {
      name: 'Team Alpha Innovators',
      challenge: 'Power Loss Reduction',
      domain: 'IoT',
      role: 'Leader',
      members: ['Deepika', 'Ravi', 'Kiran'],
      progress: 65,
      submissions: 2,
      status: 'active'
    },
    {
      name: 'Beta Explorers',
      challenge: 'Energy Efficiency Optimization',
      domain: 'Renewable Energy',
      role: 'Member',
      members: ['Priya', 'Suresh'],
      progress: 40,
      submissions: 3,
      status: 'active'
    },
    {
      name: 'Agri Vision AI',
      challenge: 'Crop Disease Detection',
      domain: 'AI',
      role: 'Member',
      members: ['Karthik', 'Anil'],
      progress: 100,
      submissions: 5,
      status: 'completed'
    }
  ];

  filteredTeams: any[] = [...this.teams];

  // 🔍 FILTER BUTTONS
  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  // 🔍 SEARCH
  onSearchChange(value: string) {
    this.searchText = value.toLowerCase();
    this.applyFilters();
  }

  // 🔍 APPLY FILTER + SEARCH
  applyFilters() {
    this.filteredTeams = this.teams.filter(team => {

      const matchesFilter =
        this.activeFilter === 'all' ||
        team.status === this.activeFilter;

      const matchesSearch =
        team.name.toLowerCase().includes(this.searchText) ||
        team.challenge.toLowerCase().includes(this.searchText);

      return matchesFilter && matchesSearch;
    });
  }

  // 🔢 COUNT
  getCount(type: string) {
    if (type === 'all') return this.teams.length;
    return this.teams.filter(t => t.status === type).length;
  }

  // 🔥 JOIN BUTTON FUNCTION
  joinTeam(team: any) {
    this.router.navigate(['/create-team'], {
      state: { teamData: team }
    });
  }
}