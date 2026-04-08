export default defineBackground({
  type: 'module',
  main: () => {
    const preferUhdImage = (image: Record<string, unknown>) => {
      const url = typeof image.url === 'string' ? image.url : '';
      const urlbase = typeof image.urlbase === 'string' ? image.urlbase : '';

      if (url.includes('_UHD') || !urlbase) {
        return image;
      }

      return {
        ...image,
        url: `${urlbase}_UHD.jpg`,
      };
    };

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "getBingImage") {
        const index = Number.isFinite(request.index) ? request.index : 0;

        const uhdWidth = 3840;
        const uhdHeight = 2160;
        const url = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1&uhd=1&uhdwidth=${uhdWidth}&uhdheight=${uhdHeight}`;

        fetch(url)
          .then(res => res.json())
          .then((data) => {
            const images = Array.isArray(data?.images)
              ? data.images.map(preferUhdImage)
              : data?.images;

            sendResponse({
              success: true,
              data: {
                ...data,
                images,
              },
            });
          })
          .catch(err => sendResponse({ success: false, error: err.message }));

        return true;
      }
    });
  },
});
