import React, { useState } from 'react';
import { SearchFilterCriteria } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: SearchFilterCriteria;
  onApplyAndTurnGpsOn: (newCriteria: SearchFilterCriteria) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  criteria,
  onApplyAndTurnGpsOn,
}) => {
  const [station, setStation] = useState(criteria.station);
  const [route, setRoute] = useState(criteria.route);
  const [departureTime, setDepartureTime] = useState(criteria.departureTime);
  const [pace, setPace] = useState(criteria.pace);
  const [genderFilter, setGenderFilter] = useState<'all' | 'female_only'>(
    criteria.genderFilter
  );
  const [selectedMood, setSelectedMood] = useState<string>(criteria.moods[0] || '指定なし');
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const stations = [
    { label: '豊田駅 北口', desc: '中央線・徒歩約15分' },
    { label: '日野駅 東口', desc: '中央線・徒歩約22分' },
    { label: '南平駅', desc: '京王線・多摩川経由' },
    { label: '日野キャンパス発', desc: '講義後の帰宅マッチ' },
  ];

  const routes = [
    {
      name: '日野キャンパス 南門ルート',
      detail: '日野用水ふれあい水辺・遊歩道経由 (緑豊か・車道少なめ)',
      popular: true,
    },
    {
      name: '日野キャンパス 正門ルート',
      detail: '旭が丘大通り経由 (歩道広め・コンビニ・街灯◎)',
      popular: false,
    },
    {
      name: '日野用水 緑道ルート',
      detail: '親水緑道沿いの平坦コース',
      popular: false,
    },
    {
      name: '指定なし (最短ルート優先)',
      detail: '現在地から合流しやすいルートを自動判定',
      popular: false,
    },
  ];

  const departureOptions = [
    '今すぐ (5分以内)',
    '10分後 (8:40頃)',
    '15分後 (8:45頃)',
    '20分後 (8:50頃)',
  ];

  const paces = [
    { label: '指定なし', icon: 'all_inclusive' },
    { label: 'ゆっくりペース', icon: 'hiking', note: '約3.5km/h' },
    { label: '普通ペース', icon: 'directions_walk', note: '約4.2km/h' },
    { label: '早歩きペース', icon: 'directions_run', note: '約5.0km/h' },
  ];

  const moods = [
    '指定なし',
    '楽しくおしゃべり',
    '静かに歩きたい',
    '大学生活の相談',
    '早歩き重視',
  ];

  const handleApply = () => {
    setIsSearching(true);
    setTimeout(() => {
      onApplyAndTurnGpsOn({
        station,
        route,
        departureTime,
        pace,
        genderFilter,
        facultyFilter: 'all',
        moods: [selectedMood],
      });
      setIsSearching(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#191c1e]/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4 border border-[#e2e8f0] max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#89f5e7] flex items-center justify-center text-[#00685f]">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#191c1e]">
                通学条件の絞り込み
              </h3>
              <p className="text-xs text-[#3d4947]">設定後に位置情報がオンになります</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#eceef0] text-[#3d4947] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 1. Departure Station */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#00685f]">train</span>
            1. 出発駅 / 待ち合わせ拠点
          </label>
          <div className="grid grid-cols-2 gap-2">
            {stations.map((st) => (
              <button
                key={st.label}
                type="button"
                onClick={() => setStation(st.label)}
                className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                  station === st.label
                    ? 'border-[#00685f] bg-[#89f5e7]/20 shadow-xs ring-1 ring-[#00685f]'
                    : 'border-[#e2e8f0] bg-[#f7f9fb] hover:bg-[#f2f4f6]'
                }`}
              >
                <span className="font-bold text-xs text-[#191c1e] block">{st.label}</span>
                <span className="text-[10px] text-[#64748b] mt-0.5 block">{st.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Commute Route */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#00685f]">alt_route</span>
            2. 希望の通学ルート
          </label>
          <div className="space-y-1.5">
            {routes.map((rt) => (
              <div
                key={rt.name}
                onClick={() => setRoute(rt.name)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  route === rt.name
                    ? 'border-[#00685f] bg-[#89f5e7]/20 shadow-xs ring-1 ring-[#00685f]'
                    : 'border-[#e2e8f0] bg-[#f7f9fb] hover:bg-[#f2f4f6]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#191c1e]">{rt.name}</span>
                    {rt.popular && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        人気
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#64748b] mt-0.5">{rt.detail}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    route === rt.name
                      ? 'border-[#00685f] bg-[#00685f] text-white'
                      : 'border-[#bcc9c6] bg-white'
                  }`}
                >
                  {route === rt.name && (
                    <span className="material-symbols-outlined text-[12px]">check</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Departure Time */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#00685f]">schedule</span>
            3. 出発タイミング
          </label>
          <div className="grid grid-cols-2 gap-2">
            {departureOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDepartureTime(opt)}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-center border cursor-pointer ${
                  departureTime === opt
                    ? 'bg-[#00685f] text-white font-bold border-[#00685f] shadow-xs'
                    : 'bg-[#f7f9fb] text-[#3d4947] border-[#e2e8f0] hover:bg-[#f2f4f6]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Walking Pace */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#00685f]">speed</span>
            4. 歩行ペース
          </label>
          <div className="grid grid-cols-2 gap-2">
            {paces.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPace(p.label)}
                className={`p-2 rounded-xl text-left transition-all border cursor-pointer flex items-center gap-2 ${
                  pace === p.label
                    ? 'border-[#00685f] bg-[#89f5e7]/20 shadow-xs ring-1 ring-[#00685f]'
                    : 'border-[#e2e8f0] bg-[#f7f9fb] hover:bg-[#f2f4f6]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    pace === p.label ? 'bg-[#00685f] text-white' : 'bg-[#e0e3e5] text-[#545f73]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{p.icon}</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-[#191c1e] block">{p.label}</span>
                  {p.note && <span className="text-[9px] text-[#6d7a77]">{p.note}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Female-only toggle */}
        <div className="flex items-center justify-between p-2.5 bg-[#f7f9fb] rounded-xl border border-[#eceef0]">
          <div>
            <span className="text-xs font-bold text-[#191c1e] block">女性同士優先マッチング</span>
            <span className="text-[10px] text-[#6d7a77]">女性学生同士のみをマップ上に表示</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setGenderFilter(genderFilter === 'all' ? 'female_only' : 'all')
            }
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              genderFilter === 'female_only' ? 'bg-[#00685f]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                genderFilter === 'female_only' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Atmosphere */}
        <div>
          <span className="text-[11px] text-[#6d7a77] font-medium block mb-1">
            歩行中のコミュニケーション:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMood(m)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  selectedMood === m
                    ? 'bg-[#00685f] text-white border-[#00685f] font-bold'
                    : 'bg-[#f7f9fb] text-[#3d4947] border-[#e2e8f0] hover:bg-[#eceef0]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Submit & Turn GPS ON button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isSearching}
            onClick={handleApply}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#00685f] to-[#008378] hover:from-[#005049] hover:to-[#00685f] text-white font-['Plus_Jakarta_Sans'] font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSearching ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>現在地GPSを捕捉中...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px] animate-pulse">
                  my_location
                </span>
                <span>現在地をONにして周辺を検索</span>
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-[#6d7a77] mt-1.5">
            ※ 検索実行と同時に自分の位置情報がONになり、周辺の候補者も表示されます
          </p>
        </div>
      </div>
    </div>
  );
};
