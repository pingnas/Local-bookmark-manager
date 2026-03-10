
/**
 * 打平书签树
 * @param x 
 * @returns 
 */
export const bookmarksLevel = (x: BookmarkTreeNode,) => {
    let arr: BookmarkTreeNode[] = [];

    const filter = (node: BookmarkTreeNode,) => {
        if (node.children) {
            arr.push(node)
            for (const child of node.children) {
                filter(child)
            }
        }
    }
    filter(x)

    return arr;
}

/**
 * 打平书签树 加上层级
 * @param x 
 * @returns 
 */
export const treeBookmarksLevel = (x: BookmarkTreeNode,) => {
    let arr: TreeBookmarks[] = [];

    const filter = (node: BookmarkTreeNode, isFirst: boolean = false, padding: number = 0) => {
        if (node.children) {
            arr.push(new TreeBookmarks({
                isFirst, padding, node, parent: x
            }))
            for (const child of node.children) {
                filter(child, false, padding + 20)
            }
        }
    }
    filter(x, true)

    return arr;
}
export class TreeBookmarks {
    isFirst: boolean;
    padding: number;
    node: BookmarkTreeNode;
    parent: BookmarkTreeNode;

    constructor({ isFirst, padding, node, parent }:
        { isFirst: boolean, padding: number, node: BookmarkTreeNode, parent: BookmarkTreeNode }) {
        this.isFirst = isFirst;
        this.padding = padding;
        this.node = node;
        this.parent = parent;
    }
}


export const getAllBookmarkUrls = (x: TreeBookmarks) => {
    let arr: string[] = [];

    const filter = (node: BookmarkTreeNode,) => {
        node.url && arr.push(node.url)
        if (node.children) {
            for (const child of node.children) {
                filter(child)
            }
        }
    }
    filter(x.node)

    return arr;
};

export const getAllBookmarkUrlsByTreeNodes = (x: BookmarkTreeNode) => {
    let arr: string[] = [];

    const filter = (node: BookmarkTreeNode,) => {
        node.url && arr.push(node.url)
        if (node.children) {
            for (const child of node.children) {
                filter(child)
            }
        }
    }
    filter(x)

    return arr;
};

export const createUrlToGroup = (urls: string[], groupName: string) => {
    const tabIds: number[] = [];

    const createTabPromises = urls.map(url => {
        return new Promise<void>((resolve) => {
            chrome.tabs.create({ url: url, active: false }, (tab) => {
                if (!chrome.runtime.lastError) {
                    tabIds.push(tab.id!);
                }
                resolve();
            });
        });
    });


    Promise.all(createTabPromises).then(() => {
        if (tabIds.length > 1) {
            chrome.tabs.group({ tabIds: tabIds as [number, ...number[]] }, (groupId) => {
                let colors = Object.values(chrome.tabGroups.Color);

                chrome.tabGroups.update(
                    groupId,
                    {
                        title: groupName,
                        color: colors![Math.floor(Math.random() * colors.length)]!
                    },
                    () => {

                    }
                );
            });
        }
    });
}



export const usetabGroupDataLeval = (v: BookmarkTreeNode) => {
    let arr: BookmarkTreeNode[] = []
    const each = (x: BookmarkTreeNode, isFirst: boolean = false) => {
        if (!isFirst) arr.push(x)
        x.children?.forEach((e) => each(e));
    }
    each(v, true)

    return arr;
}

export class BookmarkDataLeval {
    paths: string[]
    node: BookmarkTreeNode

    constructor({ paths, node }: { paths: string[], node: BookmarkTreeNode }) {
        this.paths = paths;
        this.node = node;
    }
}
export const usetabGroupDataLeval_plus = (v: BookmarkTreeNode) => {
    let arr: BookmarkDataLeval[] = []
    const each = (x: BookmarkTreeNode, isFirst: boolean = false, path: string[] = []) => {
        if (!isFirst) arr.push(new BookmarkDataLeval({ node: x, paths: path.concat(x.title) }))
        x.children?.forEach((e) => each(e, false, path.concat(x.title)));
    }
    each(v, true)

    return arr;
}