
import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Activity, Check, X, Database, Briefcase } from 'lucide-react';
import { UserProfile, Transaction, SubscriptionTier } from '../types';
import { db } from '../firebase';
import Navbar from '../components/Navbar';

interface AdminPanelProps {
  user: UserProfile;
  onLogout: () => void;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout, onNotify }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'USERS' | 'LOANS' | 'LOGS'>('USERS');

  useEffect(() => {
    setUsers(db.getUsers());
    setTransactions(db.getTransactions());
  }, []);

  const handleUpdateTier = (uid: string, tier: SubscriptionTier) => {
    db.updateUser(uid, { subscriptionTier: tier });
    db.addTransaction({
      id: `tx-${Date.now()}`,
      userId: uid,
      userName: users.find(u => u.uid === uid)?.name || 'Unknown',
      type: 'TIER_CHANGE',
      amount: 0,
      timestamp: Date.now(),
      description: `Admin updated tier to ${tier}`
    });
    setUsers(db.getUsers());
    onNotify(`Membership Tier updated for ${uid}.`, 'success');
  };

  const handleLoanDecision = (uid: string, decision: 'APPROVED' | 'REJECTED') => {
    const userToUpdate = users.find(u => u.uid === uid);
    if (!userToUpdate) return;

    db.updateUser(uid, { loanStatus: decision });
    db.addTransaction({
      id: `tx-${Date.now()}`,
      userId: uid,
      userName: userToUpdate.name,
      type: decision === 'APPROVED' ? 'LOAN_APPROVAL' : 'LOAN_REJECTION',
      amount: userToUpdate.loanAmount,
      timestamp: Date.now(),
      description: `Loan ${decision} by Admin`
    });
    setUsers(db.getUsers());
    onNotify(decision === 'APPROVED' ? `Loan approved for ${userToUpdate.name}` : `Loan rejected for ${userToUpdate.name}`, decision === 'APPROVED' ? 'success' : 'error');
  };

  const pendingLoans = users.filter(u => u.loanStatus === 'PENDING');

  return (
    <div className="bg-[#0f121d] min-h-screen text-slate-100 pb-16">
      <Navbar user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
          <div>
            <h1 className="text-5xl font-outfit font-black uppercase tracking-tighter">Back-Office</h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.5em] mt-3">Risk Control Terminal</p>
          </div>
          
          <div className="flex p-2 bg-[#1a1f2e] border border-zinc-800 rounded-2xl">
            <TabButton active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} icon={<Users className="w-4 h-4" />} label="Members" />
            <TabButton active={activeTab === 'LOANS'} onClick={() => setActiveTab('LOANS')} icon={<CreditCard className="w-4 h-4" />} label="Lending" count={pendingLoans.length} />
            <TabButton active={activeTab === 'LOGS'} onClick={() => setActiveTab('LOGS')} icon={<Database className="w-4 h-4" />} label="Logs" />
          </div>
        </div>

        <div className="bg-[#1a1f2e] border-2 border-zinc-800/50 rounded-[50px] overflow-hidden shadow-sm">
          {activeTab === 'USERS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f121d] border-b border-zinc-800">
                  <tr>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Identity</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Tier</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Capital</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Steps</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-[#0f121d]/50 transition-colors">
                      <td className="px-10 py-8">
                        <div className="font-black text-white uppercase tracking-tight">{u.name}</div>
                        <div className="text-[10px] text-zinc-500 font-bold">{u.email}</div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${u.subscriptionTier === 'PREMIUM' ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                          {u.subscriptionTier}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-black text-sm text-white">
                        €{u.mainBalance.toFixed(2)}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 text-[#a855f7] neon-text-shadow" />
                          <span className="text-sm font-black text-white">{u.totalSteps.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <select 
                          value={u.subscriptionTier}
                          onChange={(e) => handleUpdateTier(u.uid, e.target.value as SubscriptionTier)}
                          className="bg-[#0f121d] border-2 border-zinc-800/50 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="BASIC">Set Basic</option>
                          <option value="PREMIUM">Set Premium</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'LOANS' && (
            <div className="p-12 bg-[#0f121d]/20">
              {pendingLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {pendingLoans.map(u => (
                    <div key={u.uid} className="bg-[#1a1f2e] border-2 border-zinc-800/50 p-10 rounded-[40px] relative overflow-hidden group shadow-sm">
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{u.name}</h3>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Activity Score: {((u.totalSteps / 10000) * 10).toFixed(1)}/100</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-black text-white tracking-tighter">€{u.loanAmount}</p>
                          <p className="text-[10px] uppercase font-black text-[#a855f7] bg-black border border-purple-500/30 px-3 py-1 rounded inline-block">Credit Request</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6">
                        <button 
                          onClick={() => handleLoanDecision(u.uid, 'APPROVED')}
                          className="flex-1 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl uppercase tracking-widest text-[11px]"
                        >
                          <Check className="w-5 h-5" /> Approve
                        </button>
                        <button 
                          onClick={() => handleLoanDecision(u.uid, 'REJECTED')}
                          className="flex-1 py-5 bg-zinc-900 border-2 border-zinc-800 hover:border-red-500 hover:text-red-500 text-zinc-500 font-black rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-[11px]"
                        >
                          <X className="w-5 h-5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32">
                  <div className="bg-[#1a1f2e] border-2 border-zinc-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Check className="w-12 h-12 text-zinc-700" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Clearance Complete</h3>
                  <p className="text-zinc-600 font-bold uppercase text-[11px] tracking-widest mt-3">All credit lines processed</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'LOGS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f121d] border-b border-zinc-800">
                  <tr>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Subject</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Class</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Event</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Value</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {db.getTransactions().map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0f121d]/50">
                      <td className="px-10 py-8 text-xs font-black text-white uppercase">{tx.userName}</td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${tx.type.includes('LOAN') ? 'bg-white text-black' : 'bg-[#0f121d] text-zinc-500'}`}>
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-[11px] font-bold text-zinc-500 uppercase tracking-tight">{tx.description}</td>
                      <td className="px-10 py-8 text-sm font-black text-[#a855f7]">€{tx.amount.toFixed(2)}</td>
                      <td className="px-10 py-8 text-[10px] font-bold text-zinc-600 uppercase">{new Date(tx.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-10 py-4.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${active ? 'bg-white text-black shadow-2xl scale-105' : 'text-zinc-500 hover:text-white'}`}
  >
    {icon}
    {label}
    {count !== undefined && count > 0 && (
      <span className="bg-purple-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black">{count}</span>
    )}
  </button>
);

export default AdminPanel;
