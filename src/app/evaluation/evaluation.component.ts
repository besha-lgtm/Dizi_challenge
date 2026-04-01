import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent {

  selectedTeam = 'Team Alpha Innovators';

  scores = [
    { label: 'Innovation', value: 8.4, color: '#3b82f6' },
    { label: 'Feasibility', value: 7.9, color: '#6366f1' },
    { label: 'Impact', value: 9.0, color: '#10b981' },
    { label: 'Cost Efficiency', value: 8.1, color: '#f59e0b' },
    { label: 'Scalability', value: 7.5, color: '#8b5cf6' }
  ];

  teams = [
    {
      name: 'Alpha Innovators',
      college: 'ANITS, Vizag',
      challenge: 'Power Loss Reduction',
      status: 'Scoring Now',
      statusClass: 'yellow',
      active: true
    },
    {
      name: 'Green Vision',
      college: 'KL University',
      challenge: 'Crop Monitoring',
      status: 'Reviewed',
      statusClass: 'green'
    },
    {
      name: 'Track Masters',
      college: 'GITAM, Hyderabad',
      challenge: 'Asset Tracking',
      status: 'To Review',
      statusClass: 'yellow'
    },
    {
      name: 'Smart Sensors',
      college: 'JNTU Kakinada',
      challenge: 'Irrigation Advisory',
      status: 'Pending',
      statusClass: 'gray'
    }
  ];

  formFields = [
    { label: 'Innovation', value: 8 },
    { label: 'Feasibility', value: 7 },
    { label: 'Impact', value: 9 },
    { label: 'Cost Efficiency', value: 8 },
    { label: 'Scalability', value: 7 }
  ];
  getTotalScore(): number {
  return this.formFields.reduce((sum, f) => sum + Number(f.value || 0), 0);
}

  comments = 'This solution is practical, low cost...';

}