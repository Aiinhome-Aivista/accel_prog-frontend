import React from 'react';
import LogoIcon from '../../assets/logogod.svg';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
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
            <h1 className="font-serif text-4xl text-[#2b2d42] mb-2">Welcome to your Dashboard</h1>
            <p className="text-[#6b6d7b] text-lg">Your guided path to mastering AI-Native development starts here.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
