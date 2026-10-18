import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: '日野キャンパス 南門ルート混雑なし',
      desc: '現在、旭が丘交差点〜南門歩道は信号待ちも短くスムーズに通行可能です。',
      time: '10分前',
      type: 'info',
      icon: 'traffic',
    },
    {
      id: 'n2',
      title: '日野用水ふれあい水辺 整備工事完了',
      desc: '遊歩道の舗装工事が完了し、歩行者専用道路が広くなりました。',
      time: '今日 7:45',
      type: 'success',
      icon: 'nature_people',
    },
    {
      id: 'n3',
      title: '日野用水沿い LED街灯点検完了',
      desc: '夕方・夜間の通学時も安心して通行できるよう街灯の点検が完了しました。',
      time: '昨日',
      type: 'accent',
      icon: 'lightbulb',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl flex flex-col gap-3.5 border border-[#e2e8f0]">
        <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f] text-[22px]">notifications_active</span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#191c1e]">通学・安全お知らせ</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#eceef0] text-[#3d4947] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {notifications.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-[#f2f4f6] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#00685f] text-[20px] shrink-0 mt-0.5">
                {item.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#191c1e]">{item.title}</span>
                  <span className="text-[10px] text-[#6d7a77] shrink-0">{item.time}</span>
                </div>
                <p className="text-[11px] text-[#3d4947] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#f2f4f6] text-[#191c1e] hover:bg-[#e6e8ea] font-medium text-xs transition-colors cursor-pointer"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};
