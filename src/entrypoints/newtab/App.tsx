import { newTabBgInitSerice, reload, useMyStore } from '@/entrypoints/popup/common/util';
import { Col, Row, Watermark } from '@opentiny/vue';
import { Subscription } from 'rxjs';
import { useBookmarks } from '../popup/common/data';
import { useLayoutSize } from './use';
import Item from './widgets/item';
import Search from './widgets/search';
import Shortcut from './widgets/shortcut';
import TreeBookmarks from './widgets/tree-bookmarks';
import { size } from 'es-toolkit/compat';

export default defineComponent({
  setup() {
    const { left, right } = useBookmarks();


    onMounted(async () => {
      document.oncontextmenu = await useMyStore.getEnableDefaultContextMenu() ? null : function () {
        return false;
      }
    })

    const show = ref(false)

    const { leftStyle, rightStyle, centerStyle, isMobile, centerBottomStyle } = useLayoutSize()

    let s1: Subscription
    onMounted(() => {
      s1 = newTabBgInitSerice.subscribe(x => {
        show.value = true
      })
    })
    onUnmounted(() => {
      s1.unsubscribe()
    })

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { action } = request
      if (action === 'reload') {
        reload()
        sendResponse('success')
      }
    })
    return () => {

      const getTemp = () => {
        return <div class={'wrap'} style={{ display: 'flex' }}>
          <div style={leftStyle.value} class={'left '}>
            {size(left.value) && < TreeBookmarks bookmarks_group={left.value} />}
          </div>
          <div style={centerStyle.value}>
            <Row class={'center-top'}>
              <Col xl={12}>
                <Shortcut style={{ marginBottom: '10px' }} />
                <Search />
              </Col>
            </Row>
            <Item class={'center-bottom '} style={centerBottomStyle.value} />
          </div>
          <div style={rightStyle.value} class={'right '}>
            {size(left.value) && <TreeBookmarks bookmarks_group={right.value} />}
          </div>
        </div>

      }

      const addWatermark = () => {
        let showWaterMark = false
        if (show.value) {
          if (isMobile.value) {
            return <></>

          } else if (showWaterMark) {
            return <Watermark
              {...{
                width: 120,
                height: 64,
                content: ['Local bookmark manager', 'pre-alpha'],
                font: {
                  color: '#ccc',
                  fontSize: 25
                },
                gap: [100, 100],
                offset: [20, 20],
                rotate: -25,
                zIndex: 9,
                customClass: 'test',
                interlaced: true
              }}
            >
              {getTemp()}
            </Watermark>
          } else {
            return getTemp()
          }
        }
        return <></>
      }


      return <>
        {addWatermark()}
      </>
    }
  }
})
