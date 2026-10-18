import React, { useState } from 'react';
import { WalkLog } from '../types';

interface ProfileViewProps {
  logs: WalkLog[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ logs }) => {
  const [femaleOnlyMatch, setFemaleOnlyMatch] = useState(false);
  const [fuzzyLocation, setFuzzyLocation] = useState(true);
  const [selectedPace, setSelectedPace] = useState('普通 (約4.2km/h)');

  return (
    <div className="flex flex-col w-full pb-8 px-4 pt-2 gap-4">
      {/* Student ID Verified Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#89f5e7]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00685f] to-[#6bd8cb] flex items-center justify-center text-white shadow-md font-bold text-xl ring-2 ring-emerald-100">
            <span className="material-symbols-outlined text-[32px]">school</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#191c1e]">
                あなた (学籍認証済)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                TMU公式
              </span>
            </div>
            <p className="text-xs text-[#545f73] mt-0.5">
              東京都立大学 システムデザイン学部 3年
            </p>
            <p className="text-[11px] text-[#6d7a77]">
              認証アカウント: @ed.tmu.ac.jp
            </p>
          </div>
        </div>

        {/* Walk Health & Commute Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#eceef0] text-center">
          <div className="bg-[#f7f9fb] p-2.5 rounded-xl border border-[#eceef0]">
            <span className="text-[10px] text-[#6d7a77] block font-medium">通学歩行距離</span>
            <span className="font-['Inter'] font-bold text-sm text-[#00685f]">18.4 km</span>
          </div>
          <div className="bg-[#f7f9fb] p-2.5 rounded-xl border border-[#eceef0]">
            <span className="text-[10px] text-[#6d7a77] block font-medium">通学歩行時間</span>
            <span className="font-['Inter'] font-bold text-sm text-[#c05400]">260 分</span>
          </div>
          <div className="bg-[#f7f9fb] p-2.5 rounded-xl border border-[#eceef0]">
            <span className="text-[10px] text-[#6d7a77] block font-medium">マッチング回数</span>
            <span className="font-['Inter'] font-bold text-sm text-[#545f73]">24 回</span>
          </div>
        </div>
      </div>

      {/* Health & Eco Impact Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#00685f]">
              directions_walk
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#191c1e]">
              健康・通学ウォーキング記録
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            今週の達成度 92%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#eceef0] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6d7a77] block">推定消費カロリー</span>
              <span className="font-bold text-sm text-[#191c1e]">890 kcal</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#eceef0] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">eco</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6d7a77] block">CO2削減貢献</span>
              <span className="font-bold text-sm text-[#191c1e]">3.8 kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Commute Preferences & Safety Toggles */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-3">
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#191c1e] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-[#00685f]">settings</span>
          通学スタイル・安全設定
        </h3>

        <div className="flex flex-col gap-2.5 text-xs">
          <div>
            <label className="text-[11px] text-[#6d7a77] font-medium block mb-1">
              デフォルトの歩行ペース設定:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['ゆっくり (約3.5km/h)', '普通 (約4.2km/h)', '早歩き (約5.0km/h)'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPace(p)}
                  className={`p-2 rounded-xl text-center text-[11px] transition-all cursor-pointer ${
                    selectedPace === p
                      ? 'bg-[#00685f] text-white font-bold shadow-xs'
                      : 'bg-[#f2f4f6] text-[#3d4947] hover:bg-[#e6e8ea]'
                  }`}
                >
                  {p.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#eceef0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#191c1e] block">女性同士優先マッチング</span>
              <span className="text-[10px] text-[#6d7a77]">女性学生同士の合流を優先的に提案します</span>
            </div>
            <button
              onClick={() => setFemaleOnlyMatch(!femaleOnlyMatch)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                femaleOnlyMatch ? 'bg-[#00685f]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  femaleOnlyMatch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-[#eceef0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#191c1e] block">位置情報のプライバシー保護 (50m曖昧化)</span>
              <span className="text-[10px] text-[#6d7a77]">合流直前まで正確なピンを一般公開しません</span>
            </div>
            <button
              onClick={() => setFuzzyLocation(!fuzzyLocation)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                fuzzyLocation ? 'bg-[#00685f]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  fuzzyLocation ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Past Walk Logs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#191c1e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#00685f]">history</span>
            通学歩行ログ履歴
          </h3>
          <span className="text-[11px] text-[#6d7a77]">全記録自動同期</span>
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#f7f9fb] border border-[#eceef0] flex items-center justify-between text-xs"
            >
              <div className="flex flex-col">
                <span className="font-bold text-[#191c1e]">{log.partnerName}</span>
                <span className="text-[11px] text-[#6d7a77] mt-0.5">{log.route}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{log.date}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#00685f] block">{log.durationMinutes}分 ({log.distanceMeters}m)</span>
                <span className="text-[10px] text-[#c05400] font-semibold">{log.caloriesBurned} kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
