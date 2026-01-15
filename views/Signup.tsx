
import React, { useState } from 'react';
import { Mail, Lock, User, Activity, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { UserProfile, SubscriptionTier } from '../types';

interface SignupProps {
  onSignupSuccess: (user: UserProfile) => void;
  onNavigate: (view: any) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tier: 'BASIC' as SubscriptionTier
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSignup = () => {
    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      email: formData.email,
      name: formData.name,
      role: 'USER',
      mainBalance: 1000,
      hsaBalance: 0,
      totalSteps: 0,
      subscriptionTier: formData.tier,
      loanStatus: 'NONE',
      loanAmount: 0
    };
    
    db.addUser(newUser);
    auth.login(formData.email);
    
    db.addTransaction({
      id: `tx-${Date.now()}`,
      userId: newUser.uid,
      userName: newUser.name,
      type: 'INITIAL_DEPOSIT',
      amount: 1000,
      timestamp: Date.now(),
      description: 'Welcome Bonus Deposit'
    });

    onSignupSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-[#0f121d] flex flex-col items-center justify-center p-4">
      <button 
        onClick={() => onNavigate('LANDING')}
        className="absolute top-10 left-10 flex items-center gap-3 text-zinc-500 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="w-full max-w-3xl">
        {step === 1 ? (
          <div className="bg-[#1a1f2e] border-2 border-zinc-800/50 p-12 rounded-[50px] shadow-sm max-w-md mx-auto">
            <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Join Abragim</h2>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-12">Start your kinetic wealth journey</p>
            
            <form onSubmit={handleNext} className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#0f121d] border-2 border-zinc-800/50 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#0f121d] border-2 border-zinc-800/50 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[#0f121d] border-2 border-zinc-800/50 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-black font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs"
              >
                Next Step
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-16">
            <h2 className="text-6xl font-black text-white text-center uppercase tracking-tighter">Choose Velocity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div 
                onClick={() => setFormData({...formData, tier: 'BASIC'})}
                className={`p-12 rounded-[50px] border-4 cursor-pointer transition-all ${formData.tier === 'BASIC' ? 'border-white bg-[#1a1f2e] ring-[15px] ring-white/5' : 'bg-[#1a1f2e]/40 border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Basic</h3>
                  {formData.tier === 'BASIC' && <CheckCircle2 className="text-white w-8 h-8" />}
                </div>
                <p className="text-6xl font-black text-white mb-2 leading-none">€0<span className="text-[11px] text-zinc-500 font-bold uppercase ml-3 tracking-widest">/mo</span></p>
                <div className="mt-12 space-y-5">
                  <p className="text-sm font-bold text-zinc-400 flex items-center gap-4 uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-white"></div> €1.00 per 1k steps</p>
                  <p className="text-sm font-bold text-zinc-400 flex items-center gap-4 uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-white"></div> Standard HSA</p>
                </div>
              </div>

              <div 
                onClick={() => setFormData({...formData, tier: 'PREMIUM'})}
                className={`p-12 rounded-[50px] border-4 cursor-pointer transition-all ${formData.tier === 'PREMIUM' ? 'border-[#a855f7] bg-white text-black ring-[15px] ring-[#a855f7]/10' : 'bg-[#1a1f2e]/40 border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className={`text-3xl font-black uppercase tracking-tighter ${formData.tier === 'PREMIUM' ? 'text-black' : 'text-white'}`}>Premium</h3>
                  {formData.tier === 'PREMIUM' && <CheckCircle2 className="text-[#a855f7] w-8 h-8" />}
                </div>
                <p className={`text-6xl font-black mb-2 leading-none ${formData.tier === 'PREMIUM' ? 'text-black' : 'text-white'}`}>€9.99<span className="text-[11px] text-zinc-500 font-bold uppercase ml-3 tracking-widest">/mo</span></p>
                <div className="mt-12 space-y-5">
                  <p className={`text-sm font-bold flex items-center gap-4 uppercase tracking-wider ${formData.tier === 'PREMIUM' ? 'text-purple-600' : 'text-zinc-400'}`}><div className={`w-2 h-2 rounded-full ${formData.tier === 'PREMIUM' ? 'bg-[#a855f7]' : 'bg-white'}`}></div> €1.50 per 1k steps</p>
                  <p className={`text-sm font-bold flex items-center gap-4 uppercase tracking-wider ${formData.tier === 'PREMIUM' ? 'text-black' : 'text-zinc-400'}`}><div className={`w-2 h-2 rounded-full ${formData.tier === 'PREMIUM' ? 'bg-[#a855f7]' : 'bg-white'}`}></div> High-Yield HSA</p>
                  <p className={`text-sm font-bold flex items-center gap-4 uppercase tracking-wider ${formData.tier === 'PREMIUM' ? 'text-black' : 'text-zinc-400'}`}><div className={`w-2 h-2 rounded-full ${formData.tier === 'PREMIUM' ? 'bg-[#a855f7]' : 'bg-white'}`}></div> Equipment Loans</p>
                </div>
              </div>
            </div>

            <div className="flex gap-8 pt-8 max-w-2xl mx-auto">
               <button 
                onClick={() => setStep(1)}
                className="flex-1 py-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
              >
                Back
              </button>
              <button 
                onClick={handleSignup}
                className="flex-[2] py-6 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl transition-all shadow-2xl uppercase tracking-widest text-xs"
              >
                Finish Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
