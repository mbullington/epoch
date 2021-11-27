import "../styles/main.scss";

import { fetchBackgroundImages } from "./fetchBackgroundImages";
import { everyMinute, everySecond, hhmmFromDate } from "./util";

const nodes = {
  background: document.querySelector<HTMLImageElement>(".background"),
  container: document.querySelector<HTMLElement>(".container"),
  hours: document.querySelector<HTMLElement>(".hours"),
  minutes: document.querySelector<HTMLElement>(".minutes"),
  dividerChildList: document.querySelectorAll(".divider-child"),
};

everySecond(() => {
  // Enable/disable divider.
  nodes.dividerChildList.forEach((el) => {
    if (!el.classList.contains("dim")) {
      el.classList.add("dim");
    } else {
      el.classList.remove("dim");
    }
  });
});

everyMinute(() => {
  const date = new Date(Date.now());
  const [hours, minutes] = hhmmFromDate(date);

  // Update clock.
  nodes.hours.innerHTML = hours;
  nodes.minutes.innerHTML = minutes;
});

fetchBackgroundImages().then((image: string) => {
  nodes.background.src = image;
});
