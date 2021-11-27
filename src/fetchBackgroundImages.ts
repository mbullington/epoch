const PARAMS = Object.entries({
  // Right now this key only allows 50 images an hour, barely enough for myself!
  // Please get your own!
  client_id: "y9rCIMBNIqVnQV9bUgWMtXWFgXux2qJai5XRclAC9Wc",
  // Unsplash Editorial.
  collections: "317099",
  count: 2,
})
  .map(([key, value]) => `${key}=${value}`)
  .join("&");

const URL = `https://api.unsplash.com/photos/random?${PARAMS}`;

interface APIItem {
  urls: {
    full: string;
  };
}

const STORAGE_KEY = "stored URL";
const TIMESTAMP_KEY = "timestamp URL";

export async function fetchBackgroundImages(): Promise<string> {
  const timestamp = parseFloat(localStorage.getItem(TIMESTAMP_KEY));
  const isTimeForRefresh = Date.now() - timestamp > 1000 * 120;

  const storedImage = localStorage.getItem(STORAGE_KEY);
  if (storedImage && !isTimeForRefresh) {
    return storedImage;
  }

  /**
   * If offline return one of three offline images.
   *
   * I think {@link https://github.com/lgorence} shot all of these
   * photos, can't remember.
   */
  if (!navigator.onLine) {
    return `/images/offline_${Math.floor(Math.random() * 3) + 1}.jpg`;
  }

  const promise = Promise.resolve().then(async () => {
    const response = await fetch(URL);
    const [current, prefetch] = (await response.json()) as APIItem[];

    // Have the browser fetch the next image in the background.
    const linkPrefetch = document.createElement("link");
    linkPrefetch.rel = "prefetch";
    linkPrefetch.href = prefetch.urls.full;
    document.head.appendChild(linkPrefetch);

    localStorage.setItem(STORAGE_KEY, prefetch.urls.full);
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());

    return current.urls.full;
  });

  if (!storedImage) {
    return await promise;
  }

  return storedImage;
}
