import { dialogManager } from "@/entrypoints/popup/common/util";
import { Button, Form, FormItem, Input, TinyNotify } from "@opentiny/vue";

export const i_rename = (obj: {
    x: BookmarkTreeNode,
}) => {
    const { x } = obj;

    const model = reactive({
        new_name: x.title,
        new_url: x.url,
    });
    const ruleFormRef = ref()

    let dialogId = dialogManager.open({
        title: i18n.t('NewTab.update_bookmark'),
        default: () => {
            return <Form
                model={model}
                size='medium'
                ref={ruleFormRef}
                label-position="top"
                rules={{
                    new_url: [
                        { required: true, message: i18n.t('NewTab.required'), trigger: 'blur' },
                    ],
                }}
            >
                <FormItem label={i18n.t('NewTab.text.bookmarkName')} prop='new_name'>
                    <Input v-model={model.new_name}
                        clearable
                    />
                </FormItem>
                <FormItem label={i18n.t('NewTab.text.bookmarkUrl')} prop='new_url'>
                    <Input v-model={model.new_url}
                        clearable
                    />
                </FormItem>
            </Form>
        },
        footer: () => {
            return <>
                <Button
                    type='primary'
                    size='medium'
                    reset-time={0}
                    onClick={() => {
                        ruleFormRef.value?.validate((valid: boolean) => {
                            if (valid) {
                                chrome.bookmarks.update(x.id, {
                                    title: model['new_name'],
                                    url: model['new_url']
                                })
                                dialogManager.close(dialogId);
                                TinyNotify({
                                    type: 'success',
                                    message: i18n.t('NewTab.notify.update_success'),
                                    position: 'top-right'
                                })
                            }
                        })
                    }}
                >
                    {i18n.t('NewTab.btn.confirm')}
                </Button>
                <Button
                    size='medium'
                    reset-time={0}
                    onClick={() => {
                        ruleFormRef.value?.
                            resetFields();
                    }}
                >
                    {i18n.t('NewTab.btn.reset')}
                </Button>
                <Button
                    type="primary"
                    size='medium'
                    reset-time={0}
                    onClick={() => {
                        dialogManager.close(dialogId);
                    }}
                >
                    {i18n.t('NewTab.btn.close')}
                </Button>
            </>
        }
    });
}