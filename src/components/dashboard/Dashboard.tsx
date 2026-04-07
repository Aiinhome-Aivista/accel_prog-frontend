import React from 'react';
import LogoIcon from '../../assets/logogod.svg';
import { useAuth } from '../../context/AuthContext';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#f3ede7] flex flex-col">
      {/* Navigation */}
      <nav className="h-16 bg-white px-8 flex items-center justify-between border-b border-[#e5ddd4] shadow-sm">
        <div className="flex items-center gap-3">
          <img src={LogoIcon} className="w-[30px] h-[30px] object-contain" alt="MokshPath Logo" />
          <span className="font-serif text-xl text-[#2b2d42]">
            Moksh<em className="text-[#e87a2e] not-italic">Path</em>
          </span>
        </div>
        <button 
          className="px-4 py-2 rounded-lg bg-[#f9f5f0] text-[#6b6d7b] text-sm font-semibold border-1.5 border-[#e5ddd4] hover:bg-white hover:border-[#e87a2e] hover:text-[#e87a2e] transition-all cursor-pointer"
          onClick={onLogout}
        >
          Sign Out
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 flex justify-center">
        <div className="max-w-[900px] w-full">
          <div className="mb-10">
            <h1 className="font-serif text-4xl text-[#2b2d42] mb-4">
              You are already registered, <span className="text-[#e87a2e]">{user?.name || 'User'}</span>
            </h1>
            <p className="text-[#6b6d7b] text-lg">Your guided path to mastering AI-Native development starts here.</p>
          </div>

          <div className="mt-12 p-10 rounded-3xl bg-white border border-[#e5ddd4] shadow-md relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#fef3c7] rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff7ed] border border-[#ffedd5] text-[#e87a2e] text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-[#e87a2e] animate-pulse"></span>
                In Development
              </div>
              
              <h2 className="text-3xl font-serif text-[#2b2d42] mb-4">Building Your Future</h2>
              <p className="text-[#6b6d7b] text-lg mb-8 max-w-lg leading-relaxed">
                We're currently crafting a personalized learning experience just for you. 
                Our team is working on intensive modules, interactive AI sandboxes, and expert mentorship tools.
              </p>
              
              <button className="group relative px-8 py-4 rounded-xl bg-[#2b2d42] text-white font-semibold hover:bg-[#1a1c2c] transition-all shadow-xl hover:shadow-2xl active:scale-95">
                <span className="flex items-center gap-2">
                  Notify Me
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

