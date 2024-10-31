import React, { useState, useEffect } from 'react';
import { Mic, MicOff, PhoneOff, Settings, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateAvatarUrl } from '../lib/utils';
import { voiceChat } from '../lib/voiceChat';

interface VoiceChannelModalProps {
  channelId: string;
  onClose: () => void;
}

export function VoiceChannelModal({ channelId, onClose }: VoiceChannelModalProps) {
  const { users, channels, currentUser } = useStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');
  const [selectedOutputDevice, setSelectedOutputDevice] = useState<string>('');

  const channel = channels.find((c) => c.id === channelId);
  const connectedUsers = users.filter((user) => 
    channel?.participants.includes(user.id)
  );

  useEffect(() => {
    const loadDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
      setAudioDevices([...audioInputs, ...audioOutputs]);
    };

    loadDevices();
  }, []);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    voiceChat.toggleMute();
  };

  const handleDeafenToggle = () => {
    setIsDeafened(!isDeafened);
    voiceChat.toggleDeafen();
  };

  const handleDisconnect = () => {
    voiceChat.leaveVoiceChannel();
    onClose();
  };

  const handleDeviceChange = async (deviceId: string, type: 'input' | 'output') => {
    if (type === 'input') {
      setSelectedInputDevice(deviceId);
      await voiceChat.changeAudioDevice(deviceId, 'input');
    } else {
      setSelectedOutputDevice(deviceId);
      await voiceChat.changeAudioDevice(deviceId, 'output');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-discord-background rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            {channel?.name}
          </h2>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {/* Connected Users */}
            <div className="space-y-2">
              {connectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 rounded bg-gray-700/50"
                >
                  <div className="relative">
                    <img
                      src={generateAvatarUrl(user.id)}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {user.isSpeaking && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-discord-green rounded-full border-2 border-discord-background animate-pulse" />
                    )}
                  </div>
                  <span className="ml-3 text-white">{user.name}</span>
                  {user.id === currentUser?.id && (
                    <span className="ml-2 text-xs text-discord-green">(you)</span>
                  )}
                  {user.isMuted && (
                    <MicOff className="w-4 h-4 ml-auto text-red-500" />
                  )}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleMuteToggle}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleDeafenToggle}
                className={`p-3 rounded-full ${
                  isDeafened ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isDeafened ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleDisconnect}
                className="p-3 rounded-full bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Input Device
                  </label>
                  <select
                    value={selectedInputDevice}
                    onChange={(e) => handleDeviceChange(e.target.value, 'input')}
                    className="w-full bg-gray-600 text-white rounded px-3 py-2"
                  >
                    {audioDevices
                      .filter((device) => device.kind === 'audioinput')
                      .map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone ${device.deviceId}`}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Output Device
                  </label>
                  <select
                    value={selectedOutputDevice}
                    onChange={(e) => handleDeviceChange(e.target.value, 'output')}
                    className="w-full bg-gray-600 text-white rounded px-3 py-2"
                  >
                    {audioDevices
                      .filter((device) => device.kind === 'audiooutput')
                      .map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Speaker ${device.deviceId}`}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}