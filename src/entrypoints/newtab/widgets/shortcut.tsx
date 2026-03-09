import { openUrlInNewTab } from "@/entrypoints/popup/common/util"
import { AiOutlineAppstore, AiOutlineSetting } from "vue-icons-plus/ai"
import { BiHistory } from "vue-icons-plus/bi"
import { IoExtensionPuzzleOutline } from "vue-icons-plus/io"
import { LiaDownloadSolid } from "vue-icons-plus/lia"
import Action from "./action"

export default defineComponent({
    setup(p, { attrs }) {

        return () => <>
            <div
                {...attrs}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '10px',
                }}
            >
                <Action isDrag={false} />
                {
                    h(IoExtensionPuzzleOutline,
                        {
                            color: '#6d28d9',
                            onClick: () => {
                                openUrlInNewTab('chrome://extensions/');
                            }
                        }
                    )
                }
                {
                    h(AiOutlineSetting,
                        {
                            color: '#6d28d9',
                            onClick: () => {
                                openUrlInNewTab('chrome://settings/');
                            }
                        }
                    )
                }
                {
                    h(LiaDownloadSolid,
                        {
                            color: '#6d28d9',
                            onClick: () => {
                                openUrlInNewTab('chrome://downloads/');
                            }
                        }
                    )
                }
                {
                    h(BiHistory,
                        {
                            color: '#6d28d9',
                            onClick: () => {
                                openUrlInNewTab('chrome://history/');
                            }
                        }
                    )
                }
                {
                    h(AiOutlineAppstore,
                        {
                            color: '#6d28d9',
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