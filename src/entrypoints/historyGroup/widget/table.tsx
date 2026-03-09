import { createUrlToGroup, delService, getAllBookmarkUrlsByTreeNodes, getFaviconUrl, getName, openUrlInNewTab, useMyStore, useSize } from '@/entrypoints/popup/common/util';
import PopConfirm from "@/entrypoints/popup/common/widget/pop-confirm";
import { Button } from "@opentiny/vue";
import { AllCommunityModule, CellStyleModule, ColDef, ModuleRegistry, RowDragModule, themeQuartz, type GridApi, type GridReadyEvent } from "ag-grid-community";
import { AgGridVue, } from "ag-grid-vue3";
import { AiOutlineDelete, AiOutlineLink } from "vue-icons-plus/ai";

ModuleRegistry.registerModules([
    AllCommunityModule,
    CellStyleModule,
    RowDragModule,
]);

const FullWidthCellRenderer = defineComponent({
    props: {
        params: Object as PropType<{ data: BookmarkTreeNode, registerRowDragger: (rowDraggerElement: HTMLElement, dragStartPixels: any, value: any, suppressVisibilityChange: any) => void, eParentOfValue: HTMLElement }>,
        default: () => { }
    },
    setup(p) {
        let x = p.params?.data;
        return () => {
            let k = inject('k') as ComputedRef<string>;
            if (x?.children?.length) {
                return <div class={'flex full-widget-group'}>
                    <div class={'title'} title={getName(x)}>
                        {getName(x)}
                    </div>
                    <div style={{ gap: '20px', display: 'flex' }}>
                        <Button
                            size='medium'
                            resetTime={0}
                            icon={h(AiOutlineLink, { size: 20 })}
                            onClick={() => {
                                createUrlToGroup(getAllBookmarkUrlsByTreeNodes(x), x.title);
                            }}
                        ></Button>
                        <PopConfirm
                            onConfirm={() => {
                                delService.next({ x: x, key: k.value })
                            }}
                        >
                            <Button
                                type="danger"
                                size='medium'
                                resetTime={0}
                                icon={h(AiOutlineDelete, { size: 20 })}
                            ></Button>
                        </PopConfirm>
                    </div>
                </div>
            }
            return <div class={'flex full-widget-row'}>
                <div style={{ gap: '20px', display: 'flex' }}>
                    <Button
                        size='medium'
                        resetTime={0}
                        icon={h(AiOutlineLink, { size: 20 })}
                        onClick={() => {
                            openUrlInNewTab(x?.url);
                        }}
                    ></Button>
                    <PopConfirm
                        onConfirm={() => {
                            if (x) delService.next({ x: x, key: k.value })
                        }}
                    >
                        <Button
                            type="danger"
                            size='medium'
                            resetTime={0}
                            icon={h(AiOutlineDelete, { size: 20 })}
                        ></Button>
                    </PopConfirm>

                </div>
                <div style={{ width: '40px' }}>
                    <img
                        src={getFaviconUrl(x?.url)}
                    />
                </div>
                <div class={'title'} title={getName(x)}>
                    {getName(x)}
                </div>
                <div class={'url'} title={x?.url}>
                    <p>{x?.url}</p>
                </div>
            </div>;
        }
    }
})

export default defineComponent({
    components: {
        FullWidthCellRenderer,
    },
    props: {
        rowData: {
            type: Array as PropType<any[]>,
            default: () => []
        },
        k: {
            type: String,
            default: () => ''
        }
    },
    setup(p) {
        const tableRef = useTemplateRef('table');
        const api = ref<GridApi | undefined>(undefined);
        const { sizeColumnsToFit } = useSize(api)
        const height = ref(600)

        const colDefs = ref<ColDef[]>([
            { field: "favIconUrl", headerName: "FavIcon", },
            { field: "title", },
            { field: "url" },
        ]);
        watch(
            () => computed(() => p.rowData?.length),
            (cur, acc) => {
                if (cur.value > 0) {
                    height.value = cur.value * 60;
                    sizeColumnsToFit()
                } else {
                    height.value = 600;
                }
            },
            {
                immediate: true,
                deep: true,
            }
        )
        provide('k', computed(() => p.k))

        watch(
            () => useMyStore.id,
            async (cur, acc) => {
                sizeColumnsToFit()
            },
            {
                immediate: true,
                deep: true,
            }
        )

        return () => <AgGridVue
            ref='tableRef'
            class="ag-theme-balham ag-table"
            {
            ...{
                rowData: p.rowData ?? [],
                style: { height: height.value + 3 + 'px' },
                columnDefs: colDefs.value.map(x => ({ ...x, resizable: false, suppressMovable: true, })),
                onGridReady: (params: GridReadyEvent) => {
                    api.value = params.api;
                    sizeColumnsToFit()
                },
                theme: themeQuartz.withParams({
                    headerRowBorder: 'none',
                }),
                headerHeight: 0,
                rowHeight: 60,
                isFullWidthRow(params) {
                    return true;
                },
                fullWidthCellRenderer: 'FullWidthCellRenderer',
            }
            }
        />
    }
})

