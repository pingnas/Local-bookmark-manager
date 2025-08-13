import { dialogManager } from "@/entrypoints/popup/common/util";
import PopConfirm from "@/entrypoints/popup/common/widget/pop-confirm";
import { TinyNotify, Button } from "@opentiny/vue";

export const i_del = (obj: {
    x: BookmarkTreeNode,
}) => {
    const { x } = obj;
    let dialogId = dialogManager.open({
        default: () => {
            return <div>
                <h3 style='color:red'>{i18n.t('NewTab.confirm.delete_bookmark_title')}</h3>
            </div>
        },
        footer: () => {
            return <div class={'flex gap-20'} style={{ justifyContent: 'flex-end' }}>
                <PopConfirm
                    onConfirm={() => {
                        chrome.bookmarks.removeTree(x.id, function () {
                            dialogManager.close(dialogId);
                            TinyNotify({
                                type: 'success',
                                message: i18n.t('NewTab.notify.delete_success'),
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
        title: i18n.t('NewTab.confirm.delete'),
    });
}