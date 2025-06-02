import { useState, useEffect, useCallback } from 'react';

// Sound utility function
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Audio not supported or blocked');
  }
};

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
            playNotificationSound();
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
