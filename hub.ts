export interface MemberProfile {
  uid: string;
  full_name: string;
  email: string;
  ref_code: string;
  balance: number;
  points: number;
  is_paid: boolean;
  is_admin: boolean;
  streakDays: number;
  lastCheckInDate?: string;
  level: 'Novice' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  totalTransferred: number;
  totalReceived: number;
  createdAt: string;
}

export interface FundTransfer {
  id: string;
  senderUid: string;
  senderName: string;
  recipientUid: string;
  recipientName: string;
  recipientRefCode: string;
  amount: number;
  note: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'pending';
}

export interface EarnTask {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'daily' | 'social' | 'quiz' | 'milestone';
  iconName: string;
  actionLabel: string;
  completed: boolean;
  url?: string;
  quizQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface ActivityItem {
  id: string;
  type: 'transfer_sent' | 'transfer_received' | 'task_points' | 'withdrawal' | 'deposit';
  title: string;
  subtitle: string;
  amount?: number;
  points?: number;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

export interface EconomyConfig {
  nairaPerPoint: number;       // e.g., 5 means 1 Point = ₦5
  minPointPurchase: number;    // e.g., 100 points
  minPointRedeem: number;      // e.g., 200 points
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface PointTransfer {
  id: string;
  senderUid: string;
  senderName: string;
  recipientUid: string;
  recipientName: string;
  recipientRefCode: string;
  points: number;
  note: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'pending';
}

export interface PointTransaction {
  id: string;
  userUid: string;
  userName: string;
  type: 'earned_task' | 'bought_with_cash' | 'redeemed_to_cash' | 'admin_issue' | 'admin_burn' | 'admin_mass_distribution' | 'p2p_points_sent' | 'p2p_points_received';
  points: number;
  nairaAmount?: number;
  reason: string;
  performedByAdmin?: string;
  recipientCount?: number;
  timestamp: string;
}
