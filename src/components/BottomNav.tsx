import React from 'react';

export type TabType = 'explore' | 'chat' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  chatBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  chatBadgeCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#f7f9fb]/95 backdrop-blur-xl border-t border-[#e2e8f0]/80 shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {/* Tab 1: 探す (Explore / Map Home) */}
        <button
          type="button"
          onClick={() => onChangeTab('explore')}
          className={`flex flex-col items-center justify-center w-20 h-12 transition-all cursor-pointer ${
            currentTab === 'explore'
              ? 'text-[#00685f] font-bold scale-105'
              : 'text-[#3d4947] hover:text-[#00685f]/80'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'explore' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            explore
          </span>
          <span className="font-['Inter'] text-[10px] leading-[14px] mt-0.5">探す</span>
        </button>

        {/* Tab 2: Commute Chat */}
        <button
          type="button"
          onClick={() => onChangeTab('chat')}
          className={`flex flex-col items-center justify-center w-20 h-12 transition-all relative cursor-pointer ${
            currentTab === 'chat'
              ? 'text-[#00685f] font-bold scale-105'
              : 'text-[#3d4947] hover:text-[#00685f]/80'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'chat' ? "'FILL' 1" : "'FILL' 0" }}
          >
            chat_bubble
          </span>
          {chatBadgeCount > 0 && currentTab !== 'chat' && (
            <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-[#c05400] ring-2 ring-[#f7f9fb]"></span>
          )}
          <span className="font-['Inter'] text-[10px] leading-[14px] mt-0.5">チャット</span>
        </button>

        {/* Tab 3: My Page */}
        <button
          type="button"
          onClick={() => onChangeTab('profile')}
          className={`flex flex-col items-center justify-center w-20 h-12 transition-all cursor-pointer ${
            currentTab === 'profile'
              ? 'text-[#00685f] font-bold scale-105'
              : 'text-[#3d4947] hover:text-[#00685f]/80'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            account_circle
          </span>
          <span className="font-['Inter'] text-[10px] leading-[14px] mt-0.5">マイページ</span>
        </button>
      </div>
    </nav>
  );
};
