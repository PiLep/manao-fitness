import { useState, useEffect, useCallback } from 'react';

export interface TimerState {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  progress: number;
}

export function useTimer(initialTime: number, onComplete?: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalTime, setTotalTime] = useState(initialTime);

  const start = useCallback((duration?: number) => {
    const time = duration || initialTime;
    setTimeRemaining(time);
    setTotalTime(time);
    setIsActive(true);
    setIsPaused(false);
  }, [initialTime]);

  const pause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(initialTime);
  }, [initialTime]);

  const skip = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(0);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsPaused(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeRemaining, onComplete]);

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeRemaining,
    isActive,
    isPaused,
    progress,
    formattedTime: formatTime(timeRemaining),
    start,
    pause,
    stop,
    skip
  };
}
