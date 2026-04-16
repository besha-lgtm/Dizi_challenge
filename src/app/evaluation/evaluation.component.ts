import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluation',
  standalone: false,
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  selectedTeam: string = '';
  selectedTeamData: any = null;

  // 🔥 dynamic model
  currentScoresArray: { key: string; value: number }[] = [];
  currentComments: string = '';

  // 🔝 top cards (static summary UI)
  scores = [
    { label: 'Innovation', value: 8.4, color: '#3b82f6' },
    { label: 'Feasibility', value: 7.9, color: '#6366f1' },
    { label: 'Impact', value: 9.0, color: '#10b981' },
    { label: 'Cost Efficiency', value: 8.1, color: '#f59e0b' },
    { label: 'Scalability', value: 7.5, color: '#8b5cf6' }
  ];

  // 🔥 team data
  teams = [
  {
    name: 'Alpha Innovators',
    college: 'ANITS, Vizag',
    challenge: 'Power Loss Reduction',
    status: 'Scoring Now',
    statusClass: 'yellow',

    scores: {
      Innovation: 8,
      Feasibility: 7,
      Impact: 9,
      'Cost Efficiency': 8,
      Scalability: 7
    },

    comments: 'Good approach, improve optimization'
  },
  {
    name: 'Green Vision',
    college: 'KL University',
    challenge: 'Crop Monitoring',
    status: 'Reviewed',
    statusClass: 'green',

    scores: {
      Innovation: 7,
      Feasibility: 8,
      Impact: 7,
      'Cost Efficiency': 6,
      Scalability: 7
    },

    comments: 'Needs more validation and testing'
  },
  {
    name: 'Track Masters',
    college: 'GITAM, Hyderabad',
    challenge: 'Asset Tracking System',
    status: 'To Review',
    statusClass: 'yellow',

    scores: {
      Innovation: 6,
      Feasibility: 7,
      Impact: 6,
      'Cost Efficiency': 7,
      Scalability: 6
    },

    comments: 'Concept is basic, needs improvement'
  },
  {
    name: 'Smart Sensors',
    college: 'JNTU Kakinada',
    challenge: 'Irrigation Advisory',
    status: 'Pending',
    statusClass: 'gray',

    scores: {
      Innovation: 7,
      Feasibility: 6,
      Impact: 7,
      'Cost Efficiency': 8,
      Scalability: 7
    },

    comments: 'Awaiting full submission'
  },
  {
    name: 'NextGen AI',
    college: 'VIT Vellore',
    challenge: 'Predictive Maintenance',
    status: 'Reviewed',
    statusClass: 'green',

    scores: {
      Innovation: 9,
      Feasibility: 8,
      Impact: 9,
      'Cost Efficiency': 7,
      Scalability: 8
    },

    comments: 'Excellent solution with strong scalability potential'
  }
];

  ngOnInit() {
    this.selectTeam(this.teams[0]);
  }

  // 🔥 select team
  selectTeam(team: any) {
  this.selectedTeam = team.name;
  this.selectedTeamData = team;

  // convert object → array
  this.currentScoresArray = Object.keys(team.scores).map(key => ({
    key,
    value: team.scores[key]
  }));

  this.currentComments = team.comments;
}

  // 🔢 total score
  getTotalScore(): number {
  return this.currentScoresArray
    .reduce((sum, item) => sum + Number(item.value || 0), 0);
}
  // 🔥 update status + save
  updateStatus(status: string) {
  if (!this.selectedTeamData) return;

  // convert array → object
  const updatedScores: any = {};
  this.currentScoresArray.forEach(item => {
    updatedScores[item.key] = item.value;
  });

  this.selectedTeamData.scores = updatedScores;
  this.selectedTeamData.comments = this.currentComments;

  this.selectedTeamData.status = status;

  if (status === 'Shortlisted') this.selectedTeamData.statusClass = 'green';
  else if (status === 'Winner') this.selectedTeamData.statusClass = 'orange';
  else this.selectedTeamData.statusClass = 'red';
}

  // 📊 shortlisted count
  getShortlistedCount() {
    return this.teams.filter(t => t.status === 'Shortlisted').length;
  }
}