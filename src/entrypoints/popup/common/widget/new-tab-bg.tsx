import Bgvideo from "@/entrypoints/bg/widget/bgvideo";
import { isNil } from "es-toolkit";
import { v4 } from "uuid";
import { ResourceType, ShowImageConfig, Style_Image, Style_Video, useMyStore } from "../util";

export default defineComponent({
    props: {
        config: {
            type: Object as PropType<ShowImageConfig>,
        }
    },
    emits: ['ok'],
    setup() {
        const opacity = ref()
        onMounted(async () => {

            opacity.value = await useMyStore.getOpacity()
        })
        return {
            opacity
        }
    },
    render() {

        if (!isNil(this.config)) {
            if (this.config.type === ResourceType.Image) {
                this.$emit('ok')
                return <>
                    {
                        <div id="bg-location" style={{
                            backgroundImage: `url(${this.config.url})`,
                            opacity: this.opacity
                        }} />
                    }
                    <Style_Image />
                </>
            } else if (this.config.type === ResourceType.Video) {
                return <>
                    <Bgvideo url={this.config.url} key={v4()} onOk={() => {
                        this.$emit('ok')
                    }} />
                    <Style_Video />
                </>
            }
        }
        return <></>
    }
})
