import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Interface for main reward cards
interface RewardCard {
  icon: string;
  title: string;
  description: string;
  value: string;
  buttonText: string;
  buttonAction: 'leaderboard' | 'certificate' | 'internship';
  cardType: 'blue' | 'red' | 'green';
}

// Interface for special awards
interface SpecialAward {
  icon: string;
  title: string;
  subtitle: string;
}

// Interface for winner
interface Winner {
  avatar: string;
  initials: string;
  name: string;
  college: string;
  badge: string;
  badgeType: 'gold' | 'silver' | 'bronze' | 'green';
  avatarBg: string;
}

@Component({
  selector: 'app-rewards',
  standalone: false,
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent {
  // Header Section
  headerTitle: string = 'Rewards & Recognition';
  headerSubtitle: string = 'Celebrating the brightest student minds solving real-world industry problems';
  headerIcon: string = '🏆';

  // Main Reward Cards - Easy for backend to update
  rewardCards: RewardCard[] = [
    {
      icon: '🏅',
      title: 'Grand Winner Prize',
      description: 'Team Alpha Innovators for their practical low-cost energy optimization solution.',
      value: '₹10,000',
      buttonText: 'View on Leaderboard',
      buttonAction: 'leaderboard',
      cardType: 'blue'
    },
    {
      icon: '📜',
      title: 'Certificates for All',
      description: 'Digital certificates for all finalists, shortlisted teams, and faculty mentors.',
      value: 'All Participants',
      buttonText: 'Preview Certificate',
      buttonAction: 'certificate',
      cardType: 'red'
    },
    {
      icon: '💼',
      title: 'Internship Opportunity',
      description: 'Top participants considered for 3-month internship and pilot implementation.',
      value: 'Top 3 Teams',
      buttonText: 'Offer Internship',
      buttonAction: 'internship',
      cardType: 'green'
    }
  ];

  // Special Awards Section
  specialAwardsTitle: string = '🏅 Special Recognition Awards';
  specialAwards: SpecialAward[] = [
    {
      icon: '⚡',
      title: 'Most Innovative',
      subtitle: 'Boldest, most creative approach'
    },
    {
      icon: '🌱',
      title: 'Social Impact',
      subtitle: 'Highest societal & community value'
    },
    {
      icon: '🔧',
      title: 'Best Technical',
      subtitle: 'Superior engineering quality'
    },
    {
      icon: '🎤',
      title: 'Best Pitch',
      subtitle: 'Most compelling demo & presentation'
    }
  ];

  // Winners Hall Section
  winnersTitle: string = '⭐ Hall of Winners';
  winners: Winner[] = [
    {
      avatar: '',
      initials: 'AI',
      name: 'Alpha Innovators',
      college: 'ANITS, Visakhapatnam',
      badge: '🏆 Grand Winner',
      badgeType: 'gold',
      avatarBg: 'blue-bg'
    },
    {
      avatar: '',
      initials: 'GV',
      name: 'Green Vision',
      college: 'KL University',
      badge: '🥈 Runner Up',
      badgeType: 'silver',
      avatarBg: 'gray-bg'
    },
    {
      avatar: '',
      initials: 'TM',
      name: 'Track Masters',
      college: 'GITAM, Hyderabad',
      badge: '🥉 Top 3',
      badgeType: 'bronze',
      avatarBg: 'orange-bg'
    },
    {
      avatar: '',
      initials: 'SS',
      name: 'Smart Sensors',
      college: 'JNTU Kakinada',
      badge: '⚡ Most Innovative',
      badgeType: 'green',
      avatarBg: 'teal-bg'
    }
  ];

  constructor(private router: Router) {}

  // Handle button actions based on type
  handleCardAction(action: 'leaderboard' | 'certificate' | 'internship'): void {
    switch(action) {
      case 'leaderboard':
        this.viewLeaderboard();
        break;
      case 'certificate':
        this.previewCertificate();
        break;
      case 'internship':
        this.offerInternship();
        break;
    }
  }

  viewLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }

  previewCertificate(): void {
    this.router.navigate(['/certificates']);
  }

  offerInternship(): void {
    // Backend can implement internship logic
    this.router.navigate(['/leaderboard']);
  }
}
