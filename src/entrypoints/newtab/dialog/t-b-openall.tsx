import { TreeBookmarks, getAllBookmarkUrls, dialogManager, createUrlToGroup } from "@/entrypoints/popup/common/util";
import { Button } from "@opentiny/vue";

export const t_b_openall = (obj: {
    x: TreeBookmarks,
}) => {
    const { x } = obj;
    let urls = getAllBookmarkUrls(x)
    let dialogId = dialogManager.open({
        title: i18n.t('NewTab.openAllFolder'),
        default: () => {
            return <div>
                <h3>{i18n.t('NewTab.confirm.openAllFolder_title')}<h3 style='color:red'> {i18n.t('NewTab.text.total')} {urls.length} {i18n.t('NewTab.text.total_boookmark')}</h3></h3>
            </div>
        },
        footer: () => {
            return <>
                <Button type='primary' size='medium' style={{}} resetTime={0}
                    onClick={() => {
                        createUrlToGroup(urls, x.node.title);
                        dialogManager.close(dialogId);
                    }}
                >
                    {i18n.t('NewTab.btn.confirm')}
                </Button>
                <Button type="primary" size='medium'
                    reset-time={0}
                    onClick={() => {
                        dialogManager.close(dialogId);
                    }}>
                    {i18n.t('NewTab.btn.close')}
                </Button>
            </>
        },
    });
}