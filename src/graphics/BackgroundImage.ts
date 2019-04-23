
import loadImage from "../util/loadImage";
import {toDataUrl} from "./CanvasImage";

// Global scope for node-vibrant.
declare var Vibrant: typeof import("node-vibrant/lib/browser.worker");
type Swatch = import("node-vibrant/lib/color").Swatch;

const SRC = "https://source.unsplash.com/random/1600x900";

// TODO: navigator.onLine
export default class BackgroundImage {
  dataUrl: string;

  vibrant: Swatch;
  muted: Swatch;
  darkVibrant: Swatch;

  constructor(dataUrl: string, vibrant: Swatch, muted: Swatch, darkVibrant: Swatch) {
    this.dataUrl = dataUrl;

    this.vibrant = vibrant;
    this.muted = muted;
    this.darkVibrant = darkVibrant;
  }

  static async fetch(): Promise<BackgroundImage> {
    const img = await loadImage(SRC);

    const vibrant = Vibrant
        .from(img)
        .useQuantizer(Vibrant.Quantizer.WebWorker);

    // Start web worker.
    const palettePromise = vibrant.getPalette();
    // Then convert to data URL on main thread.
    const dataUrl = toDataUrl(img);

    const palette = await palettePromise;

    return new BackgroundImage(
      dataUrl,
      palette.Vibrant!,
      palette.Muted!,
      palette.DarkVibrant!
    );
  }

  getTextColor(): string {
    const brightness = this.getBrightness(this.vibrant);
    const textColor = brightness > 0 ? "#000" : "#fff";

    return textColor;
  }

  getGradientColors(): [string, string] {
    return [
      this.toCss(this.vibrant.getRgb()),
      this.toCss(this.muted.getRgb())
    ];
  }

  getShadowColors(): [string, string] {
    const brightness = this.getBrightness(this.darkVibrant);
    const rgb = brightness > 0 ?
        this.darken(this.darkVibrant, 0.4) :
        this.darkVibrant.getRgb();
    
    return [
      this.toCssAlpha(rgb, 0.3),
      this.toCssAlpha(rgb, 0.2)
    ];
  }

  // css helpers

  toCss(rgb: [number, number, number]): string {
    const [ r, g, b ] = rgb;
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  toCssAlpha(rgb: [number, number, number], a: number): string {
    const [ r, g, b ] = rgb;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  
  // color helpers
  
  getBrightness(swatch: Swatch): number {
    const BRIGHTNESS_THRESHOLD = 235;
    const [r, g, b] = swatch.getRgb();
    
    return (0.299*r + 0.587*g + 0.114*b) - BRIGHTNESS_THRESHOLD;
  }
  
  darken(s: Swatch, percent: number): [number, number, number] {
    return [
      s[0] - s[0] * percent,
      s[1] - s[1] * percent,
      s[2] - s[2] * percent
    ];
  }
}