import { Button, Popconfirm } from "@opentiny/vue"

const PhotoConfirm = defineComponent({
    props: {
        onConfirm: {
            type: Function,
            default: () => { }
        },
    },
    setup(p, { slots }) {
        const popconfirmRef = useTemplateRef<typeof Popconfirm>('popconfirm')
        return () => <>
            <Popconfirm
                title={i18n.t('HistoryGroup.confirm.delete')}
                type={'info'}
                ref={'popconfirm'}
                trigger='click'
                {
                ...{
                    onConfirm: () => {
                        p.onConfirm()
                    }
                }
                }
                v-slots={{
                    reference: () => slots.default?.(),
                    footer: () => <div>
                        <Button
                            type="primary"
                            resetTime={0}
                            onClick={() => {
                                popconfirmRef.value?.hide()
                            }}
                        >
                            {i18n.t('NewTab.btn.close')}
                        </Button>
                        <Button
                            type="info"
                            resetTime={0}
                            onClick={() => {
                                p.onConfirm()
                                popconfirmRef.value?.hide()
                            }}
                        >
                            {i18n.t('NewTab.btn.confirm')}
                        </Button>
                    </div>
                }}
            />
        </>
    }
})

export default PhotoConfirm;

export type WidgetType_PopConfirm = InstanceType<typeof PhotoConfirm>