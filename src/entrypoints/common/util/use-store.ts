import { miaoStorage } from "@/entrypoints/common/util";
import { isNil } from "lodash-es";
import { nanoid } from "nanoid";

export class UseStore {
    public id = nanoid()
    updateId() {
        setTimeout(() => {
            this.id = nanoid()
        }, 10);
    }

    async getItemDrag() {
        const itemDrag = await miaoStorage.get<boolean>('itemDrag');

        if (!isNil(itemDrag)) {
            return itemDrag;
        } else {
            await miaoStorage.set<boolean>('itemDrag', true);
            return false;
        }
    }
    async setItemDrag(v: boolean) {
        await miaoStorage.set<boolean>('itemDrag', v);
    }

    async getItemDragToTree() {
        const itemDragToTree = await miaoStorage.get<boolean>('itemDragToTree');

        if (!isNil(itemDragToTree)) {
            return itemDragToTree;
        } else {
            await miaoStorage.set<boolean>('itemDragToTree', true);
            return false;
        }
    }
    async setItemDragToTree(v: boolean) {
        await miaoStorage.set<boolean>('itemDragToTree', v);
    }

    async getSearchEngines() {
        const searchEngines = await miaoStorage.get<string>('searchEngines');

        if (!isNil(searchEngines)) {
            return searchEngines;
        } else {
            await miaoStorage.set<string>('searchEngines', '2');
            return '2';
        }
    }
    async setSearchEngines(v: string) {
        await miaoStorage.set<string>('searchEngines', v);
    }

    async getOtherSearchEngines() {
        const otherSearchEngines = await miaoStorage.get<string>('otherSearchEngines');

        if (!isNil(otherSearchEngines)) {
            return otherSearchEngines;
        } else {
            await miaoStorage.set<string>('otherSearchEngines', '');
            return '';
        }
    }

    async setOtherSearchEngines(v: string) {
        await miaoStorage.set<string>('otherSearchEngines', v);
    }

    async getHomeTreeId() {
        const homeTreeId = await miaoStorage.get<string>('homeTreeId');

        if (!isNil(homeTreeId)) {
            return homeTreeId;
        } else {
            return '';
        }
    }
    async setHomeTreeId(v: string) {
        await miaoStorage.set<string>('homeTreeId', v);
    }

    async getHomeTreeParentId() {
        const homeTreeParentId = await miaoStorage.get<string>('homeTreeParentId');

        if (!isNil(homeTreeParentId)) {
            return homeTreeParentId;
        } else {
            return '';
        }
    }
    async setHomeTreeParentId(v: string) {
        await miaoStorage.set<string>('homeTreeParentId', v);
    }

    async getBackgroundImageUrl() {
        const backgroundImageUrl = await miaoStorage.get<string>('backgroundImageUrl');

        if (!isNil(backgroundImageUrl)) {
            return backgroundImageUrl;
        } else {
            return '';
        }
    }
    async setBackgroundImageUrl(v: string) {
        await miaoStorage.set<string>('backgroundImageUrl', v);
    }

    async getBingImageIndex() {
        const bingImageIndex = await miaoStorage.get<number>('bingImageIndex');

        if (!isNil(bingImageIndex)) {
            return bingImageIndex;
        } else {
            await miaoStorage.set<number>('bingImageIndex', 0);
            return 0;
        }
    }
    async setBingImageIndex(v: number) {
        await miaoStorage.set<number>('bingImageIndex', v);
    }

}

export const useMyStore = reactive(new UseStore());
