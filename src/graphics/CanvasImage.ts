/*
  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
  Stolen from https://github.com/lokesh/color-thief
*/
export default class CanvasImage {
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

export function toDataUrl(image: HTMLImageElement): string {
  const canvas = new CanvasImage(image);
  const str = canvas.toDataUrl();
  canvas.cleanup();

  return str;
}