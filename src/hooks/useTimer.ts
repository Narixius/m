import { differenceInSeconds, intervalToDuration } from "date-fns";
import { useState, useEffect } from "react";

const addLeadingZero = (digit: number = 0): string => {
  let timeStr = "";

  digit % 10 === digit ? (timeStr += `0${digit}`) : (timeStr += `${digit}`);

  return timeStr;
};

interface Stopwatch {
  current: string;
  isPaused: boolean;
  isOver: boolean;
  currentDays: number;
  currentHours: number;
  currentMinutes: number;
  currentSeconds: number;
  elapsedSeconds: number;
  pause: () => void;
  play: () => void;
  reset: () => void;
  togglePause: () => void;
}

export const useTimer = (props: {
  endDate: Date;
  onEnd?: () => void;
}): Stopwatch => {
  const [time, setTime] = useState(() =>
    differenceInSeconds(props.endDate, Date.now()) > 0
      ? intervalToDuration({
          end: props.endDate,
          start: Date.now(),
        })
      : {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
  );
  const [paused, setPaused] = useState(false);
  const divider = ":";
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }

    const interval = setInterval(() => {
      setTime(() => {
        const now = new Date();
        if (differenceInSeconds(props.endDate, now) > 0) {
          return intervalToDuration({
            end: props.endDate,
            start: Date.now(),
          });
        }

        props.onEnd?.();
        setPaused(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, paused]);

  return {
    current: `${addLeadingZero(time.hours!)}${divider}${addLeadingZero(time.minutes)}${divider}${addLeadingZero(time.seconds)}`,
    isPaused: paused,
    isOver,
    currentDays: time.days || 0,
    currentHours: time.hours || 0,
    currentMinutes: time.minutes || 0,
    currentSeconds: time.seconds || 0,
    elapsedSeconds:
      (time.days || 0) * 86400 +
      (time.hours || 0) * 3600 +
      (time.minutes || 0) * 60 +
      (time.seconds || 0),
    pause: () => setPaused(true),
    play: () => setPaused(false),
    reset: () => {
      setIsOver(false);
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    },
    togglePause: () => {
      setPaused(!paused);
    },
  };
};
