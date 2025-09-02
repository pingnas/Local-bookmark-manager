import { searchBookmarks, searchBookmarksItem, useBookmarks } from '@/entrypoints/popup/common/data';
import { getFaviconUrl, openUrl, openUrlInNewTab, useMyStore } from '@/entrypoints/popup/common/util';
import { Autocomplete } from "@opentiny/vue";
import PinyinMatch from 'pinyin-match';

export default defineComponent({
    setup() {
        const { bookmarks } = useBookmarks();
        const value = ref('')
        const oldValue = ref('')

        const searchBookmark = computed<searchBookmarksItem[]>(() => {
            return searchBookmarks(bookmarks.value, value.value);
        })

        const searchEngines = ref('2');
        const otherSearchEngines = ref();

        onMounted(async () => {
            searchEngines.value = await useMyStore.getSearchEngines();
            otherSearchEngines.value = await useMyStore.getOtherSearchEngines();
        })
        return {
            value,
            searchBookmark,
            oldValue,
            searchEngines,
            otherSearchEngines,
        }
    },
    render() {
        return <div class={'search'}>
            <Autocomplete
                modelValue={this.value}
                clearable
                placeholder={i18n.t('NewTab.search_placeholder')}
                size="medium"
                hide-loading={true}
                debounce={0}
                popper-class="search-dropdown"
                fetchSuggestions={(queryString: string, cb: Function) => {
                    cb(this.searchBookmark.map(x => ({ ...x, value: x.title })))
                }}
                {...{
                    'onUpdate:modelValue': (v: string) => {

                        this.oldValue = this.value;
                        this.value = v;

                    },
                    'onSelect': (item: searchBookmarksItem) => {
                        this.value = this.oldValue;
                    },
                    onKeydown: (event: KeyboardEvent) => {
                        if (event.ctrlKey && event.key === 'Enter') {
                            const arr: { [key: string]: string } = {
                                '1': 'https://www.baidu.com/s?wd=',
                                '2': 'https://www.google.com/search?q=',
                            }
                            let url: string;
                            if (Object.keys(arr).includes(this.searchEngines)) {
                                url = arr[this.searchEngines];
                            } else {
                                url = this.otherSearchEngines;
                            }

                            const searchUrl = url + encodeURIComponent(this.value);
                            openUrl(searchUrl)
                        }
                    }
                }}
                v-slots={{
                    default: (obj: { slotScope: searchBookmarksItem }) => {
                        let slotScope: searchBookmarksItem = obj.slotScope;

                        let title = slotScope.title;
                        let url = slotScope.url || '';

                        if (this.value) {

                            const arr = PinyinMatch.match(title, this.value);
                            const arr2 = PinyinMatch.match(url, this.value);
                            if (arr) {
                                const [start, end] = arr;
                                const matchedText = title.slice(start, end + 1);
                                title = title.slice(0, start) +
                                    `<span style="color: #f44336">${matchedText}</span>` +
                                    title.slice(end + 1);
                            } else if (arr2) {
                                const [start, end] = arr2;
                                const matchedText = url.slice(start, end + 1);
                                url = url.slice(0, start) +
                                    `<span style="color: #f44336">${matchedText}</span>` +
                                    url.slice(end + 1);
                            } else {
                                const reg = new RegExp(this.value, 'gi');
                                title = title.replace(reg, match => `<span style="color: #f44336">${match}</span>`);
                                url = url.replace(reg, match => `<span style="color: #f44336">${match}</span>`);
                            }

                        }
                        return <div
                            key={slotScope.url + slotScope.node.id}
                            onClick={(e: MouseEvent) => {
                                e.preventDefault();
                                openUrlInNewTab(slotScope.url)
                            }}
                            class="bookmark-item">
                            <img src={getFaviconUrl(slotScope.url)} />
                            <div>
                                <div innerHTML={title} />
                                <div
                                    style={{ fontSize: '12px', color: '#6d28d9' }}
                                    innerHTML={url}
                                />
                            </div>
                        </div>
                    }
                }}
            />
        </div>
    }
})
