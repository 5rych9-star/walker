import React, { useState } from 'react';
import { CommuterProfile, SearchFilterCriteria } from '../types';

interface ExploreHomeViewProps {
  isGpsOn: boolean;
  onToggleGps: (state?: boolean) => void;
  criteria: SearchFilterCriteria;
  onOpenFilterModal: () => void;
  commuters: CommuterProfile[];
  onSelectCommuterAndChat: (commuter: CommuterProfile) => void;
  activePartner: CommuterProfile;
  onOpenChat: () => void;
}

export const ExploreHomeView: React.FC<ExploreHomeViewProps> = ({
  isGpsOn,
  onToggleGps,
  criteria,
  onOpenFilterModal,
  commuters,
  onSelectCommuterAndChat,
  activePartner,
  onOpenChat,
}) => {
  // Filter commuters according to criteria
  const filtered = commuters.filter((c) => {
    if (criteria.genderFilter === 'female_only' && c.gender !== 'female') {
      return false;
    }
    if (criteria.pace !== '指定なし' && !c.pace.includes(criteria.pace.replace('ペース', ''))) {
      return false;
    }
    return true;
  });

  const [selectedId, setSelectedId] = useState<string>(
    filtered.length > 0 ? filtered[0].id : commuters[0].id
  );
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isActivatingGps, setIsActivatingGps] = useState(false);

  const selectedCommuter =
    filtered.find((c) => c.id === selectedId) || filtered[0] || commuters[0];

  const handleTurnOnGps = () => {
    setIsActivatingGps(true);
    setTimeout(() => {
      onToggleGps(true);
      setIsActivatingGps(false);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 1. Top Header Banner: Welcome & Status */}
      <div className="px-4 pt-2 pb-2 bg-white border-b border-[#e2e8f0] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#191c1e]">
              日野キャンパス 通学レーダー
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#89f5e7] text-[#005049] text-[10px] font-bold">
              TMU
            </span>
          </div>

          {/* GPS Toggle Switch */}
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold flex items-center gap-1 ${
                isGpsOn ? 'text-[#00685f]' : 'text-[#6d7a77]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isGpsOn ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'
                }`}
              ></span>
              {isGpsOn ? 'GPS: オン' : 'GPS: オフ'}
            </span>

            <button
              type="button"
              onClick={() => onToggleGps(!isGpsOn)}
              aria-label="GPS切り替え"
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isGpsOn ? 'bg-[#00685f]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isGpsOn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Selected Criteria Summary Bar */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#eceef0]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="bg-[#89f5e7]/40 text-[#005049] font-bold px-2 py-0.5 rounded-full text-[11px] shrink-0">
              {criteria.station}
            </span>
            <span className="bg-[#d5e0f8] text-[#586377] font-bold px-2 py-0.5 rounded-full text-[11px] shrink-0">
              {criteria.route.replace('日野キャンパス ', '')}
            </span>
            <span className="bg-[#f2f4f6] text-[#3d4947] font-medium px-2 py-0.5 rounded-full text-[11px] shrink-0">
              {criteria.departureTime}
            </span>
          </div>

          <button
            onClick={onOpenFilterModal}
            className="px-2.5 py-1 rounded-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#00685f] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ml-1"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            条件変更
          </button>
        </div>
      </div>

      {/* 2. Ongoing Active Match Shortcut (if matched) */}
      <div className="px-4 pt-2">
        <div className="bg-gradient-to-r from-[#00685f] to-[#008378] text-white rounded-2xl p-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activePartner.avatarUrl}
                alt={activePartner.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/80"
              />
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-white animate-pulse"></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm truncate">{activePartner.name} さん</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold shrink-0">
                  合流まで50m
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 truncate mt-0.5">
                {activePartner.rendezvousPoint} 付近
              </p>
            </div>
          </div>
          <button
            onClick={onOpenChat}
            className="px-3 py-1.5 rounded-full bg-white text-[#00685f] font-bold text-xs shadow-xs hover:bg-emerald-50 active:scale-95 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            チャットへ
          </button>
        </div>
      </div>

      {/* 3. Map Header Controls (View mode switch) */}
      <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
        <span className="text-xs font-bold text-[#191c1e] flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-[#00685f]">
            {isGpsOn ? 'radar' : 'map'}
          </span>
          {isGpsOn ? 'リアルタイム歩行レーダー (GPS稼働中)' : '通学路マップ (GPSオフ)'}
        </span>

        {isGpsOn && (
          <div className="flex bg-[#e0e3e5] p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#545f73]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">map</span>
              マップ
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#545f73]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
              一覧
            </button>
          </div>
        )}
      </div>

      {/* 4. MAP CONTAINER */}
      <div className="px-4">
        <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0] bg-[#eceef0]">
          {/* Base Map Image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGIDO3EaOcrmizXOAR0zlydRql4lx22eck1fXCOxqwKErKjDinznO8di1tbBurGmkzCP4Tfz_258Gduvo8vryNBg5TQFQ_Bf45WmoaO_XMNTtfiFUdrM956n_mHvfbZJeZCOR62U6y_uixIZ2Sa9MF8FvrtLvgnGZzZOXIbn2TEjL8-8JIvFHjh9pf2BBX5Y4GoWDB2FhKSqAO9w-KtquohRtI_wh1VmcbAD9FuFdAD3kn0MCDEduG"
            alt="TMU Campus Map"
            className="w-full h-full object-cover"
          />

          {/* TMU Hino Campus Destination Pin (Always visible) */}
          <div
            className="absolute z-20 flex flex-col items-center pointer-events-none"
            style={{ left: '65%', top: '38%' }}
          >
            <div className="bg-[#191c1e] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap flex items-center gap-1 border border-white/40">
              <span className="material-symbols-outlined text-[13px] text-amber-300">school</span>
              日野キャンパス (南門)
            </div>
            <div className="w-6 h-6 rounded-full bg-[#191c1e] text-white flex items-center justify-center shadow-lg ring-2 ring-white">
              <span className="material-symbols-outlined text-[14px]">flag</span>
            </div>
          </div>

          {/* CASE A: GPS IS OFF OVERLAY */}
          {!isGpsOn && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center text-white z-30 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-lg ring-1 ring-white/30">
                <span className="material-symbols-outlined text-[30px]">location_disabled</span>
              </div>

              <span className="text-[11px] font-bold bg-[#89f5e7] text-[#005049] px-2.5 py-0.5 rounded-full mb-1">
                プライバシー保護モード
              </span>

              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base mt-1">
                自分の位置情報は現在「オフ」です
              </h3>
              <p className="text-xs text-slate-200 mt-1 max-w-[280px] leading-relaxed">
                GPSをオンにすることで、あなたの現在地が表示され、同じ通学路を歩いているTMU生のリアルタイム位置もマップ上に出現します。
              </p>

              {/* Action Buttons to turn GPS on */}
              <div className="flex flex-col gap-2 w-full max-w-[260px] mt-4">
                <button
                  type="button"
                  onClick={onOpenFilterModal}
                  className="w-full py-2.5 px-3 rounded-full bg-gradient-to-r from-[#00685f] to-[#008378] hover:from-[#005049] hover:to-[#00685f] text-white font-['Plus_Jakarta_Sans'] font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>条件を設定してGPSをオン</span>
                </button>

                <button
                  type="button"
                  disabled={isActivatingGps}
                  onClick={handleTurnOnGps}
                  className="w-full py-2 px-3 rounded-full bg-white/90 hover:bg-white text-[#191c1e] font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isActivatingGps ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#00685f] border-t-transparent rounded-full animate-spin"></span>
                      <span>現在地を取得中...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">
                        my_location
                      </span>
                      <span>ワンタップでGPSをオン</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* CASE B: GPS IS ON -> RENDER USER & PEER PINS */}
          {isGpsOn && (
            <>
              {/* Connecting Polyline SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <linearGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00685f" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#008378" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <polyline
                  points="195,198 214,180 242,165 260,150"
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="4"
                  strokeDasharray="6,4"
                />
              </svg>

              {/* User Own Location Pin (あなた) */}
              <div
                className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: '50%', top: '55%' }}
              >
                <div className="absolute -inset-3.5 bg-[#00685f]/30 rounded-full animate-ping pointer-events-none"></div>
                <div className="bg-[#00685f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1 ring-1 ring-white">
                  あなた (現在地)
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-lg ring-3 ring-white">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
              </div>

              {/* Matched Commuters' Location Pins (Displayed because GPS is ON!) */}
              {filtered.map((commuter) => {
                const coord = commuter.mapCoord || { x: 50, y: 50 };
                const isSelected = commuter.id === selectedId;

                return (
                  <div
                    key={commuter.id}
                    onClick={() => setSelectedId(commuter.id)}
                    className={`absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                      isSelected ? 'scale-115 z-40' : 'hover:scale-105'
                    }`}
                    style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                  >
                    {/* Distance bubble */}
                    <div
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1 flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-[#c05400] text-white ring-2 ring-white animate-bounce'
                          : 'bg-white text-[#191c1e] border border-slate-200'
                      }`}
                    >
                      <span>{commuter.name}</span>
                      <span className="opacity-90">({commuter.rendezvousDistance})</span>
                    </div>

                    {/* Avatar Marker */}
                    <div
                      className={`relative rounded-full transition-all ${
                        isSelected
                          ? 'ring-3 ring-[#c05400] shadow-xl'
                          : 'ring-2 ring-white shadow-md'
                      }`}
                    >
                      <img
                        src={commuter.avatarUrl}
                        alt={commuter.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-1 ring-white"></span>
                    </div>
                  </div>
                );
              })}

              {/* GPS status tag at bottom-right */}
              <div className="absolute bottom-2.5 right-2.5 z-30">
                <span className="bg-[#006a61]/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  相手のGPS表示中 ({filtered.length}名)
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 5. DETAILS & CANDIDATES SECTION */}
      {/* If GPS is ON and Map view is active, show the selected candidate sheet */}
      {isGpsOn && viewMode === 'map' && selectedCommuter && (
        <div className="px-4 mt-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#00685f]/30 flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedCommuter.avatarUrl}
                    alt={selectedCommuter.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-[#00685f]/20"
                  />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#008378] absolute bottom-0 right-0 ring-2 ring-white animate-pulse"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#191c1e]">
                      {selectedCommuter.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#d5e0f8] text-[#586377] text-[10px] font-bold">
                      {selectedCommuter.faculty} {selectedCommuter.grade}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3d4947] mt-0.5">
                    <span className="flex items-center gap-0.5 text-[#00685f] font-medium">
                      <span className="material-symbols-outlined text-[15px]">directions_walk</span>
                      {selectedCommuter.pace}
                    </span>
                    <span>・</span>
                    <span className="text-[#6d7a77]">{selectedCommuter.currentSpotName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#c05400] block">
                  {selectedCommuter.rendezvousDistance}
                </span>
                <span className="text-[10px] text-[#6d7a77]">徒歩約1〜2分で合流</span>
              </div>
            </div>

            {/* Rendezvous Point */}
            <div className="p-2.5 rounded-xl bg-[#ffdbca]/40 border border-[#ffb690] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#783200]">
                <span className="material-symbols-outlined text-[18px] text-[#c05400]">
                  pin_drop
                </span>
                <span className="font-semibold">
                  合流目安: {selectedCommuter.rendezvousPoint}
                </span>
              </div>
              <span className="text-[10px] bg-[#c05400] text-white px-2 py-0.5 rounded-full font-bold">
                最短合流
              </span>
            </div>

            {/* CTA: Enter Commute Chat */}
            <button
              type="button"
              onClick={() => onSelectCommuterAndChat(selectedCommuter)}
              className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#00685f] to-[#008378] hover:from-[#005049] hover:to-[#00685f] text-white font-['Plus_Jakarta_Sans'] font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>{selectedCommuter.name} さんと合流チャットを開始</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* If GPS is ON and List view is active */}
      {isGpsOn && viewMode === 'list' && (
        <div className="px-4 mt-3 flex flex-col gap-2.5 animate-fadeIn">
          {filtered.map((commuter) => (
            <div
              key={commuter.id}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#e2e8f0] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={commuter.avatarUrl}
                    alt={commuter.name}
                    className="w-11 h-11 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#191c1e]">{commuter.name}</span>
                      <span className="text-[10px] bg-[#d5e0f8] text-[#586377] font-bold px-1.5 py-0.2 rounded-full">
                        {commuter.grade}
                      </span>
                    </div>
                    <span className="text-xs text-[#64748b] block mt-0.5">
                      {commuter.currentSpotName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#c05400] block">
                    {commuter.rendezvousDistance}
                  </span>
                  <span className="text-[10px] text-[#6d7a77]">徒歩約{commuter.etaMinutes}分</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#eceef0]">
                <span className="text-xs text-[#783200] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#c05400]">place</span>
                  {commuter.rendezvousPoint}
                </span>

                <button
                  onClick={() => onSelectCommuterAndChat(commuter)}
                  className="px-3 py-1.5 rounded-full bg-[#00685f] hover:bg-[#005049] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">chat</span>
                  合流チャットへ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* If GPS is OFF: Show campus walking guide & route selection tips */}
      {!isGpsOn && (
        <div className="px-4 mt-3 flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-[#191c1e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#00685f]">
                  explore
                </span>
                通学路ルート紹介 (GPSオンで合流可能)
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                見守り対象路
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div
                onClick={onOpenFilterModal}
                className="p-2.5 rounded-xl bg-[#f7f9fb] hover:bg-[#f2f4f6] border border-[#eceef0] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#191c1e]">南門ルート (日野用水沿い)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      人気 No.1
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    豊田駅北口 ⇄ 南門 (徒歩約15分 / 日野用水ふれあい水辺)
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#6d7a77]">chevron_right</span>
              </div>

              <div
                onClick={onOpenFilterModal}
                className="p-2.5 rounded-xl bg-[#f7f9fb] hover:bg-[#f2f4f6] border border-[#eceef0] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#191c1e]">正門ルート (旭が丘大通り)</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                      歩道広め
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    豊田駅北口 ⇄ 正門 (徒歩約16分 / コンビニ多数)
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#6d7a77]">chevron_right</span>
              </div>
            </div>
          </div>

          {/* Today's Commute Conditions */}
          <div className="bg-[#f2f4f6] rounded-2xl p-3 border border-[#e2e8f0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-amber-600">wb_sunny</span>
              <div>
                <span className="font-bold text-[#191c1e] block">今日の通学コンディション</span>
                <span className="text-[11px] text-[#545f73]">気温 19℃ / 晴れ / 風速 1m (快適に歩けます)</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              見守り稼働中
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
