export default defineBackground({
  type: 'module',
  main: () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "getBingImage") {
        // 生成 0 到 15 之间的随机整数
        const randomIndex = Math.floor(Math.random() * 8);

        const url = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${randomIndex}&n=1&uhd=1`;

        fetch(url)
          .then(res => res.json())
          .then(data => sendResponse({ success: true, data }))
          .catch(err => sendResponse({ success: false, error: err.message }));

        return true; // 保持异步通信通道开启
      }
    });
  },
});