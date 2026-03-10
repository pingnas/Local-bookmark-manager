import { openUrlInNewTab } from "@/entrypoints/common/util"
import { RiApps2Line, RiDownload2Line, RiFlagLine, RiHistoryLine, RiPuzzleLine, RiSettings4Line } from "vue-icons-plus/ri"

export default defineComponent({
    setup(p, { attrs }) {

        return () => <>
            <div
                {...attrs}
                style={{
                    cursor: 'pointer',
                    gap: '10px',
                }}
                class={'shortcut'}
            >
                {
                    h(RiFlagLine,
                        {
                            color: 'black',
                            onClick: () => {
                                openUrlInNewTab('chrome://flags/');
                            }
                        }
                    )
                }
                {
                    h(RiPuzzleLine,
                        {
                            color: 'black',
                            onClick: () => {
                                openUrlInNewTab('chrome://extensions/');
                            }
                        }
                    )
                }
                {
                    h(RiSettings4Line,
                        {
                            color: 'black',
                            onClick: () => {
                                openUrlInNewTab('chrome://settings/');
                            }
                        }
                    )
                }
                {
                    h(RiDownload2Line,
                        {
                            color: 'black',
                            onClick: () => {
                                openUrlInNewTab('chrome://downloads/');
                            }
                        }
                    )
                }
                {
                    h(RiHistoryLine,
                        {
                            color: 'black',
                            onClick: () => {
                                openUrlInNewTab('chrome://history/');
                            }
                        }
                    )
                }
                {
                    h(RiApps2Line,
                        {
                            color: 'black',
                            onClick: () => {
                                openUrlInNewTab('chrome://apps/');
                            }
                        }
                    )
                }
            </div >
        </>
    }
})