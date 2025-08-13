import { dialogManager, TreeBookmarks } from "@/entrypoints/popup/common/util";
import { Form, FormItem, Input, Button, TinyNotify } from "@opentiny/vue";

export const t_b_addFolder = (obj: {
    x: TreeBookmarks,
}) => {
    const { x } = obj;

    const model = reactive({
        folder_name: undefined,
    });
    const ruleFormRef = ref()

    let dialogId = dialogManager.open({
        title: i18n.t('NewTab.newfolder'),
        default: () => {
            return <Form
                model={model}
                size='medium'
                ref={ruleFormRef}
                label-position="top"
                rules={{
                    folder_name: [
                        { required: true, message: i18n.t('NewTab.required'), trigger: 'blur' },
                    ],
                }}
            >
                <FormItem label={i18n.t('NewTab.text.addFolder')} prop='folder_name'>
                    <Input v-model={model.folder_name}
                        clearable
                    />
                </FormItem>
            </Form>
        },
        footer: () => {
            return <>
                <Button type='primary' size='medium' reset-time={0}
                    onClick={() => {
                        ruleFormRef.value?.validate((valid: boolean) => {
                            if (valid) {
                                chrome.bookmarks.create({
                                    title: model['folder_name'],
                                    parentId: x.node.id,
                                    index: 0
                                }, function (bookmark) {
                                    dialogManager.close(dialogId);
                                    TinyNotify({
                                        type: 'success',
                                        message: i18n.t('NewTab.confirm.newfolder_success'),
                                        position: 'top-right'
                                    })
                                });
                            }
                        })
                    }}
                >{i18n.t('NewTab.btn.confirm')}</Button>
                <Button size='medium' reset-time={0}
                    onClick={() => {
                        ruleFormRef.value?.
                            resetFields();
                    }}>{i18n.t('NewTab.btn.reset')}</Button>
                <Button type="primary" size='medium'
                    reset-time={0}
                    onClick={() => {
                        dialogManager.close(dialogId);
                    }}>
                    {i18n.t('NewTab.btn.close')}
                </Button>
            </>
        }
    });
}
