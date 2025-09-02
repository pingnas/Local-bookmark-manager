import { BgConfig, BgType, ResourceType, setBgTempelteService, ShowImageConfig, Style_Image, Style_Video, useMyStore } from "@/entrypoints/popup/common/util";
import { isNil } from "es-toolkit";
import { Subscription } from "rxjs";
import Bgvideo from "./bgvideo";

export default defineComponent({
    emits: ['ok'],
    setup() {
        let r1: Subscription;
        const tabIndex = ref();
        const opacity = ref()
        onMounted(async () => {
            r1 = setBgTempelteService.subscribe(x => {
                tabIndex.value = x.x
            })
            opacity.value = await useMyStore.getOpacity()
        })

        onUnmounted(() => {
            r1?.unsubscribe()
        })

        return {
            tabIndex, opacity
        }
    },
    render() {
        const {
            $emit,
            tabIndex,
            opacity
        } = this
        const defaultConfig = new ShowImageConfig({ url: '', type: ResourceType.Video });

        const getTemp = (config?: ShowImageConfig) => {
            if (!isNil(config)) {
                if (config.type === ResourceType.Image) {
                    $emit('ok')
                    return <>
                        {
                            <div id="bg-location" style={{
                                backgroundImage: `url(${config.url})`,
                                opacity: opacity
                            }} />
                        }
                        <Style_Image />
                    </>
                } else if (config.type === ResourceType.Video) {
                    return <>
                        <Bgvideo url={config.url} onOk={() => {
                            $emit('ok')
                        }} />
                        <Style_Video />
                    </>
                }
            }
            return <></>
        }
        if (tabIndex === BgType.Default) {
            return getTemp(defaultConfig)
        }

        const model1: ComputedRef<BgConfig> = inject('model') as ComputedRef<BgConfig>
        let model = model1?.value;
        if (isNil(model)) return getTemp(defaultConfig)
        if (isNil(model?.locationImageIndex)) return getTemp(defaultConfig);

        let config;
        if (tabIndex === BgType.Location) {
            config = new ShowImageConfig({
                url: model.locationImages?.[model.locationImageIndex ?? 0] ?? '', type: ResourceType.Image
            })
        }
        if (tabIndex === BgType.Internet) {
            config = model.internetImages?.[model.locationImageIndex ?? 0]
        }
        return getTemp(config)
    }
})
