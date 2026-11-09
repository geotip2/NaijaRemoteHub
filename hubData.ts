import { MemberProfile, FundTransfer, EarnTask, ActivityItem, EconomyConfig, PointTransaction } from '@/types/hub';

export const INITIAL_MEMBERS: MemberProfile[] = [
  {
    uid: 'user_current',
    full_name: 'Taiwo Fasuyi',
    email: 'taiwofasuyi1@gmail.com',
    ref_code: 'taiwo2026',
    balance: 45000,
    points: 850,
    is_paid: true,
    is_admin: false,
    streakDays: 4,
    lastCheckInDate: '',
    level: 'Silver',
    totalTransferred: 15000,
    totalReceived: 20000,
    createdAt: '2026-01-15'
  },
  {
    uid: 'user_chioma',
    full_name: 'Chioma Okafor',
    email: 'chioma.okafor@example.com',
    ref_code: 'chioma23',
    balance: 62000,
    points: 1200,
    is_paid: true,
    is_admin: false,
    streakDays: 8,
    level: 'Gold',
    totalTransferred: 5000,
    totalReceived: 35000,
    createdAt: '2026-02-01'
  },
  {
    uid: 'user_tunde',
    full_name: 'Tunde Adeleke',
    email: 'tunde.adeleke@example.com',
    ref_code: 'tunde88',
    balance: 18500,
    points: 420,
    is_paid: false,
    is_admin: false,
    streakDays: 2,
    level: 'Bronze',
    totalTransferred: 2000,
    totalReceived: 10000,
    createdAt: '2026-02-14'
  },
  {
    uid: 'user_blessing',
    full_name: 'Blessing Emmanuel',
    email: 'blessing.e@example.com',
    ref_code: 'blessing7',
    balance: 89000,
    points: 2400,
    is_paid: true,
    is_admin: true,
    streakDays: 14,
    level: 'Diamond',
    totalTransferred: 40000,
    totalReceived: 50000,
    createdAt: '2025-11-20'
  }
];

export const INITIAL_TASKS: EarnTask[] = [
  {
    id: 'task-daily-streak',
    title: 'Daily Attendance & Check-in',
    description: 'Claim your daily login reward. Maintain consecutive days for milestone multipliers!',
    points: 50,
    category: 'daily',
    iconName: 'CalendarCheck',
    actionLabel: 'Claim +50 Pts',
    completed: false
  },
  {
    id: 'task-whatsapp-share',
    title: 'Share Referral on WhatsApp Group',
    description: 'Spread the word about NaijaRemoteHub to your remote work circle or community.',
    points: 100,
    category: 'social',
    iconName: 'Share2',
    actionLabel: 'Share & Earn',
    completed: false,
    url: 'https://wa.me/?text=Join%20me%20on%20NaijaRemoteHub'
  },
  {
    id: 'task-telegram-join',
    title: 'Join NaijaRemoteHub Community Channel',
    description: 'Connect with 12,000+ Nigerian freelancers, get daily job leads and course alerts.',
    points: 150,
    category: 'social',
    iconName: 'MessageSquare',
    actionLabel: 'Join Channel',
    completed: false,
    url: 'https://t.me/naijaremotehub'
  },
  {
    id: 'task-quiz-upwork',
    title: 'Freelancing & Upwork Readiness Quiz',
    description: 'Test your knowledge on proposal writing, job bids, and client vetting. Pass 3 questions!',
    points: 250,
    category: 'quiz',
    iconName: 'HelpCircle',
    actionLabel: 'Start 3-Min Quiz',
    completed: false,
    quizQuestions: [
      {
        question: 'What is the most effective approach for an Upwork proposal introduction?',
        options: [
          'Say "Dear Hiring Manager, I am writing to apply..." with your full resume pasted',
          'Acknowledge the client\'s specific problem within the first 2 sentences and propose your solution',
          'State that you are the cheapest bidder and can start in 5 minutes',
          'Copy and paste a generic ChatGPT template with no job details'
        ],
        correctIndex: 1
      },
      {
        question: 'How should you securely receive payments from international clients?',
        options: [
          'Direct crypto transfers to unverified Telegram escrow accounts',
          'Official platform escrow (Upwork / Fiverr) or licensed fintech (Payoneer / Geegpay / Grey)',
          'Ask the client to send a paper check via standard post',
          'Wire transfer with no invoice or contract'
        ],
        correctIndex: 1
      },
      {
        question: 'Why should you avoid communicating with Upwork clients outside the platform before a contract is started?',
        options: [
          'It violates Terms of Service and risks permanent account suspension with no dispute protection',
          'It costs extra internet data',
          'Clients usually get scared of WhatsApp',
          'There is no rule against it'
        ],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'task-quiz-va',
    title: 'Virtual Assistant Productivity Quiz',
    description: 'Show your proficiency in calendar scheduling, email triage, and client discretion.',
    points: 200,
    category: 'quiz',
    iconName: 'Award',
    actionLabel: 'Take VA Quiz',
    completed: false,
    quizQuestions: [
      {
        question: 'When a US-based client asks to schedule a meeting at 2:00 PM EST, what time is that in West Africa Time (WAT / Nigeria)?',
        options: [
          '11:00 AM WAT',
          '8:00 PM WAT (6 hours ahead)',
          '2:00 PM WAT',
          '6:00 AM WAT'
        ],
        correctIndex: 1
      },
      {
        question: 'Which tool is most commonly used for asynchronous team updates and screen recordings?',
        options: [
          'Loom',
          'MS Paint',
          'Notepad',
          'TikTok'
        ],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'task-peer-transfer',
    title: 'Make Your First Peer Transfer',
    description: 'Transfer at least ₦500 to a friend or fellow hub member using their referral code.',
    points: 150,
    category: 'milestone',
    iconName: 'Send',
    actionLabel: 'Transfer Funds',
    completed: false
  }
];

export const INITIAL_TRANSFERS: FundTransfer[] = [
  {
    id: 'TXN-849201',
    senderUid: 'user_chioma',
    senderName: 'Chioma Okafor',
    recipientUid: 'user_current',
    recipientName: 'Taiwo Fasuyi',
    recipientRefCode: 'taiwo2026',
    amount: 15000,
    note: 'Contribution for Canva design masterclass',
    timestamp: '2026-03-08 14:22',
    status: 'completed'
  },
  {
    id: 'TXN-739104',
    senderUid: 'user_current',
    senderName: 'Taiwo Fasuyi',
    recipientUid: 'user_tunde',
    recipientName: 'Tunde Adeleke',
    recipientRefCode: 'tunde88',
    amount: 5000,
    note: 'Laptop power bank subsidy support',
    timestamp: '2026-03-07 10:15',
    status: 'completed'
  }
];

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount);
}

export const DEFAULT_ECONOMY_CONFIG: EconomyConfig = {
  nairaPerPoint: 5,        // 1 Point = ₦5
  minPointPurchase: 100,   // Min 100 Points to buy (₦500)
  minPointRedeem: 200,     // Min 200 Points to cash out (₦1,000)
  lastUpdatedBy: 'Administrator',
  lastUpdatedAt: '2026-03-09 10:00'
};

export const INITIAL_POINT_TRANSACTIONS: PointTransaction[] = [
  {
    id: 'PTX-9012',
    userUid: 'user_current',
    userName: 'Taiwo Fasuyi',
    type: 'earned_task',
    points: 250,
    reason: 'Completed Freelancing & Upwork Readiness Quiz',
    timestamp: '2026-03-08 16:30'
  },
  {
    id: 'PTX-8419',
    userUid: 'user_chioma',
    userName: 'Chioma Okafor',
    type: 'bought_with_cash',
    points: 500,
    nairaAmount: 2500,
    reason: 'Bought points for VIP Freelance Masterclass access',
    timestamp: '2026-03-08 12:15'
  },
  {
    id: 'PTX-7721',
    userUid: 'user_tunde',
    userName: 'Tunde Adeleke',
    type: 'admin_issue',
    points: 200,
    reason: 'Community Moderator Monthly Honorarium',
    performedByAdmin: 'Blessing Emmanuel (Super Admin)',
    timestamp: '2026-03-07 09:45'
  }
];
