import { openUrlInNewTab } from "@/entrypoints/common/util";
import RiApps2Line from '~icons/ri/apps-2-line';
import RiDownload2Line from '~icons/ri/download-2-line';
import RiFlagLine from '~icons/ri/flag-line';
import RiHistoryLine from '~icons/ri/history-line';
import RiPuzzleLine from '~icons/ri/puzzle-line';
import RiSettings4Line from '~icons/ri/settings-4-line';

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
                            "font-size": 19,
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
                            "font-size": 19,
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
                            "font-size": 19,
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
                            "font-size": 19,
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
                            "font-size": 19,
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
                            "font-size": 19,
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