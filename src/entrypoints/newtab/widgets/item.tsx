import { getFaviconUrl, getName, openUrl, openUrlInNewTab, useMyStore } from '@/entrypoints/common/util';
import { TinyNotify } from '@opentiny/vue';
import { SortableEvent, VueDraggable } from 'vue-draggable-plus';
import { i_del } from '../dialog/i-del';
import { i_rename } from '../dialog/i-rename';
import { useSelectRow } from '../use';

export default defineComponent({
    setup() {
        const { selectRow, selectGroup } = useSelectRow();

        const isDrag = ref(false);
        const animateItems = ref(false);
        let animateTimer: ReturnType<typeof setTimeout> | undefined;
        const APPEAR_DELAY = 12;
        const APPEAR_DURATION = 160;
        const APPEAR_BUFFER = 24;
        const containerEl = ref<HTMLElement | null>(null);

        const row = ref<BookmarkTreeNode[]>();
        watch(
            () => selectRow.value,
            (cur, acc) => {
                row.value = cur?.children?.filter(x => !x.children);
            },
            {
                deep: true,
                immediate: true,
            }
        )
        const calcAppearTotal = (count: number) => {
            const lastDelay = Math.max(0, count - 1) * APPEAR_DELAY;
            return Math.max(APPEAR_DURATION, lastDelay + APPEAR_DURATION + APPEAR_BUFFER);
        }
        const setContainerRef = (el: any) => {
            containerEl.value = el?.$el ?? el ?? null;
        }
        const scrollToTop = () => {
            const el = containerEl.value;
            if (el && 'scrollTop' in el) {
                el.scrollTop = 0;
            }
        }
        const triggerAppear = (count: number) => {
            animateItems.value = true;
            if (animateTimer) clearTimeout(animateTimer);
            animateTimer = setTimeout(() => {
                animateItems.value = false;
            }, calcAppearTotal(count));
        }
        watch(
            () => selectRow.value?.id,
            (cur, acc) => {
                if (!cur || cur === acc) return;
                const count = selectRow.value?.children?.filter(x => !x.children).length ?? 0;
                triggerAppear(count);
                nextTick(scrollToTop);
            },
            { immediate: true }
        )
        onBeforeUnmount(() => {
            if (animateTimer) clearTimeout(animateTimer);
        })


        const sortDisabled = ref(false);
        const dragToTreeDisabled = ref(false);
        const disabled = computed(() => {
            if (sortDisabled.value && dragToTreeDisabled.value) return true;
            return selectGroup.value?.id === 'window';
        })
        onMounted(async () => {
            sortDisabled.value = !await useMyStore.getItemDrag();
            dragToTreeDisabled.value = !await useMyStore.getItemDragToTree();
        })

        return {
            selectRow,
            selectGroup,
            isDrag,
            animateItems,
            row,
            appearDelay: APPEAR_DELAY,
            setContainerRef,
            disabled,
            sortDisabled,
            dragToTreeDisabled
        }
    },
    render() {

        return <VueDraggable
            ref={this.setContainerRef}
            modelValue={this.row ?? []}
            {...{
                ...this.$attrs,
                'onUpdate:modelValue': (v: BookmarkTreeNode[]) => {
                    this.row = v;
                },
                animation: 0,
                disabled: this.disabled,
                sort: !this.sortDisabled,
                ghostClass: 'item-ghost',
                group: { name: 'bookmarks', pull: !this.dragToTreeDisabled, put: false },
                onStart: () => {
                    this.isDrag = true;
                },
                onEnd: (event) => {
                    this.isDrag = false;
                    let e: SortableEvent & { data: BookmarkTreeNode, newIndex: number, oldIndex: number } = event as any;
                    if (event.from !== event.to) {
                        let parentId = event.to.dataset['id'];
                        let parentTitle = event.to.dataset['title'];
                        chrome.bookmarks.move(e.data.id, { parentId: parentId }, (result) => {
                            TinyNotify({
                                type: 'success',
                                position: 'top-right',
                                title: () => <div style={{ fontSize: '12px', fontWeight: '400px', wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflow: 'auto' }}>{i18n.t('NewTab.text.bookmark')} <span style={{ color: 'red' }}>{e.data.title}</span> {i18n.t('NewTab.text.success_move_to')}  <span style={{ color: 'red' }}>{parentTitle}</span></div>
                            })
                        });

                        return
                    }
                    if (event.from === event.to) {
                        if (e.newIndex === e.oldIndex) return;
                        let moveIndex;
                        let bookmark1 = e.data;

                        if ((e.newIndex + 1) === this.row?.length) {
                            let bookmark2 = this.row[e.newIndex - 1];
                            moveIndex = bookmark2.index! + 1;
                        }
                        else {
                            let bookmark2 = this.row![e.newIndex + 1];
                            moveIndex = bookmark2.index;
                        }

                        chrome.bookmarks.move(e.data.id, { index: moveIndex }, (result) => {
                            if (chrome.runtime.lastError) {
                            } else {
                            }
                        });
                    }
                },
            }}
        >
            {
                this.row?.map((x, i) => {
                    if (x.children) return <></>;

                    const title = getName(x);
                    const url = x.url;
                    return <div
                        key={x.id}
                        class={{ 'item': true, 'item-appear': this.animateItems && !this.isDrag }}
                        style={{ animationDelay: this.animateItems && !this.isDrag ? `${i * this.appearDelay}ms` : undefined, }}
                        onDblclick={(e: MouseEvent) => {
                            openUrl(x.url)
                        }}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault()
                            if (e.ctrlKey) {
                                openUrlInNewTab(x.url)
                                return;
                            }
                        }}
                        onContextmenu={(e) => {
                            e.preventDefault();
                            const rename = {
                                label: i18n.t('NewTab.update_bookmark'),
                                onClick: () => {
                                    i_rename({ x })
                                },
                            };
                            const open_new = {
                                label: i18n.t('NewTab.open_in_new_tab'),
                                onClick: () => {
                                    openUrlInNewTab(x?.url);
                                },
                            }
                            const open = {
                                label: i18n.t('NewTab.open_this_tab'),
                                onClick: () => {
                                    openUrl(x.url)
                                },
                            }
                            let del = {
                                label: i18n.t('NewTab.btn.delete'),
                                onClick: () => {
                                    i_del({ x })
                                },
                            };
                            let items = [rename, open_new, open, del];

                            if (this.selectGroup?.id === 'window') {
                                items = [open_new, open]
                            }

                            this.$contextmenu({
                                x: e.x,
                                y: e.y,
                                theme: 'mac',
                                items,
                            });

                        }}
                    >
                        <div style={{ width: '60px' }}>
                            <img
                                src={getFaviconUrl(url)}
                            />
                        </div>
                        <div style={{ width: 'calc(100% - 60px)' }}>
                            <div class={'title'} title={title}>
                                {title}
                            </div>
                            <div class={'url'} title={url}>
                                <a href={url}>{url}</a>
                            </div>
                        </div>
                    </div>
                })
            }
        </VueDraggable>
    }
})
