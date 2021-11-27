// Formatting utils.

export function toStringClock(time: number): string {
  return time > 9 ? time.toString() : `0${time}`;
}

export function hhmmFromDate(date: Date): [string, string] {
  let hours = date.getHours() % 12;
  if (hours === 0) {
    hours = 12;
  }
  const minutes = date.getMinutes();

  return [toStringClock(hours), toStringClock(minutes)];
}

// Timing utils.

export function everySecond(callback: () => void): () => void {
  let cancelled = false;
  let lastTime = 0;

  function timeLoop(now: number) {
    if (now - lastTime > 1000) {
      lastTime = now;
      callback();

      if (cancelled) {
        return;
      }
    }

    requestAnimationFrame(timeLoop);
  }

  requestAnimationFrame(timeLoop);
  callback();
  return () => (cancelled = true);
}

export function everyMinute<T>(callback: () => void): () => void {
  let cancelled = false;

  function timeLoop(duration: number) {
    setTimeout((_: number) => {
      callback();

      if (cancelled) {
        return;
      }

      const date = new Date(Date.now());
      timeLoop((60 - date.getSeconds()) * 1000);
    }, duration);
  }

  timeLoop(0);
  callback();
  return () => (cancelled = true);
}
