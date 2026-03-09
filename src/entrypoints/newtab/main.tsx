import ContextMenu from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import 'normalize.css';
import { createApp } from 'vue';
import { BgType, newTabBgInitSerice, ResourceType, ShowImageConfig, useMyStore } from '../popup/common/util';
import NewTabBg from '../popup/common/widget/new-tab-bg';
import App from './App';
import './style.scss';
import { isNil } from 'es-toolkit';

useMyStore.getBgTab().then(tab => {
    const defaultConfig = new ShowImageConfig({ url: '', type: ResourceType.Video });
    const bg_setup = (config?: ShowImageConfig) => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        const app = createApp(
            <NewTabBg
                config={config}
                onOk={() => {
                    newTabBgInitSerice.next({})
                }}
            />
        );
        app.mount(div);
    }
    if (tab === BgType.Default) {
        bg_setup(defaultConfig)
        return;
    }
    browser.runtime.sendMessage({ action: 'getBg' }, (response) => {
        const { models } = response;

        let model = models?.[tab ?? BgType.Default];
        let index = model?.locationImageIndex;
        if (isNil(index)) {
            bg_setup(defaultConfig)
            return;
        }

        let config: ShowImageConfig | undefined;
        if (tab === BgType.Location) {
            let imgs = model?.locationImages ?? [];
            config = new ShowImageConfig({ url: imgs[index] ?? '', type: ResourceType.Image })
        }
        if (tab === BgType.Internet) {
            config = model?.internetImages?.[index]
        }

        bg_setup(config)
    })
})

createApp(App).use(ContextMenu).mount('#app')
