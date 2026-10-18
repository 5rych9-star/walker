import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { ExploreHomeView } from './components/ExploreHomeView';
import { FilterModal } from './components/FilterModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { CommuteChatView } from './components/CommuteChatView';
import { ProfileView } from './components/ProfileView';
import { RouteModal } from './components/RouteModal';
import { NotificationModal } from './components/NotificationModal';
import { ChatMessage, CommuterProfile, WalkLog, SearchFilterCriteria } from './types';
import {
  INITIAL_PARTNER,
  ALL_COMMUTERS,
  PAST_WALK_LOGS,
  DEFAULT_FILTER_CRITERIA,
  INITIAL_CHATS_BY_PARTNER_ID,
} from './data/mockData';

export default function App() {
  // App opens on "探す" (Explore/Map) as the home screen
  const [currentTab, setCurrentTab] = useState<TabType>('explore');

  // GPS starts in OFF state by default
  const [isGpsOn, setIsGpsOn] = useState<boolean>(false);

  // Active partner and list of individual partner chats
  const [partner, setPartner] = useState<CommuterProfile>(INITIAL_PARTNER);
  const [allMatchedPartners, setAllMatchedPartners] = useState<CommuterProfile[]>([
    INITIAL_PARTNER,
    ALL_COMMUTERS[1], // Aoi
  ]);

  // Individual chats dictionary: partnerId -> ChatMessage[]
  const [chatsByPartnerId, setChatsByPartnerId] = useState<Record<string, ChatMessage[]>>(
    INITIAL_CHATS_BY_PARTNER_ID
  );

  const [walkLogs, setWalkLogs] = useState<WalkLog[]>(PAST_WALK_LOGS);
  const [filterCriteria, setFilterCriteria] = useState<SearchFilterCriteria>(DEFAULT_FILTER_CRITERIA);

  // Modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // Match celebration modal state
  const [celebrationPartner, setCelebrationPartner] = useState<CommuterProfile | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  const [commuteStatus, setCommuteStatus] = useState<'通学中' | '合流済み' | '到着' | '待機中'>('通学中');
  const [unreadCount, setUnreadCount] = useState(1);

  // Current messages for the active partner
  const currentMessages = chatsByPartnerId[partner.id] || [];

  // Toggle GPS on/off
  const handleToggleGps = (nextState?: boolean) => {
    setIsGpsOn((prev) => (typeof nextState === 'boolean' ? nextState : !prev));
  };

  // Turn GPS on with new criteria applied from filter modal
  const handleApplyCriteriaAndTurnGpsOn = (newCriteria: SearchFilterCriteria) => {
    setFilterCriteria(newCriteria);
    setIsGpsOn(true);
  };

  // Triggered when matching with a commuter from the map or candidate list
  const handleInitiateMatch = (selected: CommuterProfile) => {
    setCelebrationPartner(selected);
    setIsCelebrationOpen(true);
  };

  // Confirmed match celebration -> transitions into the individual chat
  const handleConfirmMatchAndOpenChat = () => {
    if (!celebrationPartner) return;
    const target = celebrationPartner;

    // Add to matched partners if not present
    if (!allMatchedPartners.some((p) => p.id === target.id)) {
      setAllMatchedPartners((prev) => [...prev, target]);
    }

    // Ensure initial messages exist for this partner
    if (!chatsByPartnerId[target.id] || chatsByPartnerId[target.id].length === 0) {
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      const initMessages: ChatMessage[] = [
        {
          id: `sys-${target.id}`,
          sender: 'system',
          text: `${target.name}さんとのマッチングが成立しました！合流地点: ${target.rendezvousPoint}`,
          time: timeStr,
        },
        {
          id: `msg-${target.id}-1`,
          sender: 'partner',
          senderName: target.name,
          avatarUrl: target.avatarUrl,
          text: `はじめまして！${target.name}です。現在【${target.currentSpotName || target.rendezvousPoint}】にいます！`,
          time: timeStr,
        },
      ];
      setChatsByPartnerId((prev) => ({
        ...prev,
        [target.id]: initMessages,
      }));
    }

    setPartner(target);
    setCommuteStatus('通学中');
    setIsCelebrationOpen(false);
    setCurrentTab('chat');
  };

  // Switch between individual partner chat threads
  const handleSwitchPartner = (partnerId: string) => {
    const target = ALL_COMMUTERS.find((c) => c.id === partnerId);
    if (target) {
      setPartner(target);
    }
  };

  // Send message specifically to the current partner's individual chat
  const handleSendMessage = (text: string, isLocationPin: boolean = false) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentPartnerId = partner.id;

    const newSelfMsg: ChatMessage = {
      id: `self-${Date.now()}`,
      sender: 'self',
      text,
      time: timeStr,
      status: 'read',
      isLocationPin,
    };

    setChatsByPartnerId((prev) => ({
      ...prev,
      [currentPartnerId]: [...(prev[currentPartnerId] || []), newSelfMsg],
    }));

    // Partner-specific automated reaction
    setTimeout(() => {
      let replyText = '了解です！気をつけて来てください〜！';

      if (text.includes('コンビニ') || text.includes('🏪')) {
        replyText = 'ファミマの角ですね！すぐ見つかります、そのまま日野用水沿いに来てください！';
      } else if (text.includes('リュック') || text.includes('🎒')) {
        replyText = '青いリュック見えました！歩道沿いで手振ってます👋';
      } else if (text.includes('信号') || text.includes('🚥')) {
        replyText = '旭が丘の交差点ですね！青になったら渡りましょう！';
      } else if (text.includes('ゆっくり') || text.includes('👟')) {
        replyText = 'もちろん！僕も歩調合わせてのんびり行きますね〜';
      } else if (text.includes('橋') || text.includes('日野用水')) {
        replyText = '用水路沿いは風が通って気持ちいいですね！南門まですぐです';
      } else if (text.includes('位置') || isLocationPin) {
        replyText = 'ピン確認しました！GPS同期バッチリです👍';
      } else if (text.includes('合流完了')) {
        replyText = '合流ありがとうございます！キャンパスまで一緒に向かいましょう！';
        setCommuteStatus('合流済み');
      }

      const replyMsg: ChatMessage = {
        id: `partner-${Date.now()}`,
        sender: 'partner',
        senderName: partner.name,
        avatarUrl:
          partner.id === 'kenta-01'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr5eQJCbGZA0yS-ulnctDGeUfKnsr4TYNm_zQSfZmrMwVvqPmbtFTlzolg2LZ7N0RqCifLgsptn1qKLZPe8US7-GWaRl3R8IpWuf1iXbmKcih80Lqqr9XoMw46IvLLNcjVYnv7PK-RraF5RzW6OUHRBhTj0vucPu7E3B2ehNL0wU3GgpfK2BKQ5ZtdpQgsIDVtE5kOO0waosNjInU8ija7LQCeSDvuHooOkzaDIgVB5a_MQY_Z_BqJ'
            : partner.avatarUrl,
        text: replyText,
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      };

      setChatsByPartnerId((prev) => ({
        ...prev,
        [currentPartnerId]: [...(prev[currentPartnerId] || []), replyMsg],
      }));
    }, 1200);
  };

  const handleArrivalComplete = (stats: { durationMinutes: number; distanceMeters: number; caloriesBurned: number }) => {
    const now = new Date();
    const timeStr = `今日 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLog: WalkLog = {
      id: `log-${Date.now()}`,
      date: timeStr,
      partnerName: `${partner.name} (${partner.faculty} ${partner.grade})`,
      route: partner.route,
      durationMinutes: stats.durationMinutes,
      distanceMeters: stats.distanceMeters,
      caloriesBurned: stats.caloriesBurned,
      co2SavedGrams: 180,
    };

    setWalkLogs((prev) => [newLog, ...prev]);
    setCommuteStatus('到着');
    setCurrentTab('profile');
  };

  const handleToggleStatus = () => {
    const statuses: Array<'通学中' | '合流済み' | '到着' | '待機中'> = [
      '通学中',
      '合流済み',
      '到着',
      '待機中',
    ];
    const currentIndex = statuses.indexOf(commuteStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    setCommuteStatus(nextStatus);
  };

  return (
    <div className="w-full min-h-screen bg-[#eceef0] flex justify-center selection:bg-[#00685f]/20">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md min-h-screen bg-[#f7f9fb] shadow-2xl relative flex flex-col">
        {/* Top Sticky Header */}
        <Header
          commuteStatus={commuteStatus}
          onToggleStatus={handleToggleStatus}
          unreadCount={unreadCount}
          onOpenNotifications={() => {
            setIsNotificationOpen(true);
            setUnreadCount(0);
          }}
          onOpenProfile={() => setCurrentTab('profile')}
        />

        {/* Main Body Viewport */}
        <main className="flex-1 w-full pt-16 pb-20 overflow-y-auto no-scrollbar">
          {/* TAB 1: 探す (Explore / Map Home Screen) */}
          {currentTab === 'explore' && (
            <ExploreHomeView
              isGpsOn={isGpsOn}
              onToggleGps={handleToggleGps}
              criteria={filterCriteria}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              commuters={ALL_COMMUTERS}
              onSelectCommuterAndChat={handleInitiateMatch}
              activePartner={partner}
              onOpenChat={() => setCurrentTab('chat')}
            />
          )}

          {/* TAB 2: チャット (Commute Chat Screen - Individual Chats) */}
          {currentTab === 'chat' && (
            <CommuteChatView
              partner={partner}
              allPartners={allMatchedPartners}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              onOpenRouteMap={() => setIsRouteModalOpen(true)}
              onArrivalComplete={handleArrivalComplete}
              onSwitchPartner={handleSwitchPartner}
            />
          )}

          {/* TAB 3: マイページ (Profile Screen - Clean of coupons) */}
          {currentTab === 'profile' && <ProfileView logs={walkLogs} />}
        </main>

        {/* Persistent Bottom Tab Bar (3 tabs: 探す [Home], チャット, マイページ) */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          chatBadgeCount={0}
        />

        {/* Condition Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          criteria={filterCriteria}
          onApplyAndTurnGpsOn={handleApplyCriteriaAndTurnGpsOn}
        />

        {/* Match Celebration Modal (Clear, prominent match notification) */}
        <MatchCelebrationModal
          isOpen={isCelebrationOpen}
          partner={celebrationPartner}
          onOpenChat={handleConfirmMatchAndOpenChat}
          onClose={() => setIsCelebrationOpen(false)}
        />

        {/* Route Details Modal */}
        <RouteModal
          isOpen={isRouteModalOpen}
          onClose={() => setIsRouteModalOpen(false)}
          partnerName={partner.name}
          rendezvousPoint={partner.rendezvousPoint}
        />

        {/* Campus Notifications Modal */}
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </div>
  );
}
