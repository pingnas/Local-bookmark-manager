import { BgConfig, ResourceType, ShowImageConfig, updateModelService, windowRatio } from "@/entrypoints/popup/common/util";
import { Button, Input, TinyNotify } from "@opentiny/vue";
import { isNil } from "es-toolkit";
import Bgvideo from "./bgvideo";

export default defineComponent({
    setup() {
        const data = reactive({
            url: null
        })
        const { ratio } = windowRatio()
        return {
            ratio,
            data,
        }
    },
    render() {
        const model1: ComputedRef<BgConfig> = inject('model') as ComputedRef<BgConfig>
        let model = model1.value;
        if (isNil(model)) return <></>

        return (
            <>
                <div class={'flex gap-20'}>
                    <Button
                        type='primary'
                        size='medium'
                        resetTime={0}
                        onClick={() => {
                            model.locationHide = !model.locationHide;
                            updateModelService.next({})
                        }}
                    >
                        {model.locationHide ? i18n.t('bg.btn.show') : i18n.t('bg.btn.hide')}
                    </Button>
                    <Input
                        v-model={this.data.url}
                        clearable
                        size="medium"
                        {
                        ...{
                            placeholder: i18n.t('bg.text.upload_input'),
                        }
                        }
                    />
                    <Button
                        type="info"
                        size='medium'
                        reset-time={0}
                        onClick={async () => {
                            if (!this.data.url) return;
                            getResourceTypeByFetch(this.data.url).then(x => {
                                if (x === ResourceType.Image || x === ResourceType.Video) {
                                    TinyNotify({
                                        type: 'success',
                                        message: i18n.t('bg.notify.add_success'),
                                        position: 'top-right'
                                    })
                                    model.internetImages?.push(new ShowImageConfig({ type: x, url: this.data.url! }))
                                    updateModelService.next({})
                                    this.data.url = null;
                                }
                            })
                        }}
                    >
                        {i18n.t('bg.btn.add')}
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        marginTop: '20px',
                    }}
                    class={{ 'hide': model.locationHide }}
                >
                    {
                        model.internetImages?.map((i, index) => {
                            if (i.type === ResourceType.Image) {
                                return <div
                                    style={{
                                        backgroundImage: `url(${i.url})`,
                                        width: 200 * this.ratio + 'px',
                                        height: '200px',
                                        border: `1px solid ${model.locationImageIndex === index ? 'red' : '#6d28d9'}`,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={() => {
                                        model.locationImageIndex = index;
                                        updateModelService.next({})
                                    }}
                                />
                            }
                            return <div
                                style={{
                                    width: 200 * this.ratio + 'px',
                                    height: '200px',
                                    border: `1px solid ${model.locationImageIndex === index ? 'red' : '#6d28d9'}`,
                                }}
                                onClick={() => {
                                    model.locationImageIndex = index;
                                    updateModelService.next({})
                                }}
                            >
                                <Bgvideo url={i.url} id={''} style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }} />
                            </div>
                        }
                        )
                    }
                </div>
            </>
        )
    }
})



const getResourceTypeByFetch = async (url: string) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType?.startsWith('image/')) {
                return ResourceType.Image;
            } else if (contentType?.startsWith('video/')) {
                return ResourceType.Video;
            } else {
                TinyNotify({
                    type: 'error',
                    message: i18n.t('bg.notify.add_error'),
                    position: 'top-right'
                })
                return ResourceType.Unknown;
            }
        } else {
            TinyNotify({
                type: 'error',
                message: showStatus(response.status),
                position: 'top-right'
            })
            return ResourceType.Error;
        }

    } catch (error) {
        console.error('Error fetching the resource:', error);
        return ResourceType.Error;
    }
}
export const showStatus = (status: number) => {
    let message = ''
    switch (status) {
        case 400:
            message = '请求错误(400)'
            break
        case 401:
            message = '未授权，请重新登录(401)'
            break
        case 403:
            message = '拒绝访问(403)'
            break
        case 404:
            message = '请求出错(404)'
            break
        case 408:
            message = '请求超时(408)'
            break
        case 500:
            message = '服务器错误(500)'
            break
        case 501:
            message = '服务未实现(501)'
            break
        case 502:
            message = '网络错误(502)'
            break
        case 503:
            message = '服务不可用(503)'
            break
        case 504:
            message = '网络超时(504)'
            break
        case 505:
            message = 'HTTP版本不受支持(505)'
            break
        default:
            message = `(${status})!`
    }
    return `${message}`
}