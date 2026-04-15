import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  openFaq: number | null = null;

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }
}
