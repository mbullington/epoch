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
  return () => (cancelled = true);
}