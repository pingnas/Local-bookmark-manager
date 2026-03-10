import { useMyStore } from '@/entrypoints/common/util';
import { Col, Row, Watermark } from '@opentiny/vue';
import { size } from 'es-toolkit/compat';
import { useBookmarks } from '../common/data';
import { useBingImage } from '../common/util/bing-img';
import { useLayoutSize } from './use';
import Item from './widgets/item';
import Search from './widgets/search';
import Shortcut from './widgets/shortcut';
import TreeBookmarks from './widgets/tree-bookmarks';

export default defineComponent({
  setup() {
    const { left, right } = useBookmarks();


    onMounted(async () => {
      document.oncontextmenu = await useMyStore.getEnableDefaultContextMenu() ? null : function () {
        return false;
      }
    })


    const { leftStyle, rightStyle, centerStyle, isMobile, centerBottomStyle } = useLayoutSize()


    const { data: imageurl } = useBingImage();
    const fallbackBgUrl = chrome.runtime.getURL('/th.jpg');
    const currentBgUrl = ref<string>(fallbackBgUrl);

    const preloadBg = (url: string) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        currentBgUrl.value = url;
      };
      img.onerror = () => {
        if (url !== fallbackBgUrl) {
          preloadBg(fallbackBgUrl);
        }
      };
    };

    onMounted(() => {
      preloadBg(fallbackBgUrl);
    });

    watch(
      () => imageurl.value,
      (url) => {
        if (url) {
          preloadBg(url);
        }
      }
    );

    return () => {

      const getTemp = () => {
        return <div class={'wrap'} style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            class='wrap-bg'
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${currentBgUrl.value})`
            }}
          ></div>
          <Row class={'center-top'}>
            <Col xl={12}>
              <Shortcut style={{ marginBottom: '10px' }} />
              <Search />
            </Col>
          </Row>
          {size(left.value) > 1 && <div style={{ display: 'flex' }}>
            <div style={leftStyle.value} class={'left '}>
              <TreeBookmarks bookmarks_group={left.value} />
            </div>
            <div style={centerStyle.value}>
              <Item class={'center-bottom '} style={centerBottomStyle.value} />
            </div>
          </div>}
        </div>

      }

      const addWatermark = () => {
        let showWaterMark = false
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


      return <>
        {
          size(left.value) > 1 && addWatermark()}
      </>
    }
  }
})
