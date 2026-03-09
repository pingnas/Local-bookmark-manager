import { dialogManager, TreeBookmarks } from "@/entrypoints/popup/common/util";
import { Button, Form, FormItem, Input, TinyNotify } from "@opentiny/vue";

export const t_b_rename = (obj: {
    x: TreeBookmarks,
}) => {
    const { x } = obj;

    const model = reactive({
        new_name: x.node.title,
    });
    const ruleFormRef = ref()
    let dialogId = dialogManager.open({
        title: i18n.t('NewTab.rename'),
        default: () => {
            return <Form
                model={model}
                size='medium'
                ref={ruleFormRef}
                label-position="top"
                rules={{
                    new_name: [
                        { required: true, message: i18n.t('NewTab.required'), trigger: 'blur' },
                    ],
                }}
            >
                <FormItem label={i18n.t('NewTab.text.newName')} prop='new_name'>
                    <Input v-model={model.new_name}
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
                                chrome.bookmarks.update(x.node.id, {
                                    title: model['new_name']
                                })
                                dialogManager.close(dialogId);
                                TinyNotify({
                                    type: 'success',
                                    message: i18n.t('NewTab.notify.rename_success'),
                                    position: 'top-right'
                                })
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
}