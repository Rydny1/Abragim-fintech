
import React from 'react';
import { Activity, ShieldCheck, TrendingUp, Zap, ChevronRight, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#0a0c14] min-h-screen text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.2em] mb-10">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Elite Fitness FinTech</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-outfit font-black tracking-tighter text-white mb-8 leading-[0.85]">
              SWEAT <br />
              <span className="text-zinc-700">INTO</span> PURPLE
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed font-medium">
              Abragim Fitness: The premium NeoBank that converts your movement into automated high-yield savings.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => onNavigate('SIGNUP')}
                className="w-full sm:w-auto px-12 py-5 bg-white hover:bg-zinc-200 text-black font-black rounded-full transition-all flex items-center justify-center gap-2 group shadow-2xl"
              >
                Start Saving
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('LOGIN')}
                className="w-full sm:w-auto px-12 py-5 bg-[#0a0c14] hover:bg-zinc-900 text-purple-400 font-black rounded-full transition-all flex items-center justify-center gap-2 border-2 border-purple-500/50 neon-border"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-32 bg-[#0d0f1a] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="text-5xl font-outfit font-black text-white tracking-tighter">ENGINEERED FOR PERFORMANCE</h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-white" />}
              title="Fit-Savings"
              description="Move capital based on caloric burn. Every 1,000 steps automates a transfer to your HSA."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-white" />}
              title="Tiered Logic"
              description="Basic (€1.00) vs Premium (€1.50) rewards. Choose the velocity of your wealth growth."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-white" />}
              title="Activity Loans"
              description="Micro-lending for pro gear, secured by your activity history. Lower rates for harder training."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 bg-[#0a0c14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-outfit font-black text-white mb-24 uppercase tracking-tighter">Choose Your Velocity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <PricingCard 
              tier="Basic"
              price="€0"
              reward="€1.00"
              features={['Standard Transfer Limits', 'Standard HSA Interest', 'Basic Activity Tracking']}
              buttonText="Join Free"
              onClick={() => onNavigate('SIGNUP')}
            />
            <PricingCard 
              tier="Premium"
              price="€9.99"
              reward="€1.50"
              highlight={true}
              features={['50% Higher Rewards', 'Priority Loan Approval', 'Advanced Health Insights', 'Zero Fee Lending']}
              buttonText="Go Premium"
              onClick={() => onNavigate('SIGNUP')}
            />
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-zinc-900 bg-[#0a0c14]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-white p-1 rounded-lg">
               <Activity className="text-purple-600 w-6 h-6" />
            </div>
            <span className="font-outfit font-black text-white tracking-tighter text-2xl">ABRAGIM</span>
          </div>
          <p className="text-zinc-600 text-xs font-bold tracking-[0.3em] uppercase">© 2024 Abragim Fitness NeoBank. Built for the persistent.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-12 rounded-[40px] bg-[#141724] border border-zinc-800 hover:border-purple-500 transition-all group shadow-sm">
    <div className="mb-10 p-5 bg-[#0a0c14] rounded-2xl inline-block group-hover:bg-purple-600 transition-colors">{icon}</div>
    <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">{title}</h3>
    <p className="text-zinc-500 leading-relaxed font-medium">{description}</p>
  </div>
);

const PricingCard = ({ tier, price, reward, features, buttonText, highlight = false, onClick }: any) => (
  <div className={`p-12 rounded-[40px] border-4 ${highlight ? 'border-purple-600 bg-[#141724] ring-[12px] ring-purple-600/10' : 'border-zinc-900 bg-[#0a0c14]'} text-left relative overflow-hidden transition-all hover:scale-[1.02]`}>
    {highlight && <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] uppercase font-black px-8 py-2.5 rounded-bl-3xl tracking-widest">Premium</div>}
    <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">{tier}</h3>
    <div className="flex items-baseline gap-1 mb-10">
      <span className="text-6xl font-black text-white">{price}</span>
      <span className="text-zinc-500 font-bold">/mo</span>
    </div>
    <div className={`p-8 rounded-3xl mb-10 ${highlight ? 'bg-white text-black' : 'bg-[#0a0c14] border border-zinc-800 text-white'}`}>
      <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-2">Activity Reward</p>
      <p className="text-3xl font-black">{reward} / 1k Steps</p>
    </div>
    <ul className="space-y-5 mb-12">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-4 text-zinc-400 font-bold text-sm">
          <div className={`w-2 h-2 rounded-full ${highlight ? 'bg-purple-500' : 'bg-white'}`}></div>
          {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={onClick}
      className={`w-full py-6 rounded-2xl font-black transition-all uppercase tracking-widest text-sm ${highlight ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-600/30' : 'bg-white hover:bg-zinc-200 text-black'}`}
    >
      {buttonText}
    </button>
  </div>
);

export default LandingPage;
