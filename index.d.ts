type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
type Tab = chrome.tabs.Tab;

declare module '~icons/*' {
    import type { FunctionalComponent, SVGAttributes } from 'vue'
    const component: FunctionalComponent<SVGAttributes>
    export default component
}
