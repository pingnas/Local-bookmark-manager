import { useElementSize, useWindowSize } from '@vueuse/core';
import { CSSProperties } from 'vue';

export const useBookmarksGroupSize = () => {

    const domRef = ref<HTMLDivElement>();
    const { width, height } = useElementSize(domRef)

    return { domRef, width, height, }
}



export const useLayoutSize = () => {
    const _treeMenuWidth = '380px';
    const _treeMinHeight = '600px';
    const { width: windowWidth, height: windowHeight } = useWindowSize()

    const isMobile = computed(() => windowWidth.value < parseInt(_treeMenuWidth) * 3)

    const leftStyle = computed<CSSProperties>(() => {

        return {
            width: _treeMenuWidth,
            padding: '12px',
            height: `calc(100vh - 12 * 2px)`,
            minHeight: _treeMinHeight
        }
    });

    const rightStyle = computed<CSSProperties>(() => {

        return {
            width: _treeMenuWidth,
            padding: '12px',
            height: `calc(100vh - 12 * 2px)`,
            minHeight: _treeMinHeight
        }
    });

    const centerStyle = computed<CSSProperties>(() => {

        return {
            width: `calc(100vw - ${leftStyle.value?.width} - ${rightStyle.value?.width} - 12px * 4)`,
        }
    });

    const centerBottomStyle = computed<CSSProperties>(() => {

        return {
            padding: '12px',
            height: `calc(100vh - 100px - 12px*3)`,
            minHeight: `calc(${_treeMinHeight} - 100px - 12px)`
        }
    });
    return { leftStyle, rightStyle, centerStyle, isMobile, centerBottomStyle }

}
