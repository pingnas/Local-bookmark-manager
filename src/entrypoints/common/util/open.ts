export const openUrl = (url?: string) => {
    if (!url) return;
    try {
        globalThis.location.assign(url);
    } catch (error) {
        browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let tab = tabs[0];
            browser.tabs.update(tab.id!, { url });
        });
    }
}

export const openUrlInNewTab = (url?: string) => {
    if (!url) return;
    try {
        browser.tabs.create({ url });
    } catch (error) {
        globalThis.open(url, '_blank')
    }
}
export const reload = () => {
    globalThis.location.reload();
}