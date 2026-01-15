
import React from 'react';
import { Activity, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigate?: (view: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="bg-black/60 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('LANDING')}>
            <div className="bg-white p-1.5 rounded-lg">
              <Activity className="text-[#a855f7] w-6 h-6" />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-white">
              ABRAGIM
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button className="text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
            {user.role === 'ADMIN' && (
              <button className="text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-white">{user.name}</span>
              <span className="text-[10px] text-purple-400 uppercase tracking-widest font-black">{user.subscriptionTier}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <User className="text-zinc-400 w-5 h-5" />
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
