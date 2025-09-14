import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Download, ExternalLink } from 'lucide-react';

interface GeneratedVideoDisplayProps {
  url: string;
  prompt: string;
  videoInfo?: {
    resolution?: string;
    aspect_ratio?: string;
    num_frames?: number;
    frame_rate?: number;
  };
}

export function GeneratedVideoDisplay({ 
  url, 
  prompt, 
  videoInfo 
}: GeneratedVideoDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-video-${Date.now()}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Video Player */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-3">
        <video
          src={url}
          controls
          className="w-full h-auto max-h-64 object-contain"
          poster="" // You could add a thumbnail if available
          preload="metadata"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Info */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">
          Prompt: {prompt}
        </div>
        
        {videoInfo && (
          <div className="flex flex-wrap gap-1">
            {videoInfo.resolution && (
              <Badge variant="secondary" className="text-xs">
                {videoInfo.resolution}
              </Badge>
            )}
            {videoInfo.aspect_ratio && (
              <Badge variant="secondary" className="text-xs">
                {videoInfo.aspect_ratio}
              </Badge>
            )}
            {videoInfo.num_frames && (
              <Badge variant="secondary" className="text-xs">
                {videoInfo.num_frames} frames
              </Badge>
            )}
            {videoInfo.frame_rate && (
              <Badge variant="secondary" className="text-xs">
                {videoInfo.frame_rate} fps
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
      </div>
    </div>
  );
}
