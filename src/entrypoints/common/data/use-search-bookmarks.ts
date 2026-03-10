import PinyinMatch from 'pinyin-match';
import { getName } from "../util/url";
export interface searchBookmarksItem { title: string, url: string, node: BookmarkTreeNode, parent: BookmarkTreeNode | null }

export const searchBookmarks = (bookmarks: BookmarkTreeNode[], query: string) => {
    if (!query) return [];

    const results: searchBookmarksItem[] = [];
    const queryLower = query.toLowerCase();

    const stack: [BookmarkTreeNode, BookmarkTreeNode | null][] =
        bookmarks.map(node => [node, null]);

    while (stack.length > 0 && results.length < 80) {
        const [node, parent] = stack.pop()!;

        if (node.url) {
            const title = getName(node)?.toLowerCase() ?? '';
            const url = node.url.toLowerCase();

            if (title.includes(queryLower) || url.includes(queryLower) || PinyinMatch.match(title, query) || PinyinMatch.match(url, query)) {
                results.push({
                    title: node.title || getName(node) || '',
                    url: node.url,
                    node,
                    parent
                });
            }
        }

        if (node.children?.length) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push([node.children[i], node]);
            }
        }
    }

    return results;
}
