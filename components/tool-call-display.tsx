import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  ImageIcon, 
  Search, 
  Globe, 
  FileText,
  Code,
  Languages,
  BarChart3,
  Play
} from 'lucide-react';
import { GeneratedImageDisplay } from './generated-image-display';

interface ToolCallDisplayProps {
  toolName: string;
  purpose: string;
  status: 'pending' | 'completed' | 'error';
  args?: any;
  result?: any;
  error?: string;
  startTime?: number;
  duration?: number;
}

const TOOL_ICONS: Record<string, React.ElementType> = {
  navigate_to_page: ExternalLink,
  createImage: ImageIcon,
  search: Search,
  youtubeSearch: Play,
  webSearch: Globe,
  urlContext: Globe,
  imageAnalysis: ImageIcon,
  videoGeneration: Play,
  dataVisualization: BarChart3,
  documentAnalysis: FileText,
  translation: Languages,
  codeGeneration: Code,
  textSummary: FileText,
  sentimentAnalysis: BarChart3,
  extract_url: Globe,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'completed':
      return 'bg-green-50 border-green-200 text-green-700';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-700';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Loader2 className="h-4 w-4 animate-spin" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'error':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Loader2 className="h-4 w-4" />;
  }
};

export function ToolCallDisplay({ 
  toolName, 
  purpose, 
  status, 
  args, 
  result, 
  error, 
  startTime, 
  duration 
}: ToolCallDisplayProps) {
  const IconComponent = TOOL_ICONS[toolName] || Code;
  const statusColor = getStatusColor(status);
  const StatusIcon = getStatusIcon(status);

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatArgs = (args: any) => {
    if (!args) return '';
    if (typeof args === 'string') return args;
    if (args.query) return args.query;
    if (args.prompt) return args.prompt;
    if (args.url) return args.url;
    if (args.urls && Array.isArray(args.urls)) return args.urls.join(', ');
    return JSON.stringify(args, null, 2);
  };

  return (
    <div className={`mt-3 p-3 rounded-lg border-2 ${statusColor} transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{toolName}</div>
            <div className="text-xs opacity-80 truncate">{purpose}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {duration && (
            <Badge variant="outline" className="text-xs">
              {formatDuration(duration)}
            </Badge>
          )}
          <div className="flex items-center gap-1">
            {StatusIcon}
            <Badge 
              variant={status === 'error' ? 'destructive' : status === 'completed' ? 'default' : 'secondary'}
              className="text-xs capitalize"
            >
              {status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Arguments/Input */}
      {args && (
        <div className="mb-2">
          <div className="text-xs font-medium opacity-75 mb-1">Input:</div>
          <div className="text-xs bg-black/5 rounded p-2 font-mono max-h-20 overflow-y-auto">
            {formatArgs(args)}
          </div>
        </div>
      )}

      {/* Result */}
      {status === 'completed' && result && (
        <div className="mb-2">
          {toolName === 'createImage' && result.type === 'image' && result.url ? (
            <GeneratedImageDisplay
              url={result.url}
              prompt={result.prompt || 'Generated image'}
              uploadInfo={result.uploadInfo}
            />
          ) : (
            <>
              <div className="text-xs font-medium opacity-75 mb-1">Result:</div>
              <div className="text-xs bg-black/5 rounded p-2">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {status === 'error' && error && (
        <div className="mb-2">
          <div className="text-xs font-medium opacity-75 mb-1">Error:</div>
          <div className="text-xs bg-red-100 text-red-800 rounded p-2">
            {error}
          </div>
        </div>
      )}

      {/* Progress indicator for pending status */}
      {status === 'pending' && (
        <div className="mt-2">
          <div className="h-1 bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-current rounded-full animate-pulse w-1/3"></div>
          </div>
        </div>
      )}
    </div>
  );
}