import { useTranslation } from 'react-i18next';
import type { ConnectionStatus as ConnectionStatusType } from '../types';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const { t } = useTranslation();
  const statusConfig = {
    connecting: { color: 'bg-yellow-500', text: t('connection.connecting'), animate: true },
    connected: { color: 'bg-green-500', text: t('connection.connected'), animate: false },
    disconnected: { color: 'bg-red-500', text: t('connection.disconnected'), animate: false },
    reconnecting: { color: 'bg-orange-500', text: t('connection.reconnecting'), animate: true },
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
