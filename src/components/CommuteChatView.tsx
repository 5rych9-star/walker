import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, CommuterProfile } from '../types';
import { QUICK_PRESETS } from '../data/mockData';

interface CommuteChatViewProps {
  partner: CommuterProfile;
  allPartners: CommuterProfile[];
  messages: ChatMessage[];
  onSendMessage: (text: string, isLocationPin?: boolean) => void;
  onOpenRouteMap: () => void;
  onArrivalComplete: (stats: { durationMinutes: number; distanceMeters: number; caloriesBurned: number }) => void;
  onSwitchPartner: (partnerId: string) => void;
}

export const CommuteChatView: React.FC<CommuteChatViewProps> = ({
  partner,
  allPartners,
  messages,
  onSendMessage,
  onOpenRouteMap,
  onArrivalComplete,
  onSwitchPartner,
}) => {
  const [inputText, setInputText] = useState('');
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [distanceRemaining, setDistanceRemaining] = useState(50); // meters to rendezvous
  const [partnerDistanceTotal, setPartnerDistanceTotal] = useState(partner.distanceMeters);
  const [isJoined, setIsJoined] = useState(false);
  const [ratingTag, setRatingTag] = useState<string | null>('爽やかに挨拶できた');

  const timelineEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  const handleQuickSend = (chip: string) => {
    onSendMessage(chip);
  };

  const handleShareLocation = () => {
    onSendMessage(`📍 現在地を共有しました: 日野用水 旭が丘遊歩道（合流まであと${distanceRemaining}m）`, true);
  };

  // Simulate proximity step
  const handleStepCloser = () => {
    if (distanceRemaining > 10) {
      setDistanceRemaining((prev) => Math.max(0, prev - 15));
      setPartnerDistanceTotal((prev) => Math.max(100, prev - 80));
    } else {
      setDistanceRemaining(0);
      setIsJoined(true);
      onSendMessage(`合流完了しました！${partner.name}さんと合流しました🎉`);
    }
  };

  const handleCompleteSession = () => {
    setShowArrivalModal(false);
    onArrivalComplete({
      durationMinutes: 14,
      distanceMeters: 920,
      caloriesBurned: 45,
    });
  };

  // Trajectory progress: 0m to 100m, inverted for closeness
  const progressPercent = Math.min(100, Math.max(15, 100 - distanceRemaining * 1.5));

  return (
    <div className="flex flex-col w-full pb-6">
      {/* Individual Chat Switcher Header Bar */}
      <div className="px-4 pt-2 pb-1 bg-white border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-[#6d7a77] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#00685f]">forum</span>
            個別チャット切り替え
          </span>
          <span className="text-[10px] text-[#00685f] font-semibold">
            通学相手ごとに独立
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {allPartners.map((p) => {
            const isCurrent = p.id === partner.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSwitchPartner(p.id)}
                className={`shrink-0 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#00685f] text-white font-bold shadow-xs'
                    : 'bg-[#f2f4f6] text-[#3d4947] hover:bg-[#e6e8ea]'
                }`}
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{p.name}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Sticky Banner: Match & Destination Live Sync */}
      <div className="px-4 pt-2 pb-1">
        <div className="bg-white rounded-xl p-4 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] border border-[#e2e8f0]/80 flex flex-col gap-3">
          {/* User Info & Route Proximity Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-slate-100"
                  alt={partner.name}
                  src={partner.avatarUrl}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#008378] ring-2 ring-white animate-pulse"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[24px] text-[#191c1e] truncate">
                    {partner.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#d5e0f8] text-[#586377] font-['Inter'] font-semibold text-[10px] leading-[14px]">
                    {partner.faculty} {partner.grade}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#3d4947] mt-0.5">
                  <span
                    className="material-symbols-outlined text-[15px] text-[#00685f]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    directions_walk
                  </span>
                  <span className="font-['Noto_Sans_JP'] text-[12px] leading-[18px]">
                    {partner.pace} ({partner.paceKmH})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 bg-[#89f5e7]/30 px-2.5 py-1.5 rounded-xl text-right border border-[#89f5e7]/40">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00685f] animate-ping"></span>
                <span className="font-['Inter'] font-bold text-[12px] leading-[16px] text-[#00685f]">
                  {isJoined ? '合流完了' : 'マッチング中'}
                </span>
              </div>
              <span className="font-['Inter'] text-[10px] leading-[14px] text-[#3d4947] font-medium mt-0.5">
                {isJoined ? '一緒に歩行中' : `残り約12分 / ${partnerDistanceTotal}m`}
              </span>
            </div>
          </div>

          {/* Sync Tracker & Rendezvous Spot Indicator */}
          <div className="bg-[#f2f4f6] rounded-xl p-2.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#994100] min-w-0">
                <span
                  className="material-symbols-outlined text-[18px] shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  pin_drop
                </span>
                <span className="font-['Inter'] text-[12px] leading-[16px] font-semibold truncate">
                  合流目安：{partner.rendezvousPoint}
                </span>
              </div>
              <span
                onClick={handleStepCloser}
                title="タップして歩行距離を短縮シミュレーション"
                className={`px-2 py-0.5 rounded-full font-['Inter'] text-[10px] leading-[14px] font-bold shrink-0 cursor-pointer select-none transition-all active:scale-95 ${
                  isJoined
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#ffdbca] text-[#783200] hover:bg-[#ffb690]'
                }`}
              >
                {isJoined ? '合流済み ✓' : `あと約${distanceRemaining}m`}
              </span>
            </div>

            {/* Walking Trajectory Proximity Visualization */}
            <div className="relative w-full py-1.5 px-2 flex items-center justify-between">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#e0e3e5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#008378] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Self Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#00685f] font-bold mt-1">
                  あなた
                </span>
              </div>

              {/* Rendezvous Pin Halo */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full bg-[#c05400] text-white flex items-center justify-center shadow-sm ${
                    !isJoined ? 'animate-bounce' : 'scale-110 ring-2 ring-amber-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                </div>
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#783200] font-bold mt-0.5">
                  合流地点
                </span>
              </div>

              {/* Partner Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#d8e3fb] text-[#111c2d] flex items-center justify-center shadow-sm border border-[#bcc7de]">
                  <span className="material-symbols-outlined text-[18px]">face</span>
                </div>
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#545f73] font-bold mt-1">
                  {partner.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Route Visual Map Preview */}
      <div className="px-4 py-1">
        <div
          onClick={onOpenRouteMap}
          className="relative w-full h-28 rounded-xl overflow-hidden shadow-sm bg-[#eceef0] cursor-pointer group hover:shadow-md transition-all border border-[#e2e8f0]"
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            data-location="Tokyo Metropolitan University Hino Campus, Asahigaoka, Hino, Tokyo, Japan"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGIDO3EaOcrmizXOAR0zlydRql4lx22eck1fXCOxqwKErKjDinznO8di1tbBurGmkzCP4Tfz_258Gduvo8vryNBg5TQFQ_Bf45WmoaO_XMNTtfiFUdrM956n_mHvfbZJeZCOR62U6y_uixIZ2Sa9MF8FvrtLvgnGZzZOXIbn2TEjL8-8JIvFHjh9pf2BBX5Y4GoWDB2FhKSqAO9w-KtquohRtI_wh1VmcbAD9FuFdAD3kn0MCDEduG')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#191c1e]/70 via-black/20 to-transparent flex items-end justify-between p-2.5 text-white">
            <div className="flex items-center gap-1 text-[#f7f9fb]">
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span className="font-['Inter'] text-[10px] leading-[14px] font-semibold">
                {partner.route}
              </span>
            </div>
            <span className="font-['Inter'] text-[10px] leading-[14px] bg-[#006a61]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              GPS 高精度同期中
            </span>
          </div>
        </div>
      </div>

      {/* Quick One-Hand Preset Chips */}
      <div className="pt-2 pb-1">
        <div className="px-4 flex items-center justify-between mb-1.5">
          <span className="font-['Inter'] text-[10px] leading-[14px] text-[#3d4947] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">touch_app</span>
            片手クイック送信（歩行中安全サポート）
          </span>
          <span className="font-['Inter'] text-[10px] leading-[14px] text-[#00685f] font-semibold">
            ワンタップ
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-1.5 no-scrollbar">
          {QUICK_PRESETS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickSend(chip)}
              className="shrink-0 px-3 py-2 rounded-full bg-white text-[#191c1e] hover:bg-[#d5e0f8] active:scale-95 transition-all text-left shadow-xs border border-[#e2e8f0] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="font-['Inter'] font-semibold text-[12px] leading-[16px]">{chip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Commute Chat Timeline for Individual Partner */}
      <div className="px-4 flex flex-col gap-3 my-1" id="chat-timeline">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex flex-col items-center my-1">
                <div className="bg-[#89f5e7]/40 border border-[#89f5e7]/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 max-w-[90%] shadow-xs">
                  <span className="material-symbols-outlined text-[#00685f] text-[16px]">
                    verified_user
                  </span>
                  <p className="font-['Inter'] text-[10px] leading-[14px] text-[#005049] text-center font-medium">
                    {msg.text}
                  </p>
                </div>
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#6d7a77] mt-1">
                  {msg.time}
                </span>
              </div>
            );
          }

          if (msg.sender === 'partner') {
            return (
              <div key={msg.id} className="flex items-end gap-2 max-w-[85%] self-start animate-fadeIn">
                <img
                  className="w-8 h-8 rounded-full object-cover shrink-0 mb-1 border border-slate-200"
                  alt={msg.senderName || partner.name}
                  src={msg.avatarUrl || partner.avatarUrl}
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 px-1">
                    <span className="font-['Inter'] text-[10px] leading-[14px] text-[#3d4947] font-semibold">
                      {msg.senderName || partner.name}
                    </span>
                    <span className="font-['Inter'] text-[10px] leading-[14px] text-[#6d7a77]">
                      {msg.time}
                    </span>
                  </div>
                  <div className="bg-white text-[#191c1e] p-3 rounded-2xl rounded-bl-sm shadow-xs border border-[#e2e8f0]/80">
                    <p className="font-['Noto_Sans_JP'] text-[14px] leading-[22px]">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          }

          // Self message
          return (
            <div key={msg.id} className="flex flex-col items-end gap-1 max-w-[85%] self-end animate-fadeIn">
              <div className="flex items-center gap-1 px-1">
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#00685f] font-semibold">
                  {msg.status === 'read' ? '既読' : '送信済み'}
                </span>
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#6d7a77]">
                  {msg.time}
                </span>
              </div>
              <div className="bg-[#00685f] text-white p-3 rounded-2xl rounded-br-sm shadow-sm">
                <p className="font-['Noto_Sans_JP'] text-[14px] leading-[22px]">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={timelineEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="px-4 pt-2 pb-2">
        <form
          className="flex items-center gap-2 bg-white p-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#e2e8f0]"
          onSubmit={handleSubmit}
        >
          <button
            aria-label="位置情報を共有"
            type="button"
            onClick={handleShareLocation}
            title="現在地ピンを共有"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#3d4947] hover:bg-[#eceef0] active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
          <input
            className="flex-1 bg-transparent border-0 outline-none px-2 font-['Noto_Sans_JP'] text-[14px] leading-[22px] text-[#191c1e] placeholder:text-[#6d7a77] min-w-0"
            placeholder={`${partner.name}さんにメッセージを入力...`}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            aria-label="送信"
            type="submit"
            className="w-10 h-10 rounded-full bg-[#00685f] hover:bg-[#005049] text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>

      {/* Arrival & End Commute Action Section */}
      <div className="px-4 pt-1 pb-3 flex flex-col gap-1">
        <div className="bg-[#f2f4f6] rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#89f5e7] flex items-center justify-center text-[#00685f] font-bold shrink-0">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div className="text-left">
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[16px] leading-[22px] text-[#191c1e] block">
                東京都立大学 日野キャンパス
              </span>
              <span className="font-['Noto_Sans_JP'] text-[12px] leading-[18px] text-[#3d4947]">
                構内GPS検知エリアに入ると自動終了も可能です
              </span>
            </div>
          </div>
          <button
            className="w-full py-3.5 px-4 rounded-full bg-[#c05400] hover:bg-[#994100] text-white font-['Inter'] font-semibold text-[14px] leading-[20px] shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => setShowArrivalModal(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">flag</span>
            <span>キャンパスに到着した！（チャットを終了して解散）</span>
          </button>
          <span className="font-['Inter'] text-[10px] leading-[14px] text-[#6d7a77]">
            ※ 到着ボタンを押すとマッチングが安全にクローズされ、本日の歩行ログに記録されます
          </span>
        </div>
      </div>

      {/* Arrival Confirmation Dialog (Modal - Cleaned of coupons!) */}
      {showArrivalModal && (
        <div className="fixed inset-0 z-50 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl flex flex-col items-center text-center gap-3 border border-[#e2e8f0]">
            <div className="w-14 h-14 rounded-full bg-[#89f5e7] flex items-center justify-center text-[#00685f] mb-1">
              <span className="material-symbols-outlined text-[32px]">celebration</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[24px] text-[#191c1e]">
              お疲れ様でした！
            </h3>
            <p className="font-['Noto_Sans_JP'] text-[14px] leading-[22px] text-[#3d4947]">
              日野キャンパスに無事到着しました。
              <br />
              {partner.name}さんとのマッチングセッションを完了します。
            </p>

            {/* Health & Walking Stats Summary (Clean of coupon/points) */}
            <div className="w-full bg-[#f2f4f6] p-3 rounded-xl flex justify-around my-1 border border-[#e2e8f0]">
              <div className="flex flex-col items-center">
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#6d7a77]">歩行時間</span>
                <span className="font-['Inter'] text-[16px] leading-[22px] text-[#00685f] font-bold">
                  14 分
                </span>
              </div>
              <div className="w-px bg-[#e0e3e5]"></div>
              <div className="flex flex-col items-center">
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#6d7a77]">距離</span>
                <span className="font-['Inter'] text-[16px] leading-[22px] text-[#00685f] font-bold">
                  920 m
                </span>
              </div>
              <div className="w-px bg-[#e0e3e5]"></div>
              <div className="flex flex-col items-center">
                <span className="font-['Inter'] text-[10px] leading-[14px] text-[#6d7a77]">消費カロリー</span>
                <span className="font-['Inter'] text-[16px] leading-[22px] text-[#c05400] font-bold">
                  45 kcal
                </span>
              </div>
            </div>

            {/* Quick Mutual Feedback */}
            <div className="w-full text-left">
              <span className="text-[11px] font-bold text-[#3d4947] block mb-1.5">
                マッチングフィードバック（匿名・学内相互評価）:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['爽やかに挨拶できた', '歩くペースが合っていた', '時間通りだった'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setRatingTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      ratingTag === tag
                        ? 'bg-[#00685f] text-white border-[#00685f]'
                        : 'bg-white text-[#3d4947] border-[#e2e8f0] hover:bg-[#f2f4f6]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="w-full py-3 rounded-full bg-[#00685f] hover:bg-[#005049] text-white font-['Inter'] font-semibold text-[14px] leading-[20px] shadow-md active:scale-95 transition-transform mt-1 cursor-pointer"
              onClick={handleCompleteSession}
            >
              セッションを完了してホームへ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
