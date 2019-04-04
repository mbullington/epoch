export function digitToString(time: number): string {
  return time > 9 ? time.toString() : `0${time}`;
}

export function hhmmFromDate(date: Date): [string, string] {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return [
    digitToString(hours),
    digitToString(minutes)
  ];
}

export function everySecond(callback: Function): Function {
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
  return () => (cancelled = true);  
}

export function everyMinute(callback: Function): Function {
  let cancelled = false;  
  function timeLoop(duration: number) {
    setTimeout(_ => {
      callback();

      if (cancelled) {
        return;
      }

      const date = new Date(Date.now());
      timeLoop((60 - date.getSeconds()) * 1000);
    }, duration);
  }

  timeLoop(0);
  return () => (cancelled = true);
}