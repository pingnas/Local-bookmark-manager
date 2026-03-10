export default defineBackground({
  type: 'module',
  main: () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "getBingImage") {
        const index = Number.isFinite(request.index) ? request.index : 0;

        const url = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1&uhd=1`;

        fetch(url)
          .then(res => res.json())
          .then(data => sendResponse({ success: true, data }))
          .catch(err => sendResponse({ success: false, error: err.message }));

        return true;
      }
    });
  },
});
