export const BING_IMAGE_COUNT = 8;

export interface NextBingBackgroundOptions {
  currentIndex: number;
  currentUrl: string;
  fetchImageUrl: (index: number) => Promise<string>;
}

export interface NextBingBackgroundResult {
  index: number;
  url: string;
}

export const getNextBingBackground = async ({
  currentIndex,
  currentUrl,
  fetchImageUrl,
}: NextBingBackgroundOptions): Promise<NextBingBackgroundResult | null> => {
  for (let offset = 1; offset <= BING_IMAGE_COUNT; offset += 1) {
    const index = (currentIndex + offset) % BING_IMAGE_COUNT;
    const url = await fetchImageUrl(index);

    if (url !== currentUrl) {
      return { index, url };
    }
  }

  return null;
};
