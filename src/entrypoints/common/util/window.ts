import { useWindowSize } from "@vueuse/core"

export const windowRatio = () => {
    const { width: windowWidth, height: windowHeight } = useWindowSize()
    const ratio = computed(() => {
        return windowWidth.value / windowHeight.value
    })
    return { windowWidth, windowHeight, ratio }
}