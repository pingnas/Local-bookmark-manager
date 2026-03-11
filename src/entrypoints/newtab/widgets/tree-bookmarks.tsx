import { PropType } from '#imports';
import { BookmarksGroup } from '@/entrypoints/common/data';
import { getName, TreeBookmarks, treeBookmarksLevel, useMyStore } from '@/entrypoints/common/util';
import { useVirtualList } from '@vueuse/core';
import { RadioButton, RadioGroup } from '@opentiny/vue';
import { VueDraggable } from 'vue-draggable-plus';
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
        const treeItemHeight = 48;
        const { list: virtualList, containerProps, wrapperProps, scrollTo } = useVirtualList(
            computed(() => row.value ?? []),
            {
                itemHeight: treeItemHeight,
                overscan: 8,
            }
        )
        const animateTree = ref(false);
        let animateTimer: ReturnType<typeof setTimeout> | undefined;
        const triggerTreeAppear = () => {
            animateTree.value = true;
            if (animateTimer) clearTimeout(animateTimer);
            animateTimer = setTimeout(() => {
                animateTree.value = false;
            }, 260);
        }
        watch(
            () => item.value?.id,
            (cur, acc) => {
                if (!cur || cur === acc) return;
                scrollTo(0);
                triggerTreeAppear();
            },
            { immediate: true }
        )
        onBeforeUnmount(() => {
            if (animateTimer) clearTimeout(animateTimer);
        })

        return {
            click,
            data,
            bookmarksGroupRef,
            bookmarksGroupHeight,
            item,
            row,
            disabled,
            homeTreeIdRef,
            virtualList,
            containerProps,
            wrapperProps,
            animateTree
        }
    },
    render() {

        const getTemp = (x: TreeBookmarks, index: number) => {

            let c_count = x.node.children?.reduce((a, b) => {
                return a + ('url' in b ? 1 : 0)
            }, 0)

            let c = <div
                style={{ paddingLeft: `${x.padding}px`, animationDelay: this.animateTree ? `${index * 18}ms` : undefined, }}
                class={{ 'drag-tree-item': true, 'tree-appear': this.animateTree, }}
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
                        fill="#0f766e"
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
                            this.bookmarks_group && Object.values(this.bookmarks_group).map((x, i) => {
                                return <RadioButton label={x.value} text={x.label.split('')[0]}></RadioButton>
                            })
                        }
                    </RadioGroup>
                </div>
            }
            return <></>
        }
        const containerStyle = {
            ...(this.containerProps.style as any),
            overflowY: 'auto',
            height: `calc(100% - ${this.bookmarksGroupHeight}px)`,
        }

        return <>
            {getBookmarksGroup()}
            <div
                ref={this.containerProps.ref}
                onScroll={this.containerProps.onScroll}
                style={containerStyle}
            >
                <div {...this.wrapperProps}>
                    {this.virtualList?.map((x) => getTemp(x.data, x.index))}
                </div>
            </div>
        </>;
    }
})
