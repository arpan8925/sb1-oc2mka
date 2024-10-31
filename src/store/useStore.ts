import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  isOnline: boolean;
  isSpeaking: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'voice' | 'text';
  participants: string[];
}

interface Message {
  id: string;
  userId: string;
  channelId: string;
  content: string;
  timestamp: number;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  channels: Channel[];
  messages: Message[];
  selectedChannel: string | null;
  setCurrentUser: (user: User | null) => void;
  addChannel: (channel: Channel) => void;
  addMessage: (message: Message) => void;
  setSelectedChannel: (channelId: string) => void;
  updateUserStatus: (userId: string, isOnline: boolean, isSpeaking?: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  users: [],
  channels: [
    { id: '1', name: '🎮 Gaming', type: 'voice', participants: [] },
    { id: '2', name: '🎵 Music', type: 'voice', participants: [] },
    { id: '3', name: '💬 General', type: 'text', participants: [] },
    { id: '4', name: '🤝 Welcome', type: 'text', participants: [] },
  ],
  messages: [],
  selectedChannel: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  addChannel: (channel) => set((state) => ({ 
    channels: [...state.channels, channel] 
  })),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setSelectedChannel: (channelId) => set({ selectedChannel: channelId }),
  updateUserStatus: (userId, isOnline, isSpeaking = false) => set((state) => ({
    users: state.users.map((user) =>
      user.id === userId ? { ...user, isOnline, isSpeaking } : user
    ),
  })),
}));