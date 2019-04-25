export function toStringClock(time: number): string {
  return time > 9 ? time.toString() : `0${time}`;
}

export function hhmmFromDate(date: Date): [string, string] {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return [
    toStringClock(hours),
    toStringClock(minutes)
  ];
}
