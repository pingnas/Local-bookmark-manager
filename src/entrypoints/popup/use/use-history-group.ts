import { useMyStore, usetabGroupDataLeval } from '@/entrypoints/popup/common/util';
import dayjs from "dayjs";
import { cloneDeep } from "es-toolkit";
import { v4 } from "uuid";
import { useTabGroup } from "../common/data";


export class UseHistoryGroup {
    children: BookmarkTreeNode[] = [];
    createdAt: string;
    updatedAt: string;
    name: string;

    constructor({ children, updatedAt, createdAt, name }: {
        children: BookmarkTreeNode[],
        updatedAt?: string,
        createdAt?: string,
        name?: string,
    }) {
        this.children = children;
        this.createdAt = createdAt ?? dayjs().format('YYYY-MM-DD HH:mm:ss');
        this.updatedAt = updatedAt ?? dayjs().format('YYYY-MM-DD HH:mm:ss');
        this.name = name ?? this.createdAt;
    }

}

export const useHistoryGroup = () => {
    const { tabGroupData } = useTabGroup();
    const url = chrome.runtime.getURL('historyGroup.html');

    const close = (node: BookmarkTreeNode) => {

        chrome.tabs.create({ url: 'chrome://newtab/', });
        chrome.tabs.create({ url, pinned: true, active: true });

        if (node.children) {

            node.children.forEach(x => {
                if (x.children) {
                    let ids = x.children.map(x => {
                        return parseInt(x.id);
                    });
                    chrome.tabs.remove(ids, () => {
                    });
                }
            })
        }
    };


    const addHistoryGroup = async () => {

        let arr = usetabGroupDataLeval(tabGroupData.value);

        await useMyStore.addHistoryGroup({
            [v4()]: new UseHistoryGroup({
                children: cloneDeep(arr.filter(x => x.url !== url)).map(x => {
                    if (x.children) {
                        x.children = x.children.filter(y => y.url !== url)
                    }
                    return x;
                })
            })
        });

        close(tabGroupData.value);
    }
    const openHistoryGroup = () => {
        let arr = usetabGroupDataLeval(tabGroupData.value);
        let find = arr.find(x => x.url === url && (x as any).pinned);
        if (find) {
            chrome.tabs.update(parseInt(find.id), { active: true });
        } else {
            chrome.tabs.create({ url, pinned: true });
        }
    }


    return {
        addHistoryGroup,
        openHistoryGroup
    }
}