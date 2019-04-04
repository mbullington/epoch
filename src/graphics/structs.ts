// types

export interface T_Color extends Array<number> {
  0: number;
  1: number;
  2: number;
  offset?: number;
}

// functions

export function rgbToHsl(rgb: T_Color): T_Color {
  let [r, g, b] = rgb;

  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

export function hslToRgb(hsl: T_Color): T_Color {
  let [h, s, l] = hsl;

  let r;
  let g;
  let b;

  const hue2rgb = function (p: number, q: number, t: number): number {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  };

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

// classes

export class Swatch {
  yiq: number;
  rgb: T_Color;
  population: number;
  hsl?: T_Color;

  constructor(rgb: T_Color, population: number) {
    this.yiq = 0;
    this.rgb = [
      Math.round(rgb[0]),
      Math.round(rgb[1]),
      Math.round(rgb[2])
    ];
    
    this.population = population || 1;
  }

  getHsl(): T_Color {
    return this.hsl || (this.hsl = rgbToHsl(this.rgb));
  }

  getPopulation(): number {
    return this.population;
  }

  getRgb(): T_Color {
    return this.rgb;
  }

  getHex(): string {
    return `#${(
      (1 << 24) +
      (this.rgb[0] << 16) +
      (this.rgb[1] << 8) +
      this.rgb[2]
    )
      .toString(16)
      .slice(1, 7)}`;
  }

  getTitleTextColor(): string {
    this._ensureTextColors();
    if (this.yiq < 186) {
      return "#fff";
    } else {
      return "#000";
    }
  }

  getBodyTextColor(): string {
    this._ensureTextColors();
    if (this.yiq < 150) {
      return "#fff";
    } else {
      return "#000";
    }
  }

  _ensureTextColors(): number {
    return (
      this.yiq ||
      (this.yiq = (this.rgb[0] * 299 + this.rgb[1] * 587 + this.rgb[2] * 114) / 1000)
    );
  }
}

/*
  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
  Stolen from https://github.com/lokesh/color-thief
*/
export class CanvasImage {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  width: number;
  height: number;

  constructor(image: HTMLImageElement) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;

    document.body.appendChild(this.canvas);

    this.width = this.canvas.width = image.width;
    this.height = this.canvas.height = image.height;

    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  clear() {
    return this.context.clearRect(0, 0, this.width, this.height);
  }

  getPixelCount(): number {
    return this.width * this.height;
  }

  getImageData(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  toDataUrl(): string {
    return this.canvas.toDataURL("image/webp", 0.92);
  }

  cleanup(): HTMLCanvasElement | null {
    if (!this.canvas.parentNode) {
      return null;
    }
    return this.canvas.parentNode.removeChild(this.canvas);
  }
}