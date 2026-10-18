import React from 'react';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  rendezvousPoint: string;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  partnerName,
  rendezvousPoint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#191c1e]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4 border border-[#e2e8f0] max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#89f5e7] flex items-center justify-center text-[#00685f]">
              <span className="material-symbols-outlined text-[20px]">navigation</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#191c1e]">
                日野キャンパス 南門ルート
              </h3>
              <p className="text-xs text-[#3d4947]">安全歩行アシストマップ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#eceef0] text-[#3d4947] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Map Snapshot */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-inner bg-[#eceef0]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGIDO3EaOcrmizXOAR0zlydRql4lx22eck1fXCOxqwKErKjDinznO8di1tbBurGmkzCP4Tfz_258Gduvo8vryNBg5TQFQ_Bf45WmoaO_XMNTtfiFUdrM956n_mHvfbZJeZCOR62U6y_uixIZ2Sa9MF8FvrtLvgnGZzZOXIbn2TEjL8-8JIvFHjh9pf2BBX5Y4GoWDB2FhKSqAO9w-KtquohRtI_wh1VmcbAD9FuFdAD3kn0MCDEduG"
            alt="TMU Hino Campus Route Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-[#00685f]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
            GPS高精度同期中 (誤差 ±1.5m)
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded backdrop-blur-xs">
            合流目標: {rendezvousPoint}
          </div>
        </div>

        {/* Waypoints Along Route */}
        <div className="flex flex-col gap-2.5 bg-[#f2f4f6] p-3 rounded-xl">
          <span className="text-xs font-bold text-[#191c1e] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">alt_route</span>
            ルート通過チェックポイント
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 bg-white p-2 rounded-lg shadow-xs">
              <span className="w-5 h-5 rounded-full bg-[#00685f] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <span className="font-semibold text-[#191c1e]">あなた現在地</span>
                <p className="text-[#64748b] text-[11px]">ファミマ旭が丘中央店 付近</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">進行中</span>
            </div>

            <div className="flex items-start gap-2 bg-[#ffdbca]/60 border border-[#c05400]/20 p-2 rounded-lg shadow-xs">
              <span className="w-5 h-5 rounded-full bg-[#c05400] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ★
              </span>
              <div className="flex-1">
                <span className="font-semibold text-[#783200]">合流地点：日野用水ふれあい水辺</span>
                <p className="text-[#783200]/80 text-[11px]">
                  {partnerName}さんとあと約50mで合流予定
                </p>
              </div>
              <span className="text-[10px] text-[#c05400] font-bold">合流目安</span>
            </div>

            <div className="flex items-start gap-2 bg-white p-2 rounded-lg shadow-xs">
              <span className="w-5 h-5 rounded-full bg-[#545f73] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <div className="flex-1">
                <span className="font-semibold text-[#191c1e]">東京都立大学 日野キャンパス 南門</span>
                <p className="text-[#64748b] text-[11px]">システムデザイン棟まで徒歩約5分</p>
              </div>
              <span className="text-[10px] text-[#545f73]">ゴール</span>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-lg flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">lightbulb</span>
            <span>街灯密度: 良好 (夜道も安心)</span>
          </div>
          <div className="bg-sky-50 border border-sky-200 text-sky-800 p-2 rounded-lg flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-sky-600">shield</span>
            <span>大学見回りパトロール対象路</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#00685f] text-white font-semibold text-xs shadow-md hover:bg-[#005049] active:scale-98 transition-all cursor-pointer"
        >
          チャット画面に戻る
        </button>
      </div>
    </div>
  );
};
