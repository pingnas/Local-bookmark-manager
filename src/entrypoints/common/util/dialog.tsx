import { omit } from "lodash-es";
import { App } from "vue";
import { Button, DialogBox } from "@opentiny/vue";
import { VNode } from "vue";
import { DialogCloseService, DialogOpenService } from "./service";
import dayjs, { Dayjs } from "dayjs";
import { nanoid } from "nanoid";


class DialogApp {
    id: string;
    app: App<Element>;
    wrap: HTMLDivElement;
    createTime: Dayjs;
    constructor({ id, app, wrap, createTime }: { id: string, app: App<Element>, wrap: HTMLDivElement, createTime?: Dayjs }) {
        this.id = id;
        this.app = app;
        this.wrap = wrap;
        this.createTime = createTime ?? dayjs()
    }
}

class DialogManager {
    public apps: { [k: string]: DialogApp } = {};

    open(slot: { default?: () => VNode, footer?: () => VNode, title?: string },): string {
        let id = nanoid();
        const div = document.createElement("div");
        document.body.appendChild(div);
        const app = createApp(h(Dialog, { id: id, }));
        app.mount(div);
        Object.assign(this.apps, { [id]: new DialogApp({ id: id, app: app, wrap: div }) })

        DialogOpenService.trigger({ id: id, slot: slot })
        return id;
    }

    close(id: string) {
        const app = this.apps[id];
        if (app) {
            DialogCloseService.trigger({ id, })
            setTimeout(() => {
                app.app.unmount();
                app.wrap.remove();
                this.apps = omit(this.apps, [id])
            }, 200);
        }
    }

}

export const dialogManager = new DialogManager();


export const Dialog = defineComponent({
    props: {
        id: {
            type: String,
            default: () => nanoid()
        }
    },
    setup(p) {
        const data = reactive({
            dialogboxVisibility: false,
            default: () => <div></div>,
            footer: () => <div></div>,
            title: '',
            default1: () => <div></div>,
            footer1: () => {
                return <Button type="primary" size='medium'
                    reset-time={0}
                    onClick={close}>{i18n.t('NewTab.btn.close')}</Button>
            },
            title1: 'Action',
        })
        const dialogboxRef = useTemplateRef<InstanceType<typeof DialogBox>>("dialogbox")

        const open = (slot: { default?: () => VNode, footer?: () => VNode, title?: string },) => {
            data.default = slot?.default ?? data.default1;
            data.footer = slot.footer ?? data.footer1;
            data.title = slot.title ?? data.title1;
            data.dialogboxVisibility = true;

        }
        const close = () => {
            dialogManager.close(p.id)
        }

        let dialogOpenListener: { off: () => void } | undefined
        let dialogCloseListener: { off: () => void } | undefined
        onMounted(() => {
            dialogOpenListener = DialogOpenService.on(x => {
                if (x.id === p.id) {
                    open(x.slot)
                }
            })
            dialogCloseListener = DialogCloseService.on(x => {
                if (x.id === p.id) {
                    data.dialogboxVisibility = false;
                }
            })
        })
        onUnmounted(() => {
            dialogOpenListener?.off()
            dialogCloseListener?.off()
        })
        return {
            data,
            dialogboxRef,
        }
    },
    render() {
        return <DialogBox
            ref={"dialogbox"}
            showClose={false}
            visible={this.data.dialogboxVisibility}
            dialog-transition="enlarge"
            destroyOnClose={true}
            title={this.data.title}
            width="50%"
            top='30px'
            v-slots={{
                default: this.data.default,
                footer: this.data.footer,
            }}
            modal={false}
            draggable
            drag-outside-window={false}
        />
    }
})
