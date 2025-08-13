import { reload, TreeBookmarks, useMyStore } from "@/entrypoints/popup/common/util";

export const t_b_setHome = (obj: {
    x: TreeBookmarks,
}) => {
    const { x } = obj;
    useMyStore.setHomeTreeId(x.node.id);
    useMyStore.setHomeTreeParentId(x.parent.id);
    reload()
}