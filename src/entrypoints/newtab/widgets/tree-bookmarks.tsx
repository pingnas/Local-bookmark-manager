import { PropType } from '#imports';
import { BookmarksGroup } from '@/entrypoints/popup/common/data';
import { getName, TreeBookmarks, treeBookmarksLevel, useMyStore } from '@/entrypoints/popup/common/util';
import { RadioButton, RadioGroup, TinyNotify } from '@opentiny/vue';
import { SortableEvent, VueDraggable } from 'vue-draggable-plus';
import { t_b_addFolder } from '../dialog/t-b-addFolder';
import { t_b_del } from '../dialog/t-b-del';
import { t_b_openall } from '../dialog/t-b-openall';
import { t_b_rename } from '../dialog/t-b-rename';
import { t_b_setHome } from '../dialog/t-b-setHome';
import { selId, useBookmarksGroupSize } from '../use';


export default defineComponent({
    props: {
        bookmarks_group: {
            type: Object as PropType<Record<string, BookmarksGroup>>,
            default: {},
        }
    },
    setup(p) {
        const { domRef: bookmarksGroupRef, height: bookmarksGroupHeight } = useBookmarksGroupSize();
        const data = reactive({
            cur_group_id: undefined,
        })

        const click = (x: BookmarkTreeNode) => {
            selId.value = x.id;
        }

        const homeTreeIdRef = ref()

        onMounted(async () => {
            homeTreeIdRef.value = await useMyStore.getHomeTreeId();
            selId.value = homeTreeIdRef.value;
            let HomeTreeParentId = await useMyStore.getHomeTreeParentId();
            if (Object.values(p.bookmarks_group)?.some(x => x.value === HomeTreeParentId)) {
                data.cur_group_id = HomeTreeParentId as any;
            } else {
                let first: BookmarksGroup = Object.values(p.bookmarks_group)[0];
                data.cur_group_id = first.value as any;
            }
        })


        /// 计算当前树
        const item = computed(() => {
            if (data.cur_group_id) return p.bookmarks_group[data.cur_group_id]?.item
        })

        const row = ref<TreeBookmarks[]>();

        watch(
            () => item.value,
            (cur, acc) => {
                if (!cur) return;
                row.value = treeBookmarksLevel(cur);
            },
            {
                deep: true,
                immediate: true,
            }
        )
        const disabled = computed(() => data.cur_group_id === 'window')

        return {
            click,
            data,
            bookmarksGroupRef,
            bookmarksGroupHeight,
            item,
            row,
            disabled,
            homeTreeIdRef
        }
    },
    render() {

        const getTemp = (x: TreeBookmarks) => {

            let c_count = x.node.children?.reduce((a, b) => {
                return a + ('url' in b ? 1 : 0)
            }, 0)

            let c = <div
                style={{ paddingLeft: `${x.padding}px`, }}
                class={[{ 'drag-tree-item': true }]}
            >
                <div
                    class={{ 'bookmarks-item': true, 'tree-select': x.node.id === selId.value, 'ishometree': x.node.id === this.homeTreeIdRef }}
                    data-id={x.node.id}
                    onClick={() => this.click(x.node)}
                    onContextmenu={(e) => {
                        e.preventDefault();

                        if (this.item?.id === 'window') return;

                        let rename = {
                            label: i18n.t('NewTab.rename'),
                            onClick: () => {
                                t_b_rename({ x })
                            },
                        };
                        let addFolder = {
                            label: i18n.t('NewTab.newfolder'),
                            onClick: () => {
                                t_b_addFolder({ x })
                            },
                        };
                        let del = {
                            label: i18n.t('NewTab.btn.delete'),
                            onClick: () => {
                                t_b_del({ x })
                            },
                        };
                        let openAll = {
                            label: i18n.t('NewTab.openAllFolder'),
                            onClick: () => {
                                t_b_openall({ x })
                            },
                        };

                        let home = {
                            label: i18n.t('NewTab.setHomepage'),
                            onClick: () => {
                                t_b_setHome({ x })
                            },
                        };

                        let items = [rename, addFolder, del, openAll, home];

                        if (x.isFirst) {
                            items = [addFolder, openAll, home]
                        }

                        this.$contextmenu({
                            x: e.x,
                            y: e.y,
                            theme: 'mac',
                            items: items,
                        });

                    }}
                >
                    <span
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: `calc(100%  - 16px * 1 - 30px)`
                        }}
                        title={getName(x.node)}
                    >
                        {getName(x.node)}
                    </span>
                    {
                        c_count ? <span class='count'>{c_count}</span> : ''
                    }
                </div>
            </div>

            return <VueDraggable
                key={x.node.id}
                modelValue={[x.node]}
                class={{ 'drag-tree-item-container': true, 'first-tree-item': x.isFirst, }}
                group={"bookmarks"}
                data-id={x.node.id}
                data-title={x.node.title}
                filter={'.drag-tree-item'}
                ghostClass={'item-to-tree-item-ghost'}
                disabled={this.disabled}
            >
                {c}
            </VueDraggable>;
        }

        const getBookmarksGroup = () => {
            if (this.data.cur_group_id) {
                return <div style={{ marginBottom: '10px', }} ref={'bookmarksGroupRef'}>
                    <RadioGroup
                        v-model={this.data.cur_group_id}
                        fill="#6d28d9"
                        text-color="#fff"
                        size='medium'
                        style={{
                            gap: '10px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%'
                        }}
                    >
                        {
                            this.bookmarks_group && Object.values(this.bookmarks_group).map(x => {
                                return <RadioButton label={x.value}>{x.label}</RadioButton>
                            })
                        }
                    </RadioGroup>
                </div>
            }
            return <></>
        }
        return <>
            {getBookmarksGroup()}
            <VueDraggable
                modelValue={this.row ?? []}
                {...{
                    'onUpdate:modelValue': (v: TreeBookmarks[]) => {
                        this.row = v;
                    },
                    style: {
                        overflowY: 'auto',
                        height: `calc(100% - ${this.bookmarksGroupHeight}px)`,
                    },
                    animation: 150,
                    disabled: true,
                    ghostClass: 'tree-item-ghost',
                    group: "tree-item",
                    filter: '.first-tree-item',
                    'data-id': this.data.cur_group_id,
                    'data-title': this.item?.title,
                    onEnd: (event) => {
                        let e: SortableEvent & { data: TreeBookmarks, newIndex: number, oldIndex: number } = event as any;
                        // 不是一个容器
                        if (event.from !== event.to) {
                            let parentId = event.to.dataset['id'];
                            let parentTitle = event.to.dataset['title'];

                            TinyNotify({
                                type: 'success',
                                position: 'top-right',
                                title: () => <div style={{ fontSize: '12px', fontWeight: '400px', wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                                    <span style={{ color: 'red' }}>{e.data.parent.title}</span>
                                    {i18n.t('NewTab.text.of_bookmark')}
                                    <span style={{ color: 'red' }}>{e.data.node.title}</span> {i18n.t('NewTab.text.success_move_to')}
                                    <span style={{ color: 'red' }}>{parentTitle}</span>
                                </div>
                            })
                            return
                        }
                        // 是一个容器，只允许行内拖拽
                        if (event.from === event.to) {
                            if (e.newIndex === e.oldIndex) return;

                        }
                    },
                }}
            >
                {this.row?.map(x => getTemp(x))}
            </VueDraggable>
        </>;
    }
})