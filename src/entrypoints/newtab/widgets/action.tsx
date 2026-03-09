import { useBookmarks } from '@/entrypoints/popup/common/data'
import { dialogManager, reload, useMyStore } from '@/entrypoints/popup/common/util'
import PopConfirm from '@/entrypoints/popup/common/widget/pop-confirm'
import { Button, Form, FormItem, Input, RadioButton, RadioGroup, TinyNotify } from '@opentiny/vue'
import { useDraggable, useWindowSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { AiOutlineSetting } from 'vue-icons-plus/ai'
import { MdOutlineSettingsSuggest } from 'vue-icons-plus/md'

export default defineComponent({
    props: {
        isDrag: {
            type: Boolean,
            default: true
        },
    },
    setup() {

        const el = useTemplateRef<HTMLElement>('el')
        const { openAllBookmarks, delEmptyBookmarks } = useBookmarks();

        const { width: windowWidth, height: windowHeight } = useWindowSize()

        const { x, y, style } = useDraggable(el, {
            initialValue: { x: windowWidth.value - 100, y: windowHeight.value - 100 },
        })

        return {
            el,
            x, y,
            windowWidth, windowHeight,
            openAllBookmarks, delEmptyBookmarks
        }
    },
    render() {

        const click = async () => {

            const model = reactive({
                itemDrag: await useMyStore.getItemDrag(),
                itemDragToTree: await useMyStore.getItemDragToTree(),
                searchEngines: await useMyStore.getSearchEngines(),
                otherSearchEngines: await useMyStore.getOtherSearchEngines(),
                enableDefaultContextMenu: await useMyStore.getEnableDefaultContextMenu(),
            });
            const ruleFormRef = ref()

            const rule = computed(() => ({
                itemDrag: [
                    { required: true, message: i18n.t('NewTab.required'), trigger: ['change', 'blur'] },
                ],
                itemDragToTree: [
                    { required: true, message: i18n.t('NewTab.required'), trigger: ['change', 'blur'] },
                ],
                searchEngines: [
                    { required: true, message: i18n.t('NewTab.required'), trigger: ['change', 'blur'] },
                ],
                enableDefaultContextMenu: [
                    { required: true, message: i18n.t('NewTab.required'), trigger: ['change', 'blur'] },
                ],
                otherSearchEngines: [
                    {
                        required: model.searchEngines === '3', message: i18n.t('NewTab.required'), trigger: ['change', 'blur'],
                    },
                    {
                        validator: model.searchEngines === '3' ? (rule: any, value: any, callback: any) => {
                            try {
                                new URL(value);
                                callback()
                            } catch (e) {
                                callback(new Error(i18n.t('NewTab.invalidUrl')))
                            }
                        } : null, trigger: 'blur'
                    }
                ],
            }))

            let dialogId = dialogManager.open({
                default: () => {


                    let form = <Form
                        model={model}
                        size='medium'
                        ref={ruleFormRef}
                        label-position="top"
                        rules={rule.value}
                    >
                        <FormItem label={i18n.t('NewTab.text.bookmark_can_drag')} prop='itemDrag'>
                            <RadioGroup
                                v-model={model.itemDrag}
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
                                    [{ label: i18n.t('NewTab.text.yes'), value: true }, { label: i18n.t('NewTab.text.no'), value: false }].map(x => {
                                        return <RadioButton label={x.value}>{x.label}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </FormItem>
                        <FormItem label={i18n.t('NewTab.text.bookmark_can_drag_to_folder')} prop='itemDragToTree'>
                            <RadioGroup
                                v-model={model.itemDragToTree}
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
                                    [{ label: i18n.t('NewTab.text.yes'), value: true }, { label: i18n.t('NewTab.text.no'), value: false }].map(x => {
                                        return <RadioButton label={x.value}>{x.label}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </FormItem>
                        <FormItem label={i18n.t('NewTab.text.search_engine')} prop='searchEngines'>
                            <RadioGroup
                                v-model={model.searchEngines}
                                fill="#6d28d9"
                                text-color="#fff"
                                size='medium'
                                style={{
                                    gap: '10px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    width: '100%'
                                }}
                                {...{
                                    onChange: (e: string) => {
                                        if (e === '3') {
                                        } else {
                                            model.otherSearchEngines = ''
                                        }
                                    }
                                }}
                            >
                                {
                                    [{ label: i18n.t('NewTab.text.baidu'), value: '1' }, { label: i18n.t('NewTab.text.google'), value: '2' }, { label: i18n.t('NewTab.text.other'), value: '3' }].map(x => {
                                        return <RadioButton label={x.value}>{x.label}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </FormItem>
                        <FormItem prop='otherSearchEngines' class={{ 'hide': model.searchEngines !== '3' }}>
                            <Input
                                v-model={model.otherSearchEngines}
                                clearable
                                {
                                ...{
                                    placeholder: i18n.t('NewTab.text.invalid_search_engine'),
                                }
                                }
                            />
                        </FormItem>
                        <FormItem label={i18n.t('NewTab.text.enable_default_context_menu')} prop='enableDefaultContextMenu'>
                            <RadioGroup
                                v-model={model.enableDefaultContextMenu}
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
                                    [{ label: i18n.t('NewTab.text.yes'), value: true }, { label: i18n.t('NewTab.text.no'), value: false }].map(x => {
                                        return <RadioButton label={x.value}>{x.label}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </FormItem>
                        <FormItem label={i18n.t('NewTab.text.delete_empty_folder')} >
                            <div>
                                <PopConfirm
                                    onConfirm={() => {
                                        this.delEmptyBookmarks()
                                        TinyNotify({
                                            type: 'success',
                                            message: i18n.t('NewTab.notify.clear_success'),
                                            position: 'top-right'
                                        })
                                    }}
                                >
                                    <Button
                                        type="danger"
                                        size='medium'
                                        reset-time={0}
                                    >
                                        {i18n.t('NewTab.btn.delete')}
                                    </Button>
                                </PopConfirm>
                            </div>
                        </FormItem>
                    </Form>

                    return <>
                        {form}
                    </>
                },
                title: i18n.t('NewTab.text.setting'),
                footer: () => {
                    return <>
                        <Button
                            type='primary'
                            size='medium'
                            reset-time={0}
                            onClick={() => {
                                ruleFormRef.value?.validate((valid: boolean) => {
                                    if (valid) {
                                        useMyStore.setItemDrag(model.itemDrag);
                                        useMyStore.setItemDragToTree(model.itemDragToTree);
                                        useMyStore.setSearchEngines(model.searchEngines);
                                        useMyStore.setOtherSearchEngines(model.otherSearchEngines);
                                        useMyStore.setEnableDefaultContextMenu(model.enableDefaultContextMenu);

                                        dialogManager.close(dialogId);
                                        TinyNotify({
                                            type: 'success',
                                            message: i18n.t('NewTab.notify.update_success'),
                                            position: 'top-right'
                                        })
                                        setTimeout(() => {
                                            reload()
                                        }, 100);
                                    }
                                })
                            }}
                        >{i18n.t('NewTab.btn.confirm')}
                        </Button>
                        <Button
                            size='medium'
                            reset-time={0}
                            onClick={() => {
                                ruleFormRef.value?.
                                    resetFields();
                            }}
                        >{i18n.t('NewTab.btn.reset')}
                        </Button>
                        <Button
                            type="primary"
                            size='medium'
                            reset-time={0}
                            onClick={() => {
                                dialogManager.close(dialogId);
                            }}
                        >{i18n.t('NewTab.btn.close')}
                        </Button>
                    </>
                }
            });
        };

        if (this.isDrag) {
            return <div ref="el"
                style={{
                    position: 'fixed',
                    zIndex: 1,
                    left: this.x + 'px',
                    top: this.y + 'px',
                }}
            >
                <Button
                    type="info"
                    size='medium'
                    icon={AiOutlineSetting}
                    reset-time={0}
                    onClick={click}
                />
            </div >
        }
        return h(MdOutlineSettingsSuggest,
            {
                color: '#6d28d9',
                onClick: click
            }
        )
    }
})
