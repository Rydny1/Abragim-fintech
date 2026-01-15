
import React, { useState } from 'react';
import { Mail, Lock, Activity, ArrowLeft } from 'lucide-react';
import { auth } from '../firebase';
import { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (view: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('demo@abragim.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.login(email);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Invalid credentials. Try demo@abragim.com or admin@abragim.com');
    }
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

      <div className="w-full max-w-md">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-2xl">
              <Activity className="text-purple-600 w-10 h-10" />
            </div>
            <span className="font-outfit text-5xl font-black text-white tracking-tighter">ABRAGIM</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Secure Login</h2>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-5">Access your kinetic portfolio</p>
        </div>

        <div className="bg-[#1a1f2e] border-2 border-zinc-800/50 p-12 rounded-[50px] shadow-sm">
          <form onSubmit={handleLogin} className="space-y-10">
            {error && <div className="p-5 bg-red-500/10 text-red-500 text-xs font-bold rounded-2xl uppercase tracking-widest border border-red-500/20 text-center">{error}</div>}
            
            <div>
              <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0f121d] border-2 border-zinc-800/50 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="name@example.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              Authenticate
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
              New Member? 
              <button onClick={() => onNavigate('SIGNUP')} className="ml-3 text-white font-black hover:underline underline-offset-4 decoration-purple-500">Apply Now</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
