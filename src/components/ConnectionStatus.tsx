import type { ConnectionStatus as ConnectionStatusType } from '../types';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const statusConfig = {
    connecting: { color: 'bg-yellow-500', text: 'Connecting...', animate: true },
    connected: { color: 'bg-green-500', text: 'Connected', animate: false },
    disconnected: { color: 'bg-red-500', text: 'Disconnected', animate: false },
    reconnecting: { color: 'bg-orange-500', text: 'Reconnecting...', animate: true },
  };

  const config = statusConfig[status];

  return (
    <div className="absolute top-5 left-5 bg-white px-4 py-3 rounded-xl shadow-md z-[1000] flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${config.color} ${config.animate ? 'animate-pulse' : ''}`}
        />
        <span className="text-xs font-medium text-gray-700">{config.text}</span>
      </div>
    </div>
  );
}
