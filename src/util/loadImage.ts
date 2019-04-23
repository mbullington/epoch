export default function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.addEventListener("load", () => resolve(img));

    img.addEventListener("error", (err) => reject(err));
  });
}