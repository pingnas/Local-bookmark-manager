import { BgConfig, BgType, setBgTempelteService, updateModelService, useMyStore, } from '@/entrypoints/popup/common/util';
import { Button, Col, Row, TabItem, Tabs, TinyNotify } from '@opentiny/vue';
import { debounceTime, Subscription } from 'rxjs';
import { defineComponent } from 'vue';
import BgTemplete from './widget/bg-templete';
import Internet from './widget/internet';
import Location from './widget/location';

export default defineComponent({
  setup() {
    const tab = ref()
    let model = reactive<{ [k: string]: BgConfig }>({})

    provide('model', computed({
      get: () => {
        return model[tab.value]
      },
      set: (value: BgConfig) => {
        model[tab.value] = value
      }
    }))

    watch(
      () => tab.value,
      (cur, acc) => {
        setBgTempelteService.next({ x: cur })
      },
      {
        immediate: true,
        deep: true
      }
    )
    let s1: Subscription;
    const init = async () => {
      tab.value = await useMyStore.getBgTab()
      Object.assign(model, await useMyStore.getBgModel())

    }
    onMounted(async () => {
      await init();
      s1 = updateModelService.pipe(debounceTime(0)).subscribe(x => {
        useMyStore.setBgModel(model)
      })
    })
    onUnmounted(() => {
      s1.unsubscribe()
    })

    return () => (
      <Row class={'wrap'}>
        <Col span={12} class={'header'}>
          {i18n.t('bg.title')}
        </Col>
        <Col span={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="info"
            size='medium'
            reset-time={0}
            onClick={async () => {
              await useMyStore.setBgTab(tab.value);
              browser.runtime.sendMessage({ action: 'reload' }, (response) => {
                TinyNotify({
                  type: 'success',
                  message: i18n.t('bg.notify.save_success'),
                  position: 'top-right'
                })
              })
            }}
          >
            {i18n.t('bg.btn.save')}
          </Button>
          <Button
            type="danger"
            size='medium'
            reset-time={0}
            onClick={async () => {
              await useMyStore.clearBg();
              browser.runtime.sendMessage({ action: 'reload' }, (response) => {
                TinyNotify({
                  type: 'success',
                  message: i18n.t('bg.notify.clear_success'),
                  position: 'top-right'
                })
              })
              await init();
            }}
          >
            {i18n.t('bg.btn.clear')}
          </Button>
        </Col>
        <Col span={12}>
          <Tabs
            size='large'
            v-model={tab.value}
          >
            <TabItem title={i18n.t('bg.tab.default')} name={BgType.Default} lazy={true}>
            </TabItem>
            <TabItem title={i18n.t('bg.tab.location')} name={BgType.Location} lazy={true}>
              <Location />
            </TabItem>
            <TabItem title={i18n.t('bg.tab.internet')} name={BgType.Internet} lazy={true}>
              <Internet />
            </TabItem>
          </Tabs>
        </Col>
        <BgTemplete />
      </Row>
    )
  }
}) 
