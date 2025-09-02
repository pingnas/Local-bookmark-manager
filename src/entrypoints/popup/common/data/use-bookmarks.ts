import { useDebounceFn } from "@vueuse/core";
import { omit, pick } from "es-toolkit/compat";
import { useHistory, useTabGroup } from ".";


export class BookmarksGroup {
    label: string;
    value: string;
    item: BookmarkTreeNode;

    constructor({ label, value, item }: { label: string, value: string, item: BookmarkTreeNode }) {
        this.label = label;
        this.value = value;
        this.item = item;
    }
}

export const useBookmarks = () => {
    const bookmarks = ref<BookmarkTreeNode[]>([]);
    const { historyData } = useHistory();
    const { tabGroupData } = useTabGroup();
    let windows: BookmarkTreeNode = {
        title: i18n.t('NewTab.windows'),
        id: 'window',
        children: [
            historyData.value,
            tabGroupData.value,
        ],
        syncing: false,
    }

    const bookmarks_group = computed(() => {
        return [windows, ...bookmarks.value?.[0]?.children || []]?.reduce((a: Record<string, BookmarksGroup>, b: BookmarkTreeNode) => {
            a = {
                ...a,
                [b.id]: new BookmarksGroup({
                    label: b.title,
                    value: b.id,
                    item: b,
                }
                )
            }
            return a;
        }, {} as Record<string, BookmarksGroup>);
    });

    const fetchBookmarks = useDebounceFn(() => {
        fn()
    }, 50, { maxWait: 100 })

    const fn = async () => {
        await browser.bookmarks.getTree().then(x => {
            bookmarks.value = x;
        })
    }

    onMounted(() => {
        fetchBookmarks().then(() => {
        });
        browser.bookmarks.onChanged.addListener(fetchBookmarks);
        browser.bookmarks.onCreated.addListener(fetchBookmarks);
        browser.bookmarks.onMoved.addListener(fetchBookmarks);
        browser.bookmarks.onRemoved.addListener(fetchBookmarks);
        browser.bookmarks.onChildrenReordered.addListener(fetchBookmarks);
    })

    onUnmounted(() => {
        browser.bookmarks.onChanged.removeListener(fetchBookmarks);
        browser.bookmarks.onCreated.removeListener(fetchBookmarks);
        browser.bookmarks.onMoved.removeListener(fetchBookmarks);
        browser.bookmarks.onRemoved.removeListener(fetchBookmarks);
        browser.bookmarks.onChildrenReordered.removeListener(fetchBookmarks);
    })


    const openAllBookmarks = async () => {
        const nodes: BookmarkTreeNode[] = [];

        const collect = (node: BookmarkTreeNode) => {
            if (node.url) nodes.push(node);
            if (node.children) node.children.forEach(collect);
        };
        Object.values(bookmarks_group.value).slice(0, -1).forEach(x => collect(x.item));

        const batchSize = 8;
        for (let i = 0; i < nodes.length; i += batchSize) {
            const batch = nodes.slice(i, i + batchSize);
            batch.forEach(node => {
                const a = window.open(node.url, '_blank');
                setTimeout(() => a?.close(), 8000);
            });
            // 每批之间间隔 500ms
            if (i + batchSize < nodes.length) {
                await new Promise(res => setTimeout(res, 8000));
            }
        }
    }

    const delEmptyBookmarks = async () => {

        const remove = (node: BookmarkTreeNode) => {

            if (node.children) {
                if (node.children.length === 0) {
                    browser.bookmarks.remove(node.id);
                }
                node.children.forEach(remove);
            }
        };
        Object.values(bookmarks_group.value).slice(0, -1).forEach(x => remove(x.item));
    }
    const left = computed(() => {
        return pick(bookmarks_group.value, ['1', '2']);
    })
    const right = computed(() => {
        return omit(bookmarks_group.value, ['1', '2']);
    })
    return { bookmarks, bookmarks_group, openAllBookmarks, delEmptyBookmarks, left, right }
}
