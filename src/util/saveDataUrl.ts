export default function saveDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");

  link.setAttribute("href", dataUrl);
  link.setAttribute("target", "_blank");
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  link.remove();
}