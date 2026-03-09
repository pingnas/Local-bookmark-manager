// 修复eval问题
// https://github.com/airbnb/lottie-web/issues/3025
import lottie from "lottie-web/build/player/lottie_light"

const LottieAni = defineComponent({
    setup() {
        const lottieBoxRef = useTemplateRef<HTMLDivElement>('lottieBox');
        let lottieBox = ref();
        const start = () => {
            lottieBox.value = lottie.loadAnimation({
                container: lottieBoxRef.value!,
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: '/loading.json',
            });
        }
        onMounted(() => {
            start()
        })
        const end = () => {
            lottieBox.value.destroy()
            lottieBox.value = null
        }
        return {
            start,
            end,
        }
    },
    render() {

        return <div
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div ref="lottieBox"
                    style={{
                        width: '40%',
                        height: '40%',
                    }}
                />
            </div>
        </div>
    }
})

export default LottieAni;

export type WidgetType_LottieAni = InstanceType<typeof LottieAni>
