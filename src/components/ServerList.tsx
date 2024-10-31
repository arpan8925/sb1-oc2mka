import React from 'react';
import { Home, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export function ServerList() {
  return (
    <div className="w-18 bg-discord-serversBg flex flex-col items-center py-3 space-y-2">
      <button className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center bg-discord-channelsBg text-discord-primary',
        'hover:rounded-2xl transition-all duration-200 ease-in-out'
      )}>
        <Home className="w-7 h-7" />
      </button>
      
      <div className="w-8 h-0.5 bg-gray-700 rounded-full mx-auto" />
      
      <button className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center bg-gray-700 text-discord-green',
        'hover:rounded-2xl transition-all duration-200 ease-in-out hover:bg-discord-green hover:text-white'
      )}>
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}