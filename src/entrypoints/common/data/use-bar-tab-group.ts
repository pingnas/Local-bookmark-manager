import { ref } from 'vue';


export const useBarTabGroup = () => {
    const barTabGroupData = ref<BookmarkTreeNode>({
        id: 'barTabGroups',
        title: i18n.t('NewTab.text.bar_tab_group'),
        children: [],
        syncing: false,
    });

    return {
        barTabGroupData,
    }
}
