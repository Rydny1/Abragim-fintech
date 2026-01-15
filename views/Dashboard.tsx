
import React, { useState } from 'react';
import { Wallet, PiggyBank, Footprints, ArrowUpRight, Plus, Activity, Briefcase, Info, History, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, Transaction } from '../types';
import Navbar from '../components/Navbar';
import { db } from '../firebase';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Line, ComposedChart } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onRefreshUser: () => void;
  onNavigate: (view: any) => void;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onRefreshUser, onNavigate, onNotify }) => {
  const [syncing, setSyncing] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState(1000);
  const [loanReason, setLoanReason] = useState('Home Gym Equipment');
  const [loanTab, setLoanTab] = useState<'STATUS' | 'HISTORY'>('STATUS');

  const handleSyncSteps = () => {
    setSyncing(true);
    setTimeout(() => {
      const stepIncrement = 1000;
      const rewardRate = user.subscriptionTier === 'PREMIUM' ? 1.50 : 1.00;
      const reward = rewardRate * (stepIncrement / 1000);

      if (user.mainBalance < reward) {
        onNotify("Insufficient Balance: Load capital to proceed with transfer.", 'error');
        setSyncing(false);
        return;
      }

      const updatedUser = {
        ...user,
        totalSteps: user.totalSteps + stepIncrement,
        mainBalance: user.mainBalance - reward,
        hsaBalance: user.hsaBalance + reward
      };

      db.updateUser(user.uid, updatedUser);
      db.addTransaction({
        id: `tx-${Date.now()}`,
        userId: user.uid,
        userName: user.name,
        type: 'SAVINGS_TRANSFER',
        amount: reward,
        timestamp: Date.now(),
        description: `Fit-Savings: Synced ${stepIncrement} steps.`
      });

      onRefreshUser();
      setSyncing(false);
      onNotify(`Success! €${reward.toFixed(2)} moved to Fit-Savings.`, 'success');
    }, 1500);
  };

  const handleLoanRequest = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUser(user.uid, { loanStatus: 'PENDING', loanAmount });
    db.addTransaction({
      id: `tx-${Date.now()}`,
      userId: user.uid,
      userName: user.name,
      type: 'LOAN_REQUEST',
      amount: loanAmount,
      timestamp: Date.now(),
      description: `Loan Request for: ${loanReason}`
    });
    setShowLoanModal(false);
    onRefreshUser();
    onNotify("Loan request submitted for review.", 'success');
  };

  const handleAcknowledgeLoan = () => {
    db.updateUser(user.uid, { loanStatus: 'NONE', loanAmount: 0 });
    onRefreshUser();
    onNotify("Credit state reset. New applications available.", 'success');
  };

  const transactions = db.getTransactions().filter(tx => tx.userId === user.uid);
  const recentTransactions = transactions.slice(0, 5);
  const loanHistory = transactions.filter(tx => tx.type === 'LOAN_APPROVAL' || tx.type === 'LOAN_REJECTION');

  const chartData = [
    { day: 'Mon', steps: 8400, savings: 8.4 },
    { day: 'Tue', steps: 9200, savings: 9.2 },
    { day: 'Wed', steps: 7100, savings: 7.1 },
    { day: 'Thu', steps: 11000, savings: 11.0 },
    { day: 'Fri', steps: 12500, savings: 12.5 },
    { day: 'Sat', steps: 5600, savings: 5.6 },
    { day: 'Sun', steps: user.totalSteps % 15000, savings: (user.totalSteps % 15000) / 1000 },
  ];

  return (
    <div className="bg-[#0f121d] min-h-screen text-slate-50 pb-16">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-6xl font-outfit font-black tracking-tighter uppercase leading-none mb-3">Power Up, {user.name.split(' ')[0]}</h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em]">Health Metrics & Financial Performance</p>
          </div>
          <button 
            onClick={handleSyncSteps}
            disabled={syncing}
            className={`flex items-center gap-4 px-10 py-5 rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-sm ${syncing ? 'bg-zinc-900 text-zinc-600 border border-zinc-800' : 'bg-[#a855f7] hover:bg-purple-600 text-white neon-border'}`}
          >
            {syncing ? <Activity className="w-5 h-5 animate-spin" /> : <Footprints className="w-5 h-5" />}
            {syncing ? 'Syncing...' : 'Sync Activity'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <StatCard 
            title="Available Capital" 
            value={`€${user.mainBalance.toLocaleString()}`} 
            icon={<Wallet className="w-6 h-6 text-white" />} 
            trend="+2.4%"
            subValue="Main Balance"
          />
          <StatCard 
            title="Activity Rewards" 
            value={`€${user.hsaBalance.toLocaleString()}`} 
            icon={<PiggyBank className="w-6 h-6 text-black" />} 
            trend="+12.5%"
            subValue="High-Yield Fit-Savings"
            highlight={true}
          />
          <StatCard 
            title="Kinetic History" 
            value={user.totalSteps.toLocaleString()} 
            icon={<Footprints className="w-6 h-6 text-white" />} 
            trend="+842"
            subValue="Lifetime Steps Recorded"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <div className="bg-[#1a1f2e] border border-zinc-800/50 p-10 rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                  <Activity className="w-7 h-7 text-[#a855f7] neon-text-shadow" />
                  Performance Index
                </h2>
                <div className="flex gap-6">
                  <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <div className="w-3.5 h-3.5 rounded bg-[#a855f7]"></div> Steps
                  </span>
                  <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <div className="w-3.5 h-3.5 rounded bg-white"></div> Savings
                  </span>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" vertical={false} />
                    <XAxis dataKey="day" stroke="#52525b" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} dy={15} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f121d', border: '1px solid #2a3142', borderRadius: '16px', color: '#fff' }}
                      itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                      cursor={{ stroke: '#2a3142', strokeWidth: 2 }}
                    />
                    <Area type="monotone" dataKey="steps" fill="url(#purpleGradient)" stroke="#a855f7" strokeWidth={5} dot={false} activeDot={{ r: 7, fill: '#a855f7', stroke: '#000', strokeWidth: 3 }} />
                    <Line type="monotone" dataKey="savings" stroke="#fff" strokeWidth={4} dot={{ r: 5, fill: '#fff', stroke: '#000', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#fff' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#1a1f2e] border border-zinc-800/50 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                 <Briefcase className="w-40 h-40 text-white" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
                   <h2 className="text-4xl font-black uppercase tracking-tighter text-[#a855f7]">Equipment Hub</h2>
                   <div className="flex bg-[#0f121d] p-1 rounded-xl">
                      <button 
                        onClick={() => setLoanTab('STATUS')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loanTab === 'STATUS' ? 'bg-white text-black' : 'text-zinc-500'}`}
                      >
                        <Clock className="w-3.5 h-3.5 inline mr-2" />
                        Status
                      </button>
                      <button 
                        onClick={() => setLoanTab('HISTORY')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loanTab === 'HISTORY' ? 'bg-white text-black' : 'text-zinc-500'}`}
                      >
                        <History className="w-3.5 h-3.5 inline mr-2" />
                        History
                      </button>
                   </div>
                 </div>

                 {loanTab === 'STATUS' ? (
                   <div>
                     {user.loanStatus === 'NONE' ? (
                       <div className="animate-in fade-in duration-500">
                         <p className="text-zinc-400 font-bold mb-10 text-base max-w-lg leading-relaxed uppercase tracking-wide">
                           Finance pro-level hardware using your kinetic activity as collateral.
                         </p>
                         <button 
                            onClick={() => setShowLoanModal(true)}
                            className="flex items-center gap-4 px-12 py-5 bg-white text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-xs shadow-xl"
                         >
                           <Plus className="w-5 h-5" />
                           Apply Now
                         </button>
                       </div>
                     ) : (
                       <div className="animate-in slide-in-from-bottom-4 duration-500">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 rounded-[32px] bg-[#0f121d] border border-white/5 mb-8">
                           <div className="flex items-center gap-6 mb-6 sm:mb-0">
                             <div className={`p-5 rounded-2xl ${
                               user.loanStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-500' : 
                               user.loanStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-500' : 
                               'bg-red-500/20 text-red-400'
                             }`}>
                               {user.loanStatus === 'PENDING' ? <Clock className="w-10 h-10" /> : 
                                user.loanStatus === 'APPROVED' ? <CheckCircle2 className="w-10 h-10" /> : 
                                <AlertCircle className="w-10 h-10" />}
                             </div>
                             <div>
                               <p className="font-black text-3xl uppercase tracking-tighter">€{user.loanAmount}</p>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                 {user.loanStatus === 'PENDING' ? 'Application Under Review' : 
                                  user.loanStatus === 'APPROVED' ? 'Credit Line Approved' : 'Request Refused'}
                               </p>
                             </div>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                             <span className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest ${
                               user.loanStatus === 'PENDING' ? 'bg-amber-500 text-black' : 
                               user.loanStatus === 'APPROVED' ? 'bg-emerald-500 text-black' : 
                               'bg-red-500 text-white'
                             }`}>
                                {user.loanStatus}
                             </span>
                           </div>
                         </div>
                         
                         {user.loanStatus !== 'PENDING' && (
                           <div className="flex items-center gap-6">
                              <button 
                                onClick={handleAcknowledgeLoan}
                                className="px-10 py-5 bg-[#a855f7] hover:bg-purple-600 text-white rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs"
                              >
                                {user.loanStatus === 'APPROVED' ? 'Acknowledge & Access' : 'Re-apply for Loan'}
                              </button>
                              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-[200px]">
                                This will clear your current status and permit new credit requests.
                              </p>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="space-y-4 animate-in fade-in duration-500">
                     {loanHistory.length > 0 ? loanHistory.map((tx) => (
                       <div key={tx.id} className="flex items-center justify-between p-6 rounded-2xl bg-[#0f121d] border border-zinc-800/50 group hover:border-purple-500/50 transition-all">
                         <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'LOAN_APPROVAL' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                               <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-sm font-black uppercase tracking-widest">{tx.description}</p>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{new Date(tx.timestamp).toLocaleDateString()} @ {new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                         </div>
                         <p className="font-black text-2xl text-white tracking-tighter">€{tx.amount}</p>
                       </div>
                     )) : (
                       <div className="py-20 text-center">
                          <History className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">No historical credit events</p>
                       </div>
                     )}
                   </div>
                 )}
               </div>
            </div>
          </div>

          <div className="space-y-16">
            <div className="bg-[#1a1f2e] border border-zinc-800/50 p-10 rounded-[40px] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-2">Membership</h3>
                  <p className="text-4xl font-black text-white uppercase tracking-tighter">{user.subscriptionTier}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.subscriptionTier === 'PREMIUM' ? 'bg-white text-black border-white' : 'bg-[#0f121d] text-zinc-500 border-zinc-800'}`}>
                  Active
                </div>
              </div>
              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
                  <span className="text-zinc-500">Yield Rate:</span>
                  <span className="text-white">€{user.subscriptionTier === 'PREMIUM' ? '1.50' : '1.00'} / 1k</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
                  <span className="text-zinc-500">Loan APR:</span>
                  <span className="text-white">{user.subscriptionTier === 'PREMIUM' ? '0.0%' : '3.5%'}</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('SUBSCRIPTION')}
                className="w-full py-5 rounded-2xl bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-white/5"
              >
                Manage Plan
              </button>
            </div>

            <div className="bg-[#1a1f2e]/40 border border-zinc-800/50 p-10 rounded-[40px]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black uppercase tracking-tighter">Activity Log</h2>
                <button className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">History</button>
              </div>
              <div className="space-y-10">
                {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-[20px] bg-[#0f121d] border border-zinc-800/50 flex items-center justify-center group-hover:border-purple-500/50 transition-colors shadow-sm">
                        <ArrowUpRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">{tx.description.length > 20 ? tx.description.substring(0,20) + '...' : tx.description}</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#a855f7]">+€{tx.amount.toFixed(2)}</span>
                  </div>
                )) : (
                  <p className="text-zinc-600 text-xs font-bold uppercase text-center py-6">No activity recorded.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-black p-2 rounded-lg">
                  <Info className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-[11px] font-black text-black uppercase tracking-[0.2em]">AI Advisor</h3>
              </div>
              <p className="text-black text-base font-bold leading-tight">
                "Based on your trajectory, you're automating <strong className="underline decoration-purple-500 decoration-2">€{((user.totalSteps / 1000) * (user.subscriptionTier === 'PREMIUM' ? 1.5 : 1)).toFixed(2)}</strong>. Pro tip: High consistency reduces future risk profiles."
              </p>
            </div>
          </div>
        </div>
      </main>

      {showLoanModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0f121d] border-2 border-zinc-800/50 w-full max-w-md rounded-[50px] p-12 shadow-2xl scale-in-center">
            <h2 className="text-5xl font-black text-white mb-3 uppercase tracking-tighter">Finance Hub</h2>
            <p className="text-zinc-500 font-bold mb-12 text-xs uppercase tracking-[0.4em]">Growth Capital Application</p>
            
            <form onSubmit={handleLoanRequest} className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Capital Required (€)</label>
                <input 
                  type="number" 
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full bg-[#1a1f2e] border-2 border-zinc-800 rounded-2xl py-5 px-8 text-2xl font-black text-white focus:outline-none focus:border-purple-500 transition-colors"
                  min="50"
                  max="5000"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Investment Purpose</label>
                <select 
                  value={loanReason}
                  onChange={(e) => setLoanReason(e.target.value)}
                  className="w-full bg-[#1a1f2e] border-2 border-zinc-800 rounded-2xl py-5 px-8 text-sm font-black text-white focus:outline-none focus:border-purple-500 transition-colors uppercase tracking-[0.2em]"
                >
                  <option>Home Gym Equipment</option>
                  <option>Professional Bike</option>
                  <option>Personal Trainer Package</option>
                  <option>Recovery & Physio</option>
                  <option>Nutrition Coaching</option>
                </select>
              </div>

              <div className="bg-white p-8 rounded-[32px] text-black">
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3 opacity-60">
                   <span>Interest:</span>
                   <span>{user.subscriptionTier === 'PREMIUM' ? '0.0% APR' : '3.5% APR'}</span>
                 </div>
                 <div className="flex justify-between text-2xl font-black uppercase tracking-tighter">
                   <span>Est. Monthly:</span>
                   <span className="text-purple-600">€{(loanAmount / 12).toFixed(2)}</span>
                 </div>
              </div>

              <div className="flex gap-6">
                <button 
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="flex-1 py-5 bg-[#1a1f2e] hover:bg-zinc-800 text-zinc-400 font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                  Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, subValue, highlight = false }: any) => (
  <div className={`p-10 rounded-[40px] transition-all hover:scale-[1.02] border-2 ${highlight ? 'bg-white border-white shadow-2xl shadow-white/5' : 'bg-[#1a1f2e] border-zinc-800/50 shadow-sm'}`}>
    <div className="flex items-center justify-between mb-10">
      <div className={`p-4 rounded-2xl ${highlight ? 'bg-black' : 'bg-[#0f121d]'}`}>{icon}</div>
      <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${highlight ? 'bg-purple-600 text-white' : 'bg-white text-black'}`}>{trend}</span>
    </div>
    <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 ${highlight ? 'text-zinc-500' : 'text-zinc-500'}`}>{title}</h3>
    <p className={`text-5xl font-outfit font-black tracking-tighter ${highlight ? 'text-black' : 'text-white'}`}>{value}</p>
    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-5 ${highlight ? 'text-zinc-400' : 'text-zinc-600'}`}>{subValue}</p>
  </div>
);

export default Dashboard;
