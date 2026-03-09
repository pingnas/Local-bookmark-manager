import { createUrlToGroup, delService, readFromJson, saveAsJson, useMyStore } from '@/entrypoints/popup/common/util';
import { Button, Col, FileUpload, Input, Row, TinyNotify } from '@opentiny/vue';
import dayjs from 'dayjs';
import { get, isNil, uniqBy } from 'es-toolkit/compat';
import { Subscription } from 'rxjs';
import { defineComponent } from 'vue';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineLink, AiOutlineSave } from 'vue-icons-plus/ai';
import PopConfirm from '../popup/common/widget/pop-confirm';
import { UseHistoryGroup } from '../popup/use';
import Table from './widget/table';


export default defineComponent({
  setup() {
    const historyGroup = ref<{ [id: string]: UseHistoryGroup }>();

    watch(
      () => useMyStore.id,
      async (cur, acc) => {
        historyGroup.value = await useMyStore.getHistoryGroup()
        console.log('historyGroup', historyGroup.value)
      },
      {
        immediate: true,
        deep: true,
      }
    )
    let delsubscribe: Subscription;
    onMounted(() => {

      delsubscribe = delService.subscribe(({ x, key }) => {

        let ids = [...x.children ?? [], x].map(x => x.id)
        let item = historyGroup.value?.[key];
        let children = (item?.children ?? []).filter(x => !ids.includes(x.id));
        if (children.length) {
          useMyStore.addHistoryGroup({
            [`${key}`]: new UseHistoryGroup({
              name: item?.name,
              children: (item?.children ?? []).filter(x => !ids.includes(x.id)),
              createdAt: item?.createdAt,
              updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })
          })
        } else {
          useMyStore.removeHistoryGroup(key)
        }
        TinyNotify({
          type: 'success',
          message: i18n.t('HistoryGroup.notify.delete_success'),
          position: 'top-right'
        })

      })
    })
    onUnmounted(() => {
      delsubscribe.unsubscribe();
    })

    return () => (
      <Row class={'wrap'}>
        <Col span={12} class={'header'}>
          {i18n.t('HistoryGroup.title')}
        </Col>
        <Col span={12} style={{
          display: 'flex',
          justifyContent: 'end',
          gap: '20px'
        }}>
          <PopConfirm
            onConfirm={() => {
              useMyStore.setHistoryGroup({})
              TinyNotify({
                type: 'success',
                message: i18n.t('HistoryGroup.notify.clear_success'),
                position: 'top-right'
              })
            }}
          >
            <Button
              type='danger'
              size='medium'
              resetTime={0}
            >
              {i18n.t('HistoryGroup.btn.clear')}
            </Button>
          </PopConfirm>

          <FileUpload
            accept='.json'
            action=''
            show-file-list={false}
            auto-upload={false}
            {
            ...{
              onChange: async (res: { raw: File; }) => {
                let file: File = res.raw;

                try {
                  let obj = await readFromJson(file);
                  useMyStore.setHistoryGroup(obj as any)
                  TinyNotify({
                    type: 'success',
                    message: i18n.t('HistoryGroup.notify.import_success'),
                    position: 'top-right'
                  })
                } catch (error) {
                  console.log(error);
                  TinyNotify({
                    type: 'error',
                    message: i18n.t('HistoryGroup.notify.import_error_format'),
                    position: 'top-right'
                  })
                }

              }
            }
            }
            v-slots={{
              trigger: () => <Button
                type='primary'
                size='medium'
                resetTime={0}
              >
                {i18n.t('HistoryGroup.btn.import_replace')}
              </Button>
            }}
          />
          <Button
            type='info'
            size='medium'
            resetTime={0}
            onClick={() => {
              historyGroup.value && saveAsJson(historyGroup.value)
              TinyNotify({
                type: 'success',
                message: i18n.t('HistoryGroup.notify.export_success'),
                position: 'top-right'
              })
            }}
          >
            {i18n.t('HistoryGroup.btn.export')}
          </Button>
          <FileUpload
            accept='.json'
            action=''
            show-file-list={false}
            auto-upload={false}
            {
            ...{
              onChange: async (res: { raw: File; }) => {
                let file: File = res.raw;

                try {
                  let obj: any = await readFromJson(file);
                  let data = await useMyStore.getHistoryGroup();
                  let keys = [...Object.keys(obj), ...Object.keys(data)];
                  keys = [...new Set(keys)];
                  let newObj: { [k: string]: UseHistoryGroup } = {};
                  keys.map(x => {
                    let a = get(obj, x, {})
                    let b = get(data, x, {})

                    let a_c = get(a, 'children', [])
                    let b_c = get(b, 'children', [])
                    let children = uniqBy([...a_c, ...b_c], 'id')
                    newObj[`${x}`] = {
                      ...a,
                      ...b,
                      children: children,
                    }
                  })

                  useMyStore.setHistoryGroup(newObj as any)
                  TinyNotify({
                    type: 'success',
                    message: i18n.t('HistoryGroup.notify.import_success'),
                    position: 'top-right'
                  })
                } catch (error) {
                  console.log(error);
                  TinyNotify({
                    type: 'error',
                    message: i18n.t('HistoryGroup.notify.import_error_format'),
                    position: 'top-right'
                  })
                }

              }
            }
            }
            v-slots={{
              trigger: () => <Button
                type='primary'
                size='medium'
                resetTime={0}
              >
                {i18n.t('HistoryGroup.btn.import_merge')}
              </Button>
            }}
          />
        </Col>
        {
          Object.keys(historyGroup.value ?? {}).reverse().map(key => {
            let x = historyGroup.value?.[key];
            let urls: string[] = x?.children?.filter(x => !isNil(x.url))?.map(x => x.url) as string[] ?? [];
            if (!urls?.length) {
              useMyStore.removeHistoryGroup(key)
              return <></>
            };
            const isEdit = ref(false);
            const text = ref(x?.name)
            return <>
              <Col span={12} style={{ marginBottom: '20px' }}>
                <div class={'group-name'}>
                  {
                    isEdit.value ? <Input
                      style={{ width: '300px' }}
                      size='medium'
                      v-model={text.value}
                      clearable={true}
                    /> :
                      x?.name
                  }
                  <div style={{ gap: '20px', display: 'flex' }}>
                    <Button
                      size='medium'
                      icon={h(AiOutlineLink, { size: 20 })}
                      resetTime={0}
                      onClick={() => {
                        urls?.length && createUrlToGroup(urls, x?.name ?? key);
                      }}
                    ></Button>
                    <PopConfirm
                      onConfirm={() => {
                        useMyStore.removeHistoryGroup(key)
                        TinyNotify({
                          type: 'success',
                          message: i18n.t('HistoryGroup.notify.delete_success'),
                          position: 'top-right'
                        })
                      }}
                    >
                      <Button
                        type="danger"
                        size='medium'
                        resetTime={0}
                        icon={h(AiOutlineDelete, { size: 20 })}
                      ></Button>
                    </PopConfirm>

                    <Button
                      type="info"
                      size='medium'
                      resetTime={0}
                      icon={h(isEdit.value ? AiOutlineSave : AiOutlineEdit, { size: 20 })}
                      onClick={() => {
                        if (isEdit.value) {
                          useMyStore.addHistoryGroup({
                            [`${key}`]: new UseHistoryGroup({
                              name: text.value || dayjs().format('YYYY-MM-DD HH:mm:ss'),
                              children: x?.children ?? [],
                              createdAt: x?.createdAt,
                              updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
                            })
                          })
                          TinyNotify({
                            type: 'success',
                            message: i18n.t('HistoryGroup.notify.update_success'),
                            position: 'top-right'
                          })
                        }

                        isEdit.value = !isEdit.value;
                      }}
                    ></Button>
                  </div>
                </div>
                <Table rowData={x?.children} k={key} />
              </Col >
            </>
          })
        }
      </Row >
    )
  }
}) 
