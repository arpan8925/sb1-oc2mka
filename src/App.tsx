import React, { useEffect } from 'react';
import { ServerList } from './components/ServerList';
import { ServerSidebar } from './components/ServerSidebar';
import { Chat } from './components/Chat';
import { MembersList } from './components/MembersList';
import { useStore } from './store/useStore';

export function App() {
  const { setCurrentUser } = useStore();

  useEffect(() => {
    // Simulate user login
    setCurrentUser({
      id: '1',
      name: 'Demo User',
      isOnline: true,
      isSpeaking: false,
    });
  }, [setCurrentUser]);

  return (
    <div className="flex h-screen bg-discord-background text-white">
      <ServerList />
      <ServerSidebar />
      <Chat />
      <MembersList />
    </div>
  );
}