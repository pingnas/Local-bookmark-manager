import { BgConfig, readFromImage, updateModelService, windowRatio } from "@/entrypoints/popup/common/util";
import { Button, FileUpload, TinyNotify } from "@opentiny/vue";
import { useDebounceFn } from "@vueuse/core";
import { isNil } from "es-toolkit";


export default defineComponent({
    setup() {
        const { ratio } = windowRatio()

        return {
            ratio
        }
    },
    render() {
        const model1: ComputedRef<BgConfig> = inject('model') as ComputedRef<BgConfig>
        let model = model1.value;
        if (isNil(model)) return <></>
        return <>
            <div class={'flex gap-20'}>
                <FileUpload
                    accept='image/*'
                    action=''
                    show-file-list={false}
                    auto-upload={false}
                    multiple={true}
                    {
                    ...{
                        onChange: async (res: { raw: File; }) => {
                            let file: File = res.raw;

                            if (file.size > 15 * 1024 * 1024) {
                                TinyNotify({
                                    type: 'error',
                                    message: i18n.t('bg.notify.max_size'),
                                    position: 'top-right'
                                })
                                return;
                            }

                            if (/image\//.test(file.type)) {
                                let obj = await readFromImage(file);
                                model.locationImages?.push(obj)

                                upload_success()
                            } else {
                                TinyNotify({
                                    type: 'error',
                                    message: i18n.t('bg.notify.upload_error_format'),
                                    position: 'top-right'
                                })
                            }
                        }
                    }
                    }
                    v-slots={{
                        trigger: () => <Button
                            type='info'
                            size='medium'
                            resetTime={0}
                        >
                            {i18n.t('bg.btn.upload')}
                        </Button>
                    }}
                />
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
                    model.locationImages?.map((img, index) => <div
                        style={{
                            backgroundImage: `url(${img})`,
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
                    )
                }
            </div>
        </>
    }
})
const upload_success = useDebounceFn(() => {
    updateModelService.next({})
    TinyNotify({
        type: 'success',
        message: i18n.t('bg.notify.upload_success'),
        position: 'top-right'
    })
}, 50, { maxWait: 100 })