import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { getName } from '../util';

export const useTabGroup = () => {
    const tabGroupData = ref<BookmarkTreeNode>({
        id: 'tabGroups',
        title: i18n.t('NewTab.text.tab_group'),
        children: [],
        syncing: false,

    });

    const fetchTabGroup = useDebounceFn(() => {
        fn()
    }, 50, { maxWait: 100 })

    const fn = async () => {
        try {
            const tabs: Tab[] = await browser?.tabs?.query({ windowId: browser.windows.WINDOW_ID_CURRENT }) || [];
            const tabGroups = await browser?.tabGroups?.query({ windowId: browser.windows.WINDOW_ID_CURRENT }) || [];


            const groupedTabs = new Map();
            tabs.forEach(tab => {
                const groupId = tab?.groupId;
                if (!groupedTabs.has(groupId)) {
                    groupedTabs.set(groupId, []);
                }
                groupedTabs.get(groupId)?.push(tab);
            });

            let children: BookmarkTreeNode[] = [];
            [{ id: browser?.tabGroups?.TAB_GROUP_ID_NONE, title: i18n.t('NewTab.text.active_tab') }, ...tabGroups,].map(x => {
                if (groupedTabs.has(x?.id)) {
                    children.push({
                        ...x,
                        id: String('tabGroups' + x?.id),
                        title: x?.title || i18n.t('NewTab.text.no_name_tab_group'),
                        syncing: false,
                        children: groupedTabs.get(x?.id).map((tab: BookmarkTreeNode) => ({
                            ...tab,
                            id: String(tab?.id),
                            title: getName(tab),
                            url: tab?.url,
                        }),),
                    });
                }
            })

            tabGroupData.value.children = [];
            tabGroupData.value.children = children;

        } catch (error) {
            console.error('获取标签组失败:', error);
        }
    };




    onMounted(() => {
        fetchTabGroup();

        browser?.tabGroups?.onCreated?.addListener(fetchTabGroup);
        browser?.tabGroups?.onUpdated?.addListener(fetchTabGroup);
        browser?.tabGroups?.onRemoved?.addListener(fetchTabGroup);
        browser?.tabGroups?.onMoved?.addListener(fetchTabGroup);


        browser?.tabs?.onUpdated?.addListener(fetchTabGroup);
        browser?.tabs?.onMoved?.addListener(fetchTabGroup);
        browser?.tabs?.onAttached?.addListener(fetchTabGroup);
        browser?.tabs?.onDetached?.addListener(fetchTabGroup);
        browser?.tabs?.onCreated?.addListener(fetchTabGroup);
        browser?.tabs?.onRemoved?.addListener(fetchTabGroup);
        browser?.tabs?.onReplaced?.addListener(fetchTabGroup);
    })

    onUnmounted(() => {
        browser?.tabGroups?.onCreated?.removeListener(fetchTabGroup);
        browser?.tabGroups?.onUpdated?.removeListener(fetchTabGroup);
        browser?.tabGroups?.onRemoved?.removeListener(fetchTabGroup);
        browser?.tabGroups?.onMoved?.removeListener(fetchTabGroup);


        browser?.tabs?.onUpdated?.removeListener(fetchTabGroup);
        browser?.tabs?.onMoved?.removeListener(fetchTabGroup);
        browser?.tabs?.onAttached?.removeListener(fetchTabGroup);
        browser?.tabs?.onDetached?.removeListener(fetchTabGroup);
        browser?.tabs?.onCreated?.removeListener(fetchTabGroup);
        browser?.tabs?.onRemoved?.removeListener(fetchTabGroup);
        browser?.tabs?.onReplaced?.removeListener(fetchTabGroup);
    })

    return {
        tabGroupData,
    }
}
