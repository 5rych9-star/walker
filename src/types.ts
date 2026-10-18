export interface ChatMessage {
  id: string;
  sender: 'self' | 'partner' | 'system';
  senderName?: string;
  avatarUrl?: string;
  text: string;
  time: string;
  status?: 'sent' | 'read' | 'delivered';
  isLocationPin?: boolean;
  locationDetails?: {
    name: string;
    distance: string;
  };
}

export interface CommuterProfile {
  id: string;
  name: string;
  avatarUrl: string;
  faculty: string;
  grade: string;
  pace: string;
  paceKmH: string;
  station: string;
  route: string;
  departureTime: string;
  etaMinutes: number;
  distanceMeters: number;
  rendezvousPoint: string;
  rendezvousDistance: string;
  tags: string[];
  isVerified: boolean;
  bio?: string;
  currentSpotName?: string;
  mapCoord?: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
  gender?: 'male' | 'female';
  mood?: string;
}

export interface WalkLog {
  id: string;
  date: string;
  partnerName: string;
  route: string;
  durationMinutes: number;
  distanceMeters: number;
  caloriesBurned: number;
  co2SavedGrams: number;
}

export interface SearchFilterCriteria {
  station: string;
  route: string;
  departureTime: string;
  pace: string;
  genderFilter: 'all' | 'female_only';
  facultyFilter: string;
  moods: string[];
}
