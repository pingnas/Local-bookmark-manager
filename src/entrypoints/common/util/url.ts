import { isNil } from "es-toolkit";

export const getFaviconUrl = (url: string = '') => {
    return `chrome-extension://${browser.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=40`;
}

export const getName = (x?: BookmarkTreeNode) => {
    if (isNil(x)) return '';
    if (x.title) return x.title;
    const url = x.url ?? '';
    const regex = /https?:\/\/([^\/]+)/;
    const match = url.match(regex);
    return match?.[1]
}
