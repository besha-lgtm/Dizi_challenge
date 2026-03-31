import { Component } from '@angular/core';

interface Team {
  rank: number;
  emoji: string;
  name: string;
  members: string;
  institution: string;
  score: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  filterLimit: number = 10;
  activeFilter: string = 'top10';

  allTeams: Team[] = [
    { rank: 1, emoji: '🏆', name: 'Alpha Innovators', members: 'Deepika S., Ravi K., +1', institution: 'ANITS, Vizag', score: 92, change: 3, changeType: 'positive' },
    { rank: 2, emoji: '🥈', name: 'Green Vision', members: 'Priya K., Arjun N.', institution: 'KL University', score: 88, change: 1, changeType: 'positive' },
    { rank: 3, emoji: '🥉', name: 'Track Masters', members: 'Ananya R., Dev P., +1', institution: 'GITAM, Hyderabad', score: 84, change: 1, changeType: 'positive' },
    { rank: 4, emoji: '', name: 'Smart Sensors', members: 'Ravi S., Meena L.', institution: 'JNTU Kakinada', score: 80, change: 0, changeType: 'neutral' },
    { rank: 5, emoji: '', name: 'VizTech Lab', members: 'Kiran B., Shreya T.', institution: 'MVGR College', score: 78, change: 2, changeType: 'positive' },
    { rank: 6, emoji: '', name: 'Code Wizards', members: 'Rahul V., Anita K.', institution: 'NIT Warangal', score: 76, change: 1, changeType: 'negative' },
    { rank: 7, emoji: '', name: 'Digital Pioneers', members: 'Nikita J., Vikas M.', institution: 'IIT Roorkee', score: 74, change: 0, changeType: 'neutral' },
    { rank: 8, emoji: '', name: 'Cloud Crusaders', members: 'Aditya S., Pooja R., +1', institution: 'Osmania University', score: 72, change: 1, changeType: 'positive' },
    { rank: 9, emoji: '', name: 'Tech Titans', members: 'Sandeep K., Navya S.', institution: 'BITS Pilani', score: 70, change: 2, changeType: 'positive' },
    { rank: 10, emoji: '', name: 'Innovation Hub', members: 'Arjun M., Priya R.', institution: 'VIT Vellore', score: 68, change: 1, changeType: 'positive' },
    { rank: 11, emoji: '', name: 'Data Architects', members: 'Vikram T., Isha P.', institution: 'DTU Delhi', score: 66, change: 1, changeType: 'negative' },
    { rank: 12, emoji: '', name: 'Quantum Leap', members: 'Rohit A., Maya K.', institution: 'NIT Trichy', score: 64, change: 2, changeType: 'positive' },
    { rank: 13, emoji: '', name: 'API Warriors', members: 'Ashok R., Divya S.', institution: 'IIIT Hyderabad', score: 62, change: 1, changeType: 'positive' },
    { rank: 14, emoji: '', name: 'Code Ninjas', members: 'Sanjay P., Richa M.', institution: 'PSG Tech', score: 60, change: 0, changeType: 'neutral' },
    { rank: 15, emoji: '', name: 'Smart Dev', members: 'Karthik B., Neha T.', institution: 'SVCE Chennai', score: 58, change: 1, changeType: 'negative' },
    { rank: 16, emoji: '', name: 'Tech Stars', members: 'Arun K., Siya L.', institution: 'Manipal', score: 56, change: 1, changeType: 'positive' },
    { rank: 17, emoji: '', name: 'Code Brigade', members: 'Varun S., Anjali R.', institution: 'SRM Chennai', score: 54, change: 2, changeType: 'positive' },
    { rank: 18, emoji: '', name: 'Digital Minds', members: 'Suresh M., Pooja K.', institution: 'VTU Belgaum', score: 52, change: 1, changeType: 'negative' },
    { rank: 19, emoji: '', name: 'Byte Builders', members: 'Akshay A., Kavya D.', institution: 'Amrita Pune', score: 50, change: 3, changeType: 'positive' },
    { rank: 20, emoji: '', name: 'Code Masters', members: 'Nikhil P., Shruti N.', institution: 'Anna University', score: 48, change: 1, changeType: 'negative' },
    { rank: 21, emoji: '', name: 'Tech Fusion', members: 'Siddharth J., Riya G.', institution: 'KIIT Bhubaneswar', score: 46, change: 2, changeType: 'positive' },
    { rank: 22, emoji: '', name: 'Logic League', members: 'Aman K., Avni S.', institution: 'NUST Islamabad', score: 44, change: 1, changeType: 'positive' },
    { rank: 23, emoji: '', name: 'Debug Club', members: 'Rohan M., Zainab L.', institution: 'Chandigarh University', score: 42, change: 0, changeType: 'neutral' },
    { rank: 24, emoji: '', name: 'Binary Blitz', members: 'Harshit S., Tanya W.', institution: 'LPU Punjab', score: 40, change: 1, changeType: 'negative' },
    { rank: 25, emoji: '', name: 'Algorithm Aces', members: 'Tanmay P., Priyanka C.', institution: 'Ashoka University', score: 38, change: 2, changeType: 'positive' },
    { rank: 26, emoji: '', name: 'Stack Overflow', members: 'Pranav T., Shreya D.', institution: 'Delhi University', score: 36, change: 1, changeType: 'positive' },
    { rank: 27, emoji: '', name: 'Pixel Perfect', members: 'Aryan K., Ananya M.', institution: 'GGSIPU Delhi', score: 34, change: 1, changeType: 'negative' },
    { rank: 28, emoji: '', name: 'Network Ninjas', members: 'Vaibhav R., Simran K.', institution: 'Pune University', score: 32, change: 2, changeType: 'positive' },
    { rank: 29, emoji: '', name: 'Cloud Champions', members: 'Ishan T., Disha S.', institution: 'Mumbai University', score: 30, change: 1, changeType: 'positive' },
    { rank: 30, emoji: '', name: 'DevOps Divas', members: 'Aditya J., Nikita P.', institution: 'Symbiosis Pune', score: 28, change: 0, changeType: 'neutral' },
    { rank: 31, emoji: '', name: 'Security Squad', members: 'Karan M., Ruhi N.', institution: 'UPES Dehradun', score: 26, change: 1, changeType: 'negative' },
    { rank: 32, emoji: '', name: 'AI Academy', members: 'Advit K., Neha S.', institution: 'Kalinga Institute', score: 24, change: 2, changeType: 'positive' },
    { rank: 33, emoji: '', name: 'ML Mavericks', members: 'Rishi V., Pooja L.', institution: 'Om Shanti University', score: 22, change: 1, changeType: 'positive' },
    { rank: 34, emoji: '', name: 'Web Wizards', members: 'Harsh B., Aarya G.', institution: 'JSS NOIDA', score: 20, change: 1, changeType: 'negative' },
    { rank: 35, emoji: '', name: 'Mobile Mavericks', members: 'Shiva K., Anjali R.', institution: 'Gurgaon University', score: 18, change: 2, changeType: 'positive' },
    { rank: 36, emoji: '', name: 'Game Dev Gang', members: 'Kunal S., Hina M.', institution: 'Noida University', score: 16, change: 1, changeType: 'positive' },
    { rank: 37, emoji: '', name: 'UI/UX United', members: 'Yash P., Diya K.', institution: 'Greater Noida', score: 14, change: 0, changeType: 'neutral' },
    { rank: 38, emoji: '', name: 'Backend Bunch', members: 'Saurav T., Isha D.', institution: 'Raj Institute', score: 12, change: 1, changeType: 'negative' },
    { rank: 39, emoji: '', name: 'Frontend Fighters', members: 'Nitin A., Maya S.', institution: 'Tech Park', score: 10, change: 2, changeType: 'positive' },
    { rank: 40, emoji: '', name: 'Database Dynamos', members: 'Arjun P., Riya T.', institution: 'Innovation Hub', score: 8, change: 1, changeType: 'positive' },
    { rank: 41, emoji: '', name: 'Testing Titans', members: 'Jatin M., Sarah L.', institution: 'Quality First', score: 6, change: 1, changeType: 'negative' },
    { rank: 42, emoji: '', name: 'Integration Inc', members: 'Priya K., Varun S.', institution: 'Tech Solutions', score: 4, change: 0, changeType: 'neutral' },
    { rank: 43, emoji: '', name: 'Performance Pro', members: 'Akash B., Neha W.', institution: 'Speed Zone', score: 2, change: 1, changeType: 'negative' },
    { rank: 44, emoji: '', name: 'Optimization org', members: 'Rohan L., Avni G.', institution: 'Efficient Tech', score: 1, change: 1, changeType: 'negative' },
    { rank: 45, emoji: '', name: 'Team Thunder', members: 'Sanjay R., Pooja D.', institution: 'Power House', score: 1, change: 1, changeType: 'positive' },
    { rank: 46, emoji: '', name: 'Dev Dragons', members: 'Tanmay S., Riya P.', institution: 'Dragon Lair', score: 0, change: 2, changeType: 'positive' },
    { rank: 47, emoji: '', name: 'Code Crew', members: 'Harsh K., Isha M.', institution: 'Crew Central', score: 0, change: 1, changeType: 'negative' },
    { rank: 48, emoji: '', name: 'Tech Tribe', members: 'Varun P., Diya K.', institution: 'Tribe Base', score: 0, change: 0, changeType: 'neutral' },
    { rank: 49, emoji: '', name: 'Byte Brigade', members: 'Karan M., Sophia L.', institution: 'Brigade HQ', score: 0, change: 1, changeType: 'positive' },
    { rank: 50, emoji: '', name: 'Final Five', members: 'Arjun D., Eva S.', institution: 'Last Camp', score: 0, change: 1, changeType: 'negative' }
  ];

  get topTeams(): Team[] {
    return this.allTeams.slice(0, 3);
  }

  get filteredTeams(): Team[] {
    return this.allTeams.slice(0, this.filterLimit);
  }

  setFilter(limit: number, filter: string): void {
    this.filterLimit = limit;
    this.activeFilter = filter;
  }
}


