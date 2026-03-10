export const fetchBingImageUrl = (index: number) => {
    return new Promise<string>((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getBingImage", index }, (response) => {
            if (response?.success) {
                resolve(`https://www.bing.com${response.data.images[0].url}`);
            } else {
                reject(response?.error ?? 'Unknown error');
            }
        });
    });
};
