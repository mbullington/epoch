export default function onDocumentReady() {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", () => resolve());
  });
}