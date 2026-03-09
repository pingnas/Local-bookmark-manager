import { BgConfig, BgType, miaoStorage } from "@/entrypoints/popup/common/util";
import { isNil, omit } from "es-toolkit/compat";
import { v4 as uuidv4 } from 'uuid';
import { UseHistoryGroup } from "../../use";

export class UseStore {
    public id = uuidv4()
    updateId() {
        setTimeout(() => {
            this.id = uuidv4()
        }, 10);
    }

    // bool
    // item drag
    async getItemDrag() {
        const itemDrag = await miaoStorage.get<boolean>('itemDrag');

        if (!isNil(itemDrag)) {
            return itemDrag;
        } else {
            await miaoStorage.set<boolean>('itemDrag', false);
            return false;
        }
    }
    async setItemDrag(v: boolean) {
        await miaoStorage.set<boolean>('itemDrag', v);
    }

    // bool
    // item drag to tree
    async getItemDragToTree() {
        const itemDragToTree = await miaoStorage.get<boolean>('itemDragToTree');

        if (!isNil(itemDragToTree)) {
            return itemDragToTree;
        } else {
            await miaoStorage.set<boolean>('itemDragToTree', false);
            return false;
        }
    }
    async setItemDragToTree(v: boolean) {
        await miaoStorage.set<boolean>('itemDragToTree', v);
    }

    // bool
    // 搜索引擎
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

    // string
    // 自定义搜索引擎
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

    // bool
    // 启用默认右键菜单
    async getEnableDefaultContextMenu() {
        const enableDefaultContextMenu = await miaoStorage.get<boolean>('enableDefaultContextMenu');

        let enable = import.meta.env.DEV ? true : false;
        if (!isNil(enableDefaultContextMenu)) {
            return enableDefaultContextMenu;
        } else {
            await miaoStorage.set<boolean>('enableDefaultContextMenu', enable);
            return enable;
        }
    }
    async setEnableDefaultContextMenu(v: boolean) {
        await miaoStorage.set<boolean>('enableDefaultContextMenu', v);
    }

    // bool
    // 主页
    async getHomeTreeId() {
        const homeTreeId = await miaoStorage.get<string>('homeTreeId');

        if (!isNil(homeTreeId)) {
            return homeTreeId;
        } else {
            // await miaoStorage.set<string>('homeTreeId', '1');
            return '';
        }
    }
    async setHomeTreeId(v: string) {
        await miaoStorage.set<string>('homeTreeId', v);
    }

    // string
    // 主页父节点
    async getHomeTreeParentId() {
        const homeTreeParentId = await miaoStorage.get<string>('homeTreeParentId');

        if (!isNil(homeTreeParentId)) {
            return homeTreeParentId;
        } else {
            // await miaoStorage.set<string>('homeTreeParentId', '1');
            return '';
        }
    }
    async setHomeTreeParentId(v: string) {
        await miaoStorage.set<string>('homeTreeParentId', v);
    }

    // string
    // 历史记录
    async getHistoryGroup() {
        const historyGroup = await miaoStorage.get<{ [id: string]: UseHistoryGroup }>('historyGroup');

        if (!isNil(historyGroup)) {
            return historyGroup;
        } else {
            await this.setHistoryGroup({});
            this.updateId()
            return {};
        }
    }

    async setHistoryGroup(v: { [id: string]: UseHistoryGroup }) {
        await miaoStorage.set<{ [id: string]: UseHistoryGroup }>('historyGroup', v);
        this.updateId()
    }

    async removeHistoryGroup(id: string) {
        const historyGroup = await miaoStorage.get<{ [id: string]: UseHistoryGroup }>('historyGroup');
        await miaoStorage.set<{ [id: string]: UseHistoryGroup }>('historyGroup', omit(historyGroup, [id]));
        this.updateId()
    }
    async addHistoryGroup(v: { [id: string]: UseHistoryGroup }) {
        const historyGroup = await miaoStorage.get<{ [id: string]: UseHistoryGroup }>('historyGroup');
        await miaoStorage.set<{ [id: string]: UseHistoryGroup }>('historyGroup', { ...historyGroup, ...v });
        this.updateId()
    }

    // string
    // 背景类型
    async getBgTab() {
        const bgTab = await miaoStorage.get<BgType>('bgTab');

        if (!isNil(bgTab)) {
            return bgTab;
        } else {
            await this.setBgTab(BgType.Default);
            return BgType.Default
        }
    }

    async setBgTab(v: BgType) {
        await miaoStorage.set<BgType>('bgTab', v);
    }

    // object
    // 背景配置
    async getBgModel() {
        const bgModel = await miaoStorage.get<{ [k: string]: BgConfig }>('bgModel');
        if (!isNil(bgModel)) {
            return bgModel;
        } else {
            await this.setBgModel({
                [BgType.Default]: new BgConfig({}),
                [BgType.Location]: new BgConfig({}),
                [BgType.Internet]: new BgConfig({}),
            });
            return {
                [BgType.Default]: new BgConfig({}),
                [BgType.Location]: new BgConfig({}),
                [BgType.Internet]: new BgConfig({}),
            }
        }
    }
    async setBgModel(v: { [k: string]: BgConfig }) {
        await miaoStorage.set<{ [k: string]: BgConfig }>('bgModel', v);
    }
    async clearBg() {
        await this.setBgTab(BgType.Default);
        await this.setBgModel({
            [BgType.Default]: new BgConfig({}),
            [BgType.Location]: new BgConfig({}),
            [BgType.Internet]: new BgConfig({}),
        });
    }

    // int
    // 启用默认右键菜单
    async getOpacity() {
        const bgOpacity = await miaoStorage.get<number>('bgOpacity');


        if (!isNil(bgOpacity)) {
            return bgOpacity;
        } else {
            await miaoStorage.set<number>('bgOpacity', 0.4);
            return 0.4;
        }
    }
    async setOpacity(v: number) {
        await miaoStorage.set<number>('bgOpacity', v);
    }
}

export const useMyStore = reactive(new UseStore());