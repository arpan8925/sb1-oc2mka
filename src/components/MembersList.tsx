import React from 'react';
import { useStore } from '../store/useStore';
import { generateAvatarUrl } from '../lib/utils';

export function MembersList() {
  const { users } = useStore();
  
  const onlineUsers = users.filter(user => user.isOnline);
  const offlineUsers = users.filter(user => !user.isOnline);

  const UserSection = ({ title, users }: { title: string, users: typeof onlineUsers }) => (
    <div className="mb-6">
      <h3 className="text-discord-channelText uppercase text-xs font-semibold mb-2 px-4">
        {title} — {users.length}
      </h3>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center px-4 py-2 hover:bg-gray-700 rounded mx-2 cursor-pointer"
        >
          <div className="relative">
            <img
              src={generateAvatarUrl(user.id)}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-discord-membersBg ${
              user.isOnline ? 'bg-discord-green' : 'bg-gray-500'
            }`} />
          </div>
          <span className="ml-2 text-discord-textColor">
            {user.name}
          </span>
          {user.isSpeaking && (
            <div className="ml-auto">
              <div className="w-2 h-2 bg-discord-green rounded-full animate-pulse" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-60 bg-discord-membersBg flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        <UserSection title="Online" users={onlineUsers} />
        <UserSection title="Offline" users={offlineUsers} />
      </div>
    </div>
  );
}