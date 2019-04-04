import { Completer, resolveImmediate } from "../util/okComputer";

import Palette from "./Palette";
import { T_Color } from "./structs";

// TODO: navigator.onLine
export default class BackgroundImage {
  dataUrl: string;

  vibrant: T_Color;
  muted: T_Color;
  darkVibrant: T_Color;

  static fetch(): Promise<BackgroundImage> {
    const completer = new Completer<BackgroundImage>();

    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.src = "https://source.unsplash.com/random/1600x900";
    
    img.addEventListener("load", _ => {
      resolveImmediate(() => {
        const prof = Date.now();
    
        const vibrantObj = new Palette(img);
        const swatches = vibrantObj.swatches(["Vibrant", "Muted", "DarkVibrant"]);
  
        console.log(Date.now() - prof);
        const bg: BackgroundImage = new BackgroundImage();

        bg.vibrant = swatches.Vibrant.getRgb();
        bg.muted = swatches.Muted.getRgb();       
        bg.darkVibrant = swatches.DarkVibrant.getRgb();
  
        try {
          bg.dataUrl = vibrantObj.image!.toDataUrl();
  
          console.log("fetch complete"); 
          completer.resolve(bg);
        } catch(e) {
          completer.reject(e);
        } finally {
          vibrantObj.image!.cleanup();
        }
      });
    });

    return completer.promise;
  }

  getTextColor(): string {
    const brightness = this.getBrightness(this.vibrant);
    const textColor = brightness > 0 ? "#000" : "#fff";

    return textColor;
  }

  getGradientColors(): [string, string] {
    return [
      this.toCss(this.vibrant),
      this.toCss(this.muted)
    ];
  }

  getShadowColors(): [string, string] {
    const brightness = this.getBrightness(this.darkVibrant);
    const swatch = brightness > 0 ?
        this.darken(this.darkVibrant, 0.4) :
        this.darkVibrant;

    return [
      this.toCssAlpha(swatch, 0.3),
      this.toCssAlpha(swatch, 0.2)
    ];
  }

  // css helpers

  toCss(rgb: T_Color): string {
    const [ r, g, b ] = rgb;
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  toCssAlpha(rgb: T_Color, a: number): string {
    const [ r, g, b ] = rgb;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  
  // color helpers
  
  getBrightness(swatch: T_Color): number {
    const BRIGHTNESS_THRESHOLD = 235;
    const [r, g, b] = swatch;
    
    return (0.299*r + 0.587*g + 0.114*b) - BRIGHTNESS_THRESHOLD;
  }
  
  darken(s: T_Color, percent: number): T_Color {
    return [
      s[0] - s[0] * percent,
      s[1] - s[1] * percent,
      s[2] - s[2] * percent
    ];
  }
}