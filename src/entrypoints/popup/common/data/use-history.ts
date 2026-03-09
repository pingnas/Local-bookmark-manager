import { useDebounceFn } from "@vueuse/core";

export const useHistory = () => {
    const historyData = ref<BookmarkTreeNode>({
        id: 'history',
        title: i18n.t('NewTab.text.history'),
        children: [],
        syncing: false,
    });

    const fetchHistory = useDebounceFn(() => {
        fn()
    }, 50, { maxWait: 100 })

    const fn = async () => {

        const histories = await browser.history.search({
            text: '',
            maxResults: 100,
            startTime: 0
        });

        historyData.value.children = histories.map(h => ({
            id: h.id || String(h.lastVisitTime),
            title: h.title || h.url || '',
            url: h.url,
            dateAdded: h.lastVisitTime,
            syncing: false,
        }));
    };

    onMounted(() => {
        fetchHistory();

        browser.history.onVisited.addListener(fetchHistory);
    })

    onUnmounted(() => {
        browser.history.onVisited.removeListener(fetchHistory);
    })

    return { historyData }
}