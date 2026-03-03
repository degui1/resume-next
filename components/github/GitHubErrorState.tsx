import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Key, Wifi, Github, Settings } from 'lucide-react';

type ErrorType = 'rate_limit' | 'auth' | 'not_found' | 'network' | 'config';

interface GitHubErrorStateProps {
  message: string;
  errorType?: ErrorType;
}

const errorConfig = {
  rate_limit: {
    icon: AlertCircle,
    title: 'Rate Limit Exceeded',
    color: 'text-yellow-600',
  },
  auth: {
    icon: Key,
    title: 'Authentication Error',
    color: 'text-red-600',
  },
  not_found: {
    icon: Github,
    title: 'Repository Not Found',
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

function getErrorType(message: string): ErrorType {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('rate limit')) return 'rate_limit';
  if (lowerMessage.includes('authentication') || lowerMessage.includes('token')) return 'auth';
  if (lowerMessage.includes('not found') || lowerMessage.includes('404')) return 'not_found';
  if (lowerMessage.includes('configured') || lowerMessage.includes('username')) return 'config';
  
  return 'network';
}

export function GitHubErrorState({ message, errorType }: GitHubErrorStateProps) {
  const type = errorType || getErrorType(message);
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <Alert variant="destructive" className="border-l-4">
      <Icon className={`h-4 w-4 ${config.color}`} />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
