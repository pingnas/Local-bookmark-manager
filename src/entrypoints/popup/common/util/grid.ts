import { useEventListener } from "@vueuse/core";
import { GridApi } from "ag-grid-community";

export const useSize = (api?: Ref<GridApi | undefined>) => {
    onMounted(() => {
        useEventListener('resize', sizeColumnsToFit,)
    })
    const sizeColumnsToFit = () => {
        setTimeout(function () {
            api?.value?.sizeColumnsToFit?.();
            setTimeout(function () {
                api?.value?.sizeColumnsToFit?.();
            }, 200);
        }, 20);
    }


    return { sizeColumnsToFit }
}
