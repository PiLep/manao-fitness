import { Pause, Play, SkipForward } from 'lucide-react';

interface TimerDisplayProps {
  timeRemaining: number;
  progress: number;
  label: string;
  onPause: () => void;
  onSkip: () => void;
  isPaused: boolean;
}

export function TimerDisplay({ 
  timeRemaining, 
  progress, 
  label, 
  onPause, 
  onSkip,
  isPaused 
}: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const circumference = 283; // 2 * π * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="text-center">
      {/* Circular Timer */}
      <div className="relative w-24 h-24 mx-auto mb-3">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="#E5E7EB" 
            strokeWidth="8" 
            fill="none"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="hsl(var(--primary))" 
            strokeWidth="8" 
            fill="none" 
            strokeLinecap="round" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="timer-circle"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex justify-center space-x-3">
        <button 
          onClick={onPause}
          className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
        <button 
          onClick={onSkip}
          className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
