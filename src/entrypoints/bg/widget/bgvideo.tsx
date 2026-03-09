import { useBgVideo } from "@/entrypoints/popup/common/data";
import { useMyStore } from "@/entrypoints/popup/common/util";
import { useEventListener } from "@vueuse/core";

export default defineComponent({
    props: {
        url: {
            type: String,
        },
        id: {
            type: String,
            default: 'bg-video'
        }
    },
    emits: ['ok'],
    setup(_, { emit }) {
        const { videoUrl, } = useBgVideo();
        const videoRef = useTemplateRef<HTMLVideoElement>('video');
        nextTick(() => {
            useEventListener(videoRef.value, 'canplaythrough', async () => {
                videoRef.value!.style.opacity = await useMyStore.getOpacity() + ''; // 渐显效果
                emit('ok');
            })
        })
        return {
            videoUrl, videoRef
        }
    },
    render() {
        const {
            $attrs,
            id,
            url,
            videoUrl,
        } = this
        return h(
            'video',
            {
                ...$attrs,
                id,
                ref: 'video',
                autoplay: true,
                loop: true,
                muted: true,
                src: url ? url : videoUrl,
            }
        )
    }
})