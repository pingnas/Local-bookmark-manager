import { dialogManager, TreeBookmarks } from "@/entrypoints/popup/common/util";
import PopConfirm from "@/entrypoints/popup/common/widget/pop-confirm";
import { TinyNotify, Button } from "@opentiny/vue";

export const t_b_del = (obj: {
    x: TreeBookmarks,
}) => {
    const { x } = obj;
    let dialogId = dialogManager.open({
        title: i18n.t('NewTab.confirm.delete'),
        default: () => {
            return <div>
                <h3 style='color:red'>{i18n.t('NewTab.confirm.delete_bookmark_folder_title')}</h3>
            </div>
        },
        footer: () => {
            return <div class='flex gap-20 justify-content-end'>
                <PopConfirm
                    onConfirm={() => {
                        chrome.bookmarks.removeTree(x.node.id, function () {

                            dialogManager.close(dialogId);
                            TinyNotify({
                                type: 'success',
                                message: i18n.t('NewTab.notify.delete_bookmark_folder_success'),
                                position: 'top-right'
                            })
                        });
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
                <Button type="primary" size='medium'
                    reset-time={0}
                    onClick={() => {
                        dialogManager.close(dialogId);
                    }}>
                    {i18n.t('NewTab.btn.close')}
                </Button>
            </div>
        },
    });
}