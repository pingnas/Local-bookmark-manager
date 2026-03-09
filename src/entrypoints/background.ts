import { useMyStore } from "./popup/common/util";

export default defineBackground({
  type: 'module',
  main: () => {
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Received message in background:', request);

      const { action } = request;
      switch (action) {
        case 'getBg':
          useMyStore.getBgModel().then(x => {
            sendResponse({
              models: x,
            });
          });
          return true;

        default:
          break;
      }

      return true;
    });
  },
});