import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Key, Wifi, Youtube, Settings } from 'lucide-react';

type ErrorType = 'quota' | 'auth' | 'not_found' | 'network' | 'config';

interface YouTubeErrorStateProps {
  errorType: ErrorType;
  message: string;
}

const errorConfig = {
  quota: {
    icon: AlertCircle,
    title: 'Quota Limit Reached',
    color: 'text-yellow-600',
  },
  auth: {
    icon: Key,
    title: 'Authentication Error',
    color: 'text-red-600',
  },
  not_found: {
    icon: Youtube,
    title: 'Channel Not Found',
    color: 'text-orange-600',
  },
  network: {
    icon: Wifi,
    title: 'Network Error',
    color: 'text-blue-600',
  },
  config: {
    icon: Settings,
    title: 'Configuration Missing',
    color: 'text-gray-600',
  },
};

export function YouTubeErrorState({ errorType, message }: YouTubeErrorStateProps) {
  const config = errorConfig[errorType];
  const Icon = config.icon;

  return (
    <Alert variant="destructive" className="border-l-4">
      <Icon className={`h-4 w-4 ${config.color}`} />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
