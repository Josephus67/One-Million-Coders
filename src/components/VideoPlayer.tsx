"use client";

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Play, 
  CheckCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Lesson } from '../types/course';

interface VideoPlayerProps {
  lesson: Lesson;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({ 
  lesson, 
  onProgress, 
  onComplete, 
  autoPlay = false,
  className = '' 
}: VideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(lesson.isCompleted);
  const [watchProgress, setWatchProgress] = useState(lesson.watchProgress || 0);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    setWatchProgress(100);
    onProgress?.(100);
    onComplete?.();
  };

  const handleProgressUpdate = (progress: number) => {
    const newProgress = Math.min(progress, 100);
    setWatchProgress(newProgress);
    onProgress?.(newProgress);
    
    // Auto-complete if watched 90% or more
    if (newProgress >= 90 && !isCompleted) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(lesson.videoUrl || '');
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0` : lesson.videoUrl || '';

  // YouTube video fallback function
  const getDefaultVideoForLesson = (lesson: Lesson) => {
    const lessonTitle = lesson.title.toLowerCase();
    
    // Programming basics fallbacks
    if (lessonTitle.includes('html') || lessonTitle.includes('web structure')) {
      return 'https://www.youtube.com/watch?v=UB1O30fR-EE';
    }
    if (lessonTitle.includes('css') || lessonTitle.includes('styling')) {
      return 'https://www.youtube.com/watch?v=yfoY53QXEnI';
    }
    if (lessonTitle.includes('javascript') || lessonTitle.includes('js')) {
      return 'https://www.youtube.com/watch?v=W6NZfCO5SIk';
    }
    if (lessonTitle.includes('react') || lessonTitle.includes('components')) {
      return 'https://www.youtube.com/watch?v=bMknfKXIFA8';
    }
    if (lessonTitle.includes('python') || lessonTitle.includes('programming fundamentals')) {
      return 'https://www.youtube.com/watch?v=rfscVS0vtbw';
    }
    if (lessonTitle.includes('responsive') || lessonTitle.includes('mobile')) {
      return 'https://www.youtube.com/watch?v=srvUrASNdFs';
    }
    if (lessonTitle.includes('function') || lessonTitle.includes('control')) {
      return 'https://www.youtube.com/watch?v=N8ap4k_1QEQ';
    }
    if (lessonTitle.includes('dom') || lessonTitle.includes('manipulation')) {
      return 'https://www.youtube.com/watch?v=0ik6X4DJKCc';
    }
    
    // Default programming introduction video
    return 'https://www.youtube.com/watch?v=zOjov-2OZ0E';
  };

  // Use fallback video if no videoUrl provided
  const finalVideoUrl = lesson.videoUrl || getDefaultVideoForLesson(lesson);
  const finalVideoId = getYouTubeVideoId(finalVideoUrl);
  const finalEmbedUrl = finalVideoId ? `https://www.youtube.com/embed/${finalVideoId}?rel=0&modestbranding=1&showinfo=0` : '';

  // If still no valid video URL after fallback
  if (!finalEmbedUrl) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center p-6">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Video Content Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're preparing quality video content for this lesson. In the meantime, you can review the lesson content below and mark your progress.
            </p>
            {lesson.content && (
              <div className="text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">{lesson.content}</p>
              </div>
            )}
            <div className="flex justify-center space-x-2">
              <Button
                onClick={() => handleProgressUpdate(Math.min((watchProgress || 0) + 25, 100))}
                variant="outline"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Mark 25% Progress
              </Button>
              <Button
                onClick={handleMarkComplete}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden bg-black ${className}`}>
      <div className="relative aspect-video group">
        {/* YouTube iframe embed */}
        <iframe
          src={finalEmbedUrl}
          title={lesson.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Progress overlay */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isCompleted && (
                <Badge className="bg-green-600 text-white shadow-lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed
                </Badge>
              )}
              {(watchProgress || 0) > 0 && !isCompleted && (
                <Badge className="bg-blue-600 text-white shadow-lg">
                  {watchProgress || 0}% watched
                </Badge>
              )}
              {!lesson.videoUrl && (
                <Badge className="bg-yellow-600 text-white shadow-lg">
                  Fallback Video
                </Badge>
              )}
            </div>
            
            <Button
              onClick={() => finalVideoUrl && window.open(finalVideoUrl, '_blank')}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 shadow-lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in YouTube
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson Info and Controls */}
      <div className="p-6 bg-white space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{lesson.description}</p>
          </div>
          <div className="text-right text-sm text-gray-500 ml-4">
            <div className="font-medium">Duration: {formatTime(typeof lesson.duration === 'string' 
              ? parseInt(lesson.duration) || 0 
              : lesson.duration || 0)}</div>
            {(watchProgress || 0) > 0 && (
              <div className="text-blue-600 font-medium mt-1">
                {watchProgress || 0}% watched
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-blue-600">{watchProgress || 0}%</span>
          </div>
          <Progress value={watchProgress || 0} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleProgressUpdate(Math.min((watchProgress || 0) + 25, 100))}
              variant="outline"
              size="sm"
              disabled={(watchProgress || 0) >= 100}
            >
              <Play className="w-4 h-4 mr-2" />
              Add 25% Progress
            </Button>
            
            <Button
              onClick={() => handleProgressUpdate(Math.min((watchProgress || 0) + 50, 100))}
              variant="outline"
              size="sm"
              disabled={(watchProgress || 0) >= 100}
            >
              <Play className="w-4 h-4 mr-2" />
              Add 50% Progress
            </Button>
          </div>

          {!isCompleted && (
            <Button
              onClick={handleMarkComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}