
import React from 'react';
import { ArrowLeft, CheckCircle2, Shield, Crown, Activity } from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../types';
import { db } from '../firebase';

interface SubscriptionPageProps {
  user: UserProfile;
  onBack: () => void;
  onRefreshUser: () => void;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user, onBack, onRefreshUser, onNotify }) => {
  const handleSwitchPlan = (tier: SubscriptionTier) => {
    if (user.subscriptionTier === tier) return;
    
    const isDowngrade = user.subscriptionTier === 'PREMIUM' && tier === 'BASIC';
    
    db.updateUser(user.uid, { subscriptionTier: tier });
    db.addTransaction({
      id: `tx-${Date.now()}`,
      userId: user.uid,
      userName: user.name,
      type: 'TIER_CHANGE',
      amount: tier === 'PREMIUM' ? 9.99 : 0,
      timestamp: Date.now(),
      description: `${isDowngrade ? 'Downgraded' : 'Upgraded'} subscription to ${tier}`
    });
    
    onRefreshUser();
    
    if (isDowngrade) {
      onNotify("Account Downgraded: Plan reverted to BASIC.", 'success');
    } else {
      onNotify("Account Upgraded: Plan switched to PREMIUM!", 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f121d] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-16"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Portfolio
        </button>

        <div className="text-center mb-20">
          <h1 className="text-7xl font-outfit font-black tracking-tighter uppercase leading-none mb-6">Subscription <br/><span className="text-purple-600">Velocity</span></h1>
          <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.4em]">Control the momentum of your health capital</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div 
            className={`p-12 rounded-[50px] border-4 transition-all relative ${user.subscriptionTier === 'BASIC' ? 'border-white bg-[#1a1f2e]' : 'border-zinc-800 bg-[#1a1f2e]/50 hover:border-zinc-600'}`}
          >
            {user.subscriptionTier === 'BASIC' && (
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-black uppercase px-6 py-2.5 rounded-bl-3xl tracking-widest">
                Active
              </div>
            )}
            <div className="mb-10 p-5 bg-[#0f121d] rounded-2xl inline-block">
              <Shield className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Basic</h3>
            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-6xl font-black">€0</span>
              <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest ml-2">/mo</span>
            </div>
            
            <ul className="space-y-6 mb-12">
              <BenefitItem active={true} text="€1.00 per 1k steps" />
              <BenefitItem active={true} text="Standard HSA Savings" />
              <BenefitItem active={false} text="0% Equipment Loans" />
              <BenefitItem active={false} text="Advanced Performance AI" />
            </ul>

            <button 
              disabled={user.subscriptionTier === 'BASIC'}
              onClick={() => handleSwitchPlan('BASIC')}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${user.subscriptionTier === 'BASIC' ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 shadow-xl'}`}
            >
              {user.subscriptionTier === 'BASIC' ? 'Current Membership' : 'Downgrade to Basic'}
            </button>
          </div>

          {/* Premium Plan */}
          <div 
            className={`p-12 rounded-[50px] border-4 transition-all relative ${user.subscriptionTier === 'PREMIUM' ? 'border-[#a855f7] bg-white text-black' : 'border-purple-600/30 bg-[#1a1f2e] hover:border-purple-600/60'}`}
          >
            {user.subscriptionTier === 'PREMIUM' && (
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-black uppercase px-6 py-2.5 rounded-bl-3xl tracking-widest">
                Active
              </div>
            )}
            <div className={`mb-10 p-5 rounded-2xl inline-block ${user.subscriptionTier === 'PREMIUM' ? 'bg-black' : 'bg-purple-600/10'}`}>
              <Crown className={`w-8 h-8 ${user.subscriptionTier === 'PREMIUM' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h3 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${user.subscriptionTier === 'PREMIUM' ? 'text-black' : 'text-white'}`}>Premium</h3>
            <div className="flex items-baseline gap-1 mb-10">
              <span className={`text-6xl font-black ${user.subscriptionTier === 'PREMIUM' ? 'text-black' : 'text-white'}`}>€9.99</span>
              <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest ml-2">/mo</span>
            </div>

            <ul className="space-y-6 mb-12">
              <BenefitItem active={true} dark={user.subscriptionTier === 'PREMIUM'} text="€1.50 per 1k steps" />
              <BenefitItem active={true} dark={user.subscriptionTier === 'PREMIUM'} text="High-Yield Fit-Savings" />
              <BenefitItem active={true} dark={user.subscriptionTier === 'PREMIUM'} text="0% Equipment Loans" />
              <BenefitItem active={true} dark={user.subscriptionTier === 'PREMIUM'} text="Performance Analytics AI" />
            </ul>

            <button 
              disabled={user.subscriptionTier === 'PREMIUM'}
              onClick={() => handleSwitchPlan('PREMIUM')}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${user.subscriptionTier === 'PREMIUM' ? 'bg-black text-purple-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-2xl shadow-purple-600/20'}`}
            >
              {user.subscriptionTier === 'PREMIUM' ? 'Membership Active' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>

        <div className="mt-20 p-12 rounded-[40px] bg-[#1a1f2e]/50 border border-zinc-800 text-center glass-card">
            <Activity className="w-12 h-12 text-purple-600 mx-auto mb-6" />
            <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Enterprise Grade Intelligence</h4>
            <p className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed uppercase tracking-wider font-semibold">
              Security is foundational. Abragim employs end-to-end kinetic encryption to safeguard your performance history. Modify your plan at any time to adjust your capital accumulation velocity.
            </p>
        </div>
      </div>
    </div>
  );
};

const BenefitItem = ({ active, text, dark = false }: { active: boolean, text: string, dark?: boolean }) => (
  <li className={`flex items-center gap-4 font-bold text-sm ${active ? (dark ? 'text-black' : 'text-white') : 'text-zinc-600'}`}>
    <CheckCircle2 className={`w-5 h-5 ${active ? (dark ? 'text-purple-600' : 'text-purple-600') : 'text-zinc-800'}`} />
    <span className={!active ? 'line-through opacity-50' : ''}>{text}</span>
  </li>
);

export default SubscriptionPage;
