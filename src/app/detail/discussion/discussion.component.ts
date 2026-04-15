import { Component } from '@angular/core';

interface Reply {
  author: string;
  initials: string;
  avatarClass: string;
  role?: string;
  roleClass?: string;
  time: string;
  text: string;
  upvotes: number;
  upvoted?: boolean;
}

interface Thread {
  id: number;
  author: string;
  initials: string;
  avatarClass: string;
  role?: string;
  roleClass?: string;
  time: string;
  text: string;
  tags?: string[];
  upvotes: number;
  upvoted?: boolean;
  category: string;
  showReply?: boolean;
  replyDraft?: string;
  replies?: Reply[];
}

@Component({
  selector: 'app-discussion',
  standalone: false,
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'
})
export class DiscussionComponent {

  newComment = '';
  activeFilter = 'all';
  sortBy = 'recent';

  filters = [
    { key: 'all',       label: 'All',        count: 8  },
    { key: 'question',  label: 'Questions',  count: 5  },
    { key: 'idea',      label: 'Ideas',      count: 2  },
    { key: 'resource',  label: 'Resources',  count: 1  },
  ];

  threads: Thread[] = [
    {
      id: 1,
      author: 'Arjun Mehta',
      initials: 'AM',
      avatarClass: 'avatar-blue',
      time: '2 hours ago',
      text: 'Can we use cloud-based SCADA platforms like Ignition or Aveva for the dashboard layer, or does the solution need to be entirely on-premise given the ₹50k budget constraint?',
      tags: ['#question', '#budget'],
      category: 'question',
      upvotes: 9,
      replies: [
        {
          author: 'Visipak Team',
          initials: 'V',
          avatarClass: 'avatar-org',
          role: 'Organiser',
          roleClass: 'role-org',
          time: '1 hour ago',
          text: 'Great question! Cloud platforms are allowed as long as the recurring cost fits within a reasonable operational budget. Please document any SaaS subscriptions in your cost breakdown section.',
          upvotes: 12,
        }
      ]
    },
    {
      id: 2,
      author: 'Priya Nandakumar',
      initials: 'PN',
      avatarClass: 'avatar-purple',
      time: '5 hours ago',
      text: 'Has anyone considered using CT clamps with ESP32 microcontrollers instead of full smart meters? Could significantly cut hardware costs per line and still give you 15-min interval data for trend analysis.',
      tags: ['#idea', '#hardware'],
      category: 'idea',
      upvotes: 17,
      replies: [
        {
          author: 'Rohan Das',
          initials: 'RD',
          avatarClass: 'avatar-green',
          time: '4 hours ago',
          text: 'Tried this in a textile unit project — accuracy was within ±3% which is plenty for this use case. The Tasmota firmware makes OTA updates painless too.',
          upvotes: 6,
        },
        {
          author: 'Priya Nandakumar',
          initials: 'PN',
          avatarClass: 'avatar-purple',
          time: '3 hours ago',
          text: 'Yes! And pairing it with InfluxDB + Grafana keeps the stack entirely free. Happy to share a reference circuit diagram if helpful.',
          upvotes: 8,
        }
      ]
    },
    {
      id: 3,
      author: 'Karthik Srinivas',
      initials: 'KS',
      avatarClass: 'avatar-orange',
      time: '1 day ago',
      text: 'Quick clarification needed: the submission says "machine-level data capture" — does this mean we need individual metering per corrugation line, or is line-group metering acceptable for the pilot scope?',
      tags: ['#question'],
      category: 'question',
      upvotes: 5,
      replies: [
        {
          author: 'Visipak Team',
          initials: 'V',
          avatarClass: 'avatar-org',
          role: 'Organiser',
          roleClass: 'role-org',
          time: '22 hours ago',
          text: 'Per-line metering is the target state. However, for pilot feasibility we are open to solutions that start with line-group metering and propose a clear path to individual machine granularity.',
          upvotes: 11,
        }
      ]
    },
    {
      id: 4,
      author: 'Sneha Iyer',
      initials: 'SI',
      avatarClass: 'avatar-teal',
      time: '1 day ago',
      text: 'Sharing a useful reference: MSME Energy Audit report from BEE (Bureau of Energy Efficiency) has a section on corrugation plants with typical loss benchmarks. Could be handy for validating baseline assumptions. Link: bee-india.gov.in/publications',
      tags: ['#resource'],
      category: 'resource',
      upvotes: 21,
      replies: []
    },
    {
      id: 5,
      author: 'Dev Pillai',
      initials: 'DP',
      avatarClass: 'avatar-indigo',
      time: '2 days ago',
      text: 'Are teams allowed to propose ML-based anomaly detection for flagging energy spikes? Or is the evaluation focused purely on monitoring and reporting without predictive elements?',
      tags: ['#question', '#ML'],
      category: 'question',
      upvotes: 7,
      replies: [
        {
          author: 'Visipak Team',
          initials: 'V',
          avatarClass: 'avatar-org',
          role: 'Organiser',
          roleClass: 'role-org',
          time: '2 days ago',
          text: 'ML-based anomaly detection is absolutely welcome and will score positively under the Innovation criterion. Just ensure the core monitoring functionality is solid as a foundation.',
          upvotes: 9,
        }
      ]
    },
    {
      id: 6,
      author: 'Meera Choudhary',
      initials: 'MC',
      avatarClass: 'avatar-rose',
      time: '3 days ago',
      text: 'What format should the implementation plan be in — is a Gantt chart sufficient or do you expect a detailed WBS document?',
      tags: ['#question'],
      category: 'question',
      upvotes: 3,
      replies: []
    },
    {
      id: 7,
      author: 'Vishal Anand',
      initials: 'VA',
      avatarClass: 'avatar-blue',
      time: '4 days ago',
      text: 'Idea: What about a WhatsApp-based alerting system for shift supervisors? Eliminates the need for a dedicated terminal on the floor and is immediately usable by non-technical staff.',
      tags: ['#idea'],
      category: 'idea',
      upvotes: 14,
      replies: [
        {
          author: 'Arjun Mehta',
          initials: 'AM',
          avatarClass: 'avatar-blue',
          time: '3 days ago',
          text: 'Twilio or Meta\'s Cloud API makes this straightforward to implement. Could even send a daily energy report at shift end automatically.',
          upvotes: 5,
        }
      ]
    },
  ];

  visibleThreads(): Thread[] {
    let result = this.activeFilter === 'all'
      ? this.threads
      : this.threads.filter(t => t.category === this.activeFilter);

    if (this.sortBy === 'top') {
      result = [...result].sort((a, b) => b.upvotes - a.upvotes);
    } else if (this.sortBy === 'unanswered') {
      result = result.filter(t => !t.replies || t.replies.length === 0);
    }

    return result;
  }

  postComment(): void {
    if (!this.newComment.trim()) return;
    this.threads.unshift({
      id: Date.now(),
      author: 'You',
      initials: 'Y',
      avatarClass: 'avatar-me',
      time: 'Just now',
      text: this.newComment.trim(),
      category: 'all',
      upvotes: 0,
      replies: [],
      showReply: false,
    });
    this.newComment = '';
    this.filters[0].count = (this.filters[0].count || 0) + 1;
  }

  postReply(thread: Thread): void {
    if (!thread.replyDraft?.trim()) return;
    if (!thread.replies) thread.replies = [];
    thread.replies.push({
      author: 'You',
      initials: 'Y',
      avatarClass: 'avatar-me',
      time: 'Just now',
      text: thread.replyDraft.trim(),
      upvotes: 0,
    });
    thread.replyDraft = '';
    thread.showReply = false;
  }

  toggleReply(id: string | number): void {
    // handled inline in template
  }

  toggleReaction(id: string, index: number): void {
    // handled inline in template
  }

  insertTag(tag: string): void {
    this.newComment += (this.newComment ? ' ' : '') + tag + ' ';
  }

  autoGrow(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }
}