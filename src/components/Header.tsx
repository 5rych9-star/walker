import React, { useState } from 'react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount?: number;
  commuteStatus?: '通学中' | '合流済み' | '到着' | '待機中';
  onToggleStatus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 1,
  commuteStatus = '通学中',
  onToggleStatus,
}) => {
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f7f9fb]/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e8f0]/60">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img
            alt="Hino Commute Match Logo"
            className="h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VBtJv2YQaTIH9_ePHWN-S-foF0I_IGfam6UTHA5pUFhKrxBKHII0V0lG1Nfjd2e9TK1yBBlEIZzc0ReC7X9O2X1z6rVz35HsM7mcrTeOm5bLubILbFMsUYLHz0CFMfC6jtkVpYwfXVZCOFaPhK1O7g1y0Q8UPRu-tpsBJX0RiMVC8lpWZyiPVmmCQBMV02ozBAmjQMEAWoWZ4dULCSSJUvZ8V6ca1hjm-rmHdDNXy4QXmzbs3Ehud6EQ0"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[24px] text-[#00685f] tracking-tight truncate">
                日野ウォーカー
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#89f5e7] text-[#005049] font-['Inter'] font-bold text-[10px] leading-[14px] shrink-0">
                TMU
              </span>
            </div>
            <span className="font-['Inter'] font-semibold text-[10px] leading-[14px] text-[#3d4947] truncate">
              Commute Chat
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 shrink-0 relative">
          {/* Status Badge */}
          <button
            type="button"
            onClick={onToggleStatus}
            onMouseEnter={() => setShowStatusTooltip(true)}
            onMouseLeave={() => setShowStatusTooltip(false)}
            aria-label="通学ステータス切り替え"
            className="flex items-center gap-1 bg-[#f2f4f6] hover:bg-[#e6e8ea] active:scale-95 px-2 py-1 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#008378] animate-pulse"></span>
            <span className="font-['Inter'] text-[10px] leading-[14px] text-[#3d4947] font-semibold">
              {commuteStatus}
            </span>
          </button>

          {showStatusTooltip && (
            <div className="absolute top-10 right-14 z-50 bg-[#191c1e] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn pointer-events-none">
              タップしてステータス切り替え
            </div>
          )}

          {/* Notifications */}
          <button
            aria-label="通知"
            onClick={onOpenNotifications}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#3d4947] hover:bg-[#e6e8ea] active:scale-95 transition-all relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c05400] ring-2 ring-[#f7f9fb]"></span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            aria-label="マイページへ"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#00685f] hover:bg-[#005049] active:scale-95 flex items-center justify-center text-white shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
