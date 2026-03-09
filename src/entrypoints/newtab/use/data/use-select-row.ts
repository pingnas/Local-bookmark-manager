import { useDebounceFn } from "@vueuse/core";
import { useBookmarks } from "@/entrypoints/popup/common/data";
import { selId } from "./use-data";

export const useSelectRow = () => {
    const selectRow = ref<BookmarkTreeNode>();
    const selectGroup = ref<BookmarkTreeNode>();
    const { bookmarks_group } = useBookmarks();

    const setSelectRow = useDebounceFn(() => {
        fn()
    }, 50, { maxWait: 100 })

    const fn = () => {
        const findBookmarkById = (node: BookmarkTreeNode, id: string): BookmarkTreeNode | null => {
            if (node.id === id) return node;
            if (node.children) {
                for (const child of node.children) {
                    const found = findBookmarkById(child, id);
                    if (found) return found;
                }
            }
            return null;
        }
        if (selId.value) {
            let found;
            let foundParent;
            Object.values(bookmarks_group.value).some(x => {
                foundParent = x.item;
                found = findBookmarkById(x.item, selId.value);
                if (found) return true;
            })

            if (found) {
                selectGroup.value = foundParent;
                selectRow.value = found;
            } else {
                selectGroup.value = undefined;
                selectRow.value = undefined;
            }
        }
    }
    watch(
        () => selId,
        (cur, acc) => {
            setSelectRow()
        },
        {
            immediate: true,
            deep: true,
        }
    )
    watch(
        () => bookmarks_group,
        (cur, acc) => {
            setSelectRow()
        },
        {
            immediate: true,
            deep: true,
        }
    )


    return { selectRow, selectGroup }
}