import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, ExternalLink, Download } from 'lucide-react';

interface GeneratedImageDisplayProps {
  url: string;
  prompt: string;
  uploadInfo?: {
    id: string;
    title: string;
    size: number;
  };
}

export function GeneratedImageDisplay({ url, prompt, uploadInfo }: GeneratedImageDisplayProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-image-${uploadInfo?.id || Date.now()}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="mt-3 overflow-hidden border-2 border-blue-200 bg-blue-50">
      {/* Header */}
      <div className="p-3 bg-blue-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-700" />
            <span className="font-medium text-sm text-blue-800">Generated Image</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-1 rounded hover:bg-blue-200 text-blue-700 transition-colors"
              title="Download image"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="p-1 rounded hover:bg-blue-200 text-blue-700 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="p-3">
        <img
          src={url}
          alt={prompt}
          className="w-full rounded-lg shadow-md border border-blue-200 max-h-96 object-contain bg-white"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded';
            errorDiv.textContent = 'Failed to load image';
            target.parentNode?.appendChild(errorDiv);
          }}
        />
      </div>

      {/* Image Info */}
      <div className="px-3 pb-3">
        <div className="text-xs font-medium text-blue-700 mb-1">Prompt:</div>
        <div className="text-xs text-blue-800 bg-blue-100 rounded p-2 mb-2">
          {prompt}
        </div>
        
        {uploadInfo && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Badge variant="outline" className="text-xs">
              {formatFileSize(uploadInfo.size)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ID: {uploadInfo.id}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}