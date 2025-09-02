import PinyinMatch from 'pinyin-match';
import { getName } from "../util/url";
export interface searchBookmarksItem { title: string, url: string, node: BookmarkTreeNode, parent: BookmarkTreeNode | null }

// 对书签执行模糊搜索
export const searchBookmarks = (bookmarks: BookmarkTreeNode[], query: string) => {
    // 空查询直接返回
    if (!query) return [];

    const results: searchBookmarksItem[] = [];
    const queryLower = query.toLowerCase();

    // 使用迭代而不是递归，减少调用栈开销
    const stack: [BookmarkTreeNode, BookmarkTreeNode | null][] =
        bookmarks.map(node => [node, null]);

    while (stack.length > 0 && results.length < 80) {
        const [node, parent] = stack.pop()!;

        if (node.url) {
            // 预先获取和转换值，避免重复处理
            const title = getName(node)?.toLowerCase() ?? '';
            const url = node.url.toLowerCase();

            // 使用 includes 进行字符串匹配
            if (title.includes(queryLower) || url.includes(queryLower) || PinyinMatch.match(title, query) || PinyinMatch.match(url, query)) {
                results.push({
                    title: node.title || getName(node) || '',
                    url: node.url,
                    node,
                    parent
                });
            }
        }

        // 将子节点添加到栈中
        if (node.children?.length) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push([node.children[i], node]);
            }
        }
    }

    return results;
}

