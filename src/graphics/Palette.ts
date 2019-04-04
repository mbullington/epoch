// @ts-ignore
import RgbQuant from "rgbquant";

import { Swatch, CanvasImage, hslToRgb, rgbToHsl } from "./structs";

const TARGET_DARK_LUMA = 0.26;
const MAX_DARK_LUMA = 0.45;
const MIN_LIGHT_LUMA = 0.55;
const TARGET_LIGHT_LUMA = 0.74;

const MIN_NORMAL_LUMA = 0.3;
const TARGET_NORMAL_LUMA = 0.5;
const MAX_NORMAL_LUMA = 0.7;

const TARGET_MUTED_SATURATION = 0.3;
const MAX_MUTED_SATURATION = 0.4;

const TARGET_VIBRANT_SATURATION = 1;
const MIN_VIBRANT_SATURATION = 0.35;

const WEIGHT_SATURATION = 3;
const WEIGHT_LUMA = 6;
const WEIGHT_POPULATION = 1;

interface I_Definition {
  name: string;
  luma: {
    target: number;
    min: number;
    max: number;
  }
  sat: {
    target: number;
    min: number;
    max: number;
  }
}

const DEFINITIONS: I_Definition[] = [
  {
    name: "Vibrant",
    luma: {
      target: TARGET_NORMAL_LUMA,
      min: MIN_NORMAL_LUMA,
      max: MAX_NORMAL_LUMA
    },
    sat: {
      target: TARGET_VIBRANT_SATURATION,
      min: MIN_VIBRANT_SATURATION,
      max: 1
    }
  },
  {
    name: "LightVibrant",
    luma: {
      target: TARGET_LIGHT_LUMA,
      min: MIN_LIGHT_LUMA,
      max: 1
    },
    sat: {
      target: TARGET_VIBRANT_SATURATION,
      min: MIN_VIBRANT_SATURATION,
      max: 1
    }
  },
  {
    name: "DarkVibrant",
    luma: {
      target: TARGET_DARK_LUMA,
      min: 0,
      max: MAX_DARK_LUMA
    },
    sat: {
      target: TARGET_VIBRANT_SATURATION,
      min: MIN_VIBRANT_SATURATION,
      max: 1
    }
  },
  {
    name: "Muted",
    luma: {
      target: TARGET_NORMAL_LUMA,
      min: MIN_NORMAL_LUMA,
      max: MAX_NORMAL_LUMA
    },
    sat: {
      target: TARGET_MUTED_SATURATION,
      min: 0,
      max: MAX_MUTED_SATURATION
    }
  },
  {
    name: "LightMuted",
    luma: {
      target: TARGET_LIGHT_LUMA,
      min: MIN_LIGHT_LUMA,
      max: 1
    },
    sat: {
      target: TARGET_MUTED_SATURATION,
      min: 0,
      max: MAX_MUTED_SATURATION
    }
  },
  {
    name: "DarkMuted",
    luma: {
      target: TARGET_DARK_LUMA,
      min: 0,
      max: MAX_DARK_LUMA
    },
    sat: {
      target: TARGET_MUTED_SATURATION,
      min: 0,
      max: MAX_MUTED_SATURATION
    }
  }
];

export default class Palette {
  _swatches: Swatch[];

  maxPopulation: number;
  image?: CanvasImage;

  constructor(sourceImage: HTMLImageElement, colorCount?: number, quality?: number) {
    colorCount = colorCount || 16;
    quality = quality || 5;

    this._swatches = [];

    const image = new CanvasImage(sourceImage);
    try {
      const imageData = image.getImageData();
      const pixels = imageData.data;
      const pixelCount = image.getPixelCount();

      const allPixels = [];
      let i = 0;
      while (i < pixelCount) {
        const offset = i * 4;
        const r = pixels[offset + 0];
        const g = pixels[offset + 1];
        const b = pixels[offset + 2];
        const a = pixels[offset + 3];
        // If pixel is mostly opaque and not white
        if (a >= 125) {
          if (!(r > 250 && g > 250 && b > 250)) {
            allPixels.push([r, g, b]);
          }
        }
        i = i + quality;
      }

      const q = new RgbQuant({colors: colorCount});
      q.sample(imageData);

      const palette = q.palette(true, true);

      this._swatches = palette.map((rgb, i) => new Swatch(rgb, palette.length - i));
      this.maxPopulation = this.findMaxPopulation();
      // Clean up
    } catch(e) {
      console.log(e);
    } finally {
      this.image = image;
    }
  }

  swatches(swatchArr: string[]) {
    return this.findSwatches(DEFINITIONS.filter(def => swatchArr.includes(def.name)));
  }

  findSwatches(definitions: I_Definition[]): {[key: string]: Swatch} {
    const swatches: Swatch[] = [];
    const returnObj: {[key: string]: Swatch} = {};

    definitions.forEach(def => {
      let max: Swatch;
      let maxValue = 0;

      this._swatches.forEach(swatch => {
        const [_, sat, luma] = swatch.getHsl();

        if (
          luma >= def.luma.min &&
          luma <= def.luma.max &&
          sat >= def.sat.min &&
          sat <= def.sat.max &&
          !swatches.includes(swatch)
        ) {
          const value = this.createComparisonValue(
            def,
            sat,
            luma,
            swatch.getPopulation(),
            this.maxPopulation
          );

          if (max === undefined || value > maxValue) {
            max = swatch;
            maxValue = value;
          }
        }
      });

      swatches.push(max!);
      returnObj[def.name] = max!;
    });

    if (!returnObj.Vibrant && returnObj.DarkVibrant) {
      // If we do not have a vibrant color...
      // ...but we do have a dark vibrant, generate the value by modifying the luma
      const hsl = returnObj.DarkVibrant.getHsl();
      hsl[2] = TARGET_NORMAL_LUMA;
      returnObj.Vibrant = new Swatch(hslToRgb([hsl[0], hsl[1], hsl[2]]), 0);
    }

    // hack for if there is neither DarkVibrant or Vibrant
    if (!returnObj.Vibrant && returnObj.Muted) {
      const hsl = returnObj.Muted.getHsl();
      hsl[1] = TARGET_VIBRANT_SATURATION;
      returnObj.Vibrant = new Swatch(hslToRgb([hsl[0], hsl[1], hsl[2]]), 0);
    }

    if (!returnObj.DarkVibrant && returnObj.Vibrant) {
      // If we do not have a vibrant color...
      // ...but we do have a dark vibrant, generate the value by modifying the luma
      const hsl = returnObj.Vibrant.getHsl();
      hsl[2] = TARGET_DARK_LUMA;
      returnObj.DarkVibrant = new Swatch(hslToRgb([hsl[0], hsl[1], hsl[2]]), 0);
    }

    return returnObj;
  }

  findMaxPopulation(): number {
    let population = 0;
    this._swatches.forEach(swatch => {
      population = Math.max(population, swatch.getPopulation());
    });
    return population;
  }

  createComparisonValue(def: I_Definition, saturation: number, luma: number, population: number, maxPopulation: number): number {
    return this.weightedMean([
      this.invertDiff(saturation, def.sat.target),
      WEIGHT_SATURATION,
      this.invertDiff(luma, def.luma.target),
      WEIGHT_LUMA,
      population / maxPopulation,
      WEIGHT_POPULATION
    ]);
  }

  invertDiff(value: number, targetValue: number): number {
    return 1 - Math.abs(value - targetValue);
  }

  weightedMean(values: number[]): number {
    let sum = 0;
    let sumWeight = 0;
    let i = 0;
    while (i < values.length) {
      const value = values[i];
      const weight = values[i + 1];
      sum += value * weight;
      sumWeight += weight;
      i += 2;
    }
    return sum / sumWeight;
  }
}