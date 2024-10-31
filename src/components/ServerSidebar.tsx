import React, { useState } from 'react';
import { Hash, Volume2, Plus, Mic, MicOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { voiceChat } from '../lib/voiceChat';
import { VoiceChannelModal } from './VoiceChannelModal';

export function ServerSidebar() {
  const { channels, selectedChannel, setSelectedChannel, currentUser } = useStore();
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<string | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const handleVoiceChannelClick = async (channelId: string) => {
    if (activeVoiceChannel === channelId) {
      voiceChat.leaveVoiceChannel();
      setActiveVoiceChannel(null);
      setShowVoiceModal(false);
    } else {
      if (activeVoiceChannel) {
        voiceChat.leaveVoiceChannel();
      }
      await voiceChat.joinVoiceChannel(channelId);
      setActiveVoiceChannel(channelId);
      setShowVoiceModal(true);
    }
    setSelectedChannel(channelId);
  };

  return (
    <>
      <div className="w-60 bg-discord-channelsBg flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">StackBlitz Server</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <div className="text-discord-channelText uppercase text-xs font-semibold mb-1 px-2">
              Text Channels
            </div>
            {channels
              .filter((channel) => channel.type === 'text')
              .map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={cn(
                    'w-full flex items-center px-2 py-1 rounded text-discord-channelText hover:bg-gray-700 hover:text-gray-100 transition-colors',
                    selectedChannel === channel.id && 'bg-gray-700 text-white'
                  )}
                >
                  <Hash className="w-5 h-5 mr-2" />
                  {channel.name}
                </button>
              ))}
          </div>
          
          <div>
            <div className="text-discord-channelText uppercase text-xs font-semibold mb-1 px-2">
              Voice Channels
            </div>
            {channels
              .filter((channel) => channel.type === 'voice')
              .map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleVoiceChannelClick(channel.id)}
                  className={cn(
                    'w-full flex items-center px-2 py-1 rounded text-discord-channelText hover:bg-gray-700 hover:text-gray-100 transition-colors group',
                    selectedChannel === channel.id && 'bg-gray-700 text-white'
                  )}
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  <span className="flex-1 text-left">{channel.name}</span>
                  {activeVoiceChannel === channel.id ? (
                    <Mic className="w-4 h-4 text-discord-green" />
                  ) : (
                    <MicOff className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button className="w-full flex items-center justify-center px-2 py-1 rounded bg-discord-primary hover:bg-discord-primary/90 text-white transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Create Channel
          </button>
        </div>
      </div>

      {showVoiceModal && activeVoiceChannel && (
        <VoiceChannelModal
          channelId={activeVoiceChannel}
          onClose={() => {
            setShowVoiceModal(false);
            voiceChat.leaveVoiceChannel();
            setActiveVoiceChannel(null);
          }}
        />
      )}
    </>
  );
}