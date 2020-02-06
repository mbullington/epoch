export default function saveDataUrl(dataUrl: string, filename: string) {
  if (browser.downloads) {

  }

  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);

  link.href = dataUrl;
  link.setAttribute("download", filename);
  link.click();

  document.body.removeChild(link);
}