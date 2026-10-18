import React from 'react';
import { CommuterProfile } from '../types';

interface MatchCelebrationModalProps {
  isOpen: boolean;
  partner: CommuterProfile | null;
  onOpenChat: () => void;
  onClose: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  isOpen,
  partner,
  onOpenChat,
  onClose,
}) => {
  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#191c1e]/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center gap-4 border border-[#e2e8f0] relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#89f5e7]/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Celebration Badge */}
        <div className="bg-[#89f5e7]/60 text-[#005049] px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
          <span className="material-symbols-outlined text-[16px] animate-spin">stars</span>
          <span>通学マッチング成立！</span>
        </div>

        <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#191c1e] tracking-tight">
          合流相手が見つかりました！
        </h2>

        {/* Dual Avatars Connection Graphic */}
        <div className="flex items-center justify-center gap-3 w-full my-1">
          {/* User Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-md ring-4 ring-[#89f5e7]/60">
              <span className="material-symbols-outlined text-[28px]">person</span>
            </div>
            <span className="text-xs font-bold text-[#00685f] mt-1.5">あなた</span>
          </div>

          {/* Animated Connecting Beam */}
          <div className="flex flex-col items-center px-1">
            <div className="w-8 h-8 rounded-full bg-[#c05400] text-white flex items-center justify-center shadow-md animate-bounce">
              <span className="material-symbols-outlined text-[18px]">handshake</span>
            </div>
            <div className="flex gap-0.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] animate-ping"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#008378]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#89f5e7]"></span>
            </div>
          </div>

          {/* Partner Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={partner.avatarUrl}
                alt={partner.name}
                className="w-14 h-14 rounded-full object-cover shadow-md ring-4 ring-[#ffdbca]"
              />
              <span className="w-4 h-4 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white"></span>
            </div>
            <span className="text-xs font-bold text-[#191c1e] mt-1.5">{partner.name} さん</span>
          </div>
        </div>

        {/* Partner Info Summary Card */}
        <div className="w-full bg-[#f2f4f6] rounded-2xl p-3.5 border border-[#e2e8f0] flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#191c1e]">{partner.name}</span>
            <span className="text-[10px] bg-[#d5e0f8] text-[#586377] font-bold px-2 py-0.5 rounded-full">
              {partner.faculty} {partner.grade}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#3d4947]">
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">
              directions_walk
            </span>
            <span>{partner.pace} ({partner.paceKmH})</span>
          </div>

          <div className="pt-2 border-t border-[#e0e3e5] flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between text-[#783200] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#c05400]">
                  pin_drop
                </span>
                合流地点: {partner.rendezvousPoint}
              </span>
              <span className="bg-[#ffdbca] px-2 py-0.5 rounded-full text-[10px]">
                {partner.rendezvousDistance}
              </span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              ルート: {partner.route}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onOpenChat}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#00685f] to-[#008378] hover:from-[#005049] hover:to-[#00685f] text-white font-['Plus_Jakarta_Sans'] font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>合流チャットを開く</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs text-[#6d7a77] hover:text-[#191c1e] transition-colors cursor-pointer"
          >
            マップに戻る
          </button>
        </div>
      </div>
    </div>
  );
};
