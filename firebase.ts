
import { UserProfile, Transaction, LoanRequest, UserRole, SubscriptionTier } from './types';

// This file mocks Firebase Auth and Firestore for a stable demo environment.
// In a real production app, you would initialize real Firebase here.

const STORAGE_KEYS = {
  USERS: 'abragim_users',
  TRANSACTIONS: 'abragim_transactions',
  CURRENT_USER: 'abragim_auth_state'
};

const getInitialUsers = (): UserProfile[] => [
  {
    uid: 'admin-123',
    email: 'admin@abragim.com',
    name: 'Chief Admin',
    role: 'ADMIN',
    mainBalance: 0,
    hsaBalance: 0,
    totalSteps: 0,
    subscriptionTier: 'PREMIUM',
    loanStatus: 'NONE',
    loanAmount: 0
  },
  {
    uid: 'user-456',
    email: 'demo@abragim.com',
    name: 'Jane Doe',
    role: 'USER',
    mainBalance: 5000,
    hsaBalance: 250,
    totalSteps: 12500,
    subscriptionTier: 'BASIC',
    loanStatus: 'NONE',
    loanAmount: 0
  }
];

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(getInitialUsers()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
};

export const db = {
  getUsers: (): UserProfile[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  updateUser: (uid: string, data: Partial<UserProfile>) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return users[index];
    }
    return null;
  },

  addUser: (user: UserProfile) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getTransactions: (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]'),
  
  addTransaction: (tx: Transaction) => {
    const txs = db.getTransactions();
    txs.unshift(tx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  }
};

export const auth = {
  getCurrentUser: (): UserProfile | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },
  
  login: (email: string): UserProfile | null => {
    const user = db.getUsers().find(u => u.email === email);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};
