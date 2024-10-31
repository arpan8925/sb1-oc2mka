import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateAvatarUrl } from '../lib/utils';

export function Chat() {
  const [message, setMessage] = useState('');
  const { messages, currentUser, selectedChannel, addMessage } = useStore();
  
  const channelMessages = messages.filter(
    (msg) => msg.channelId === selectedChannel
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !selectedChannel) return;

    addMessage({
      id: Date.now().toString(),
      userId: currentUser.id,
      channelId: selectedChannel,
      content: message,
      timestamp: Date.now(),
    });
    
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-discord-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {channelMessages.map((msg) => (
          <div key={msg.id} className="flex items-start">
            <img
              src={generateAvatarUrl(msg.userId)}
              alt="User avatar"
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <div className="flex items-baseline">
                <span className="font-medium text-white mr-2">
                  User {msg.userId}
                </span>
                <span className="text-xs text-discord-channelText">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-discord-textColor">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-lg px-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 bg-transparent border-none outline-none text-discord-textColor py-3"
          />
          <button
            type="submit"
            className="ml-2 text-discord-channelText hover:text-white transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}