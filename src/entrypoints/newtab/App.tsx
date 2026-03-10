import { useMyStore } from '@/entrypoints/common/util';
import { Col, Row, Watermark } from '@opentiny/vue';
import { size } from 'es-toolkit/compat';
import { useBookmarks } from '../common/data';
import { fetchBingImageUrl } from '../common/util/bing-img';
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


    const fallbackBgUrl = chrome.runtime.getURL('/th.jpg');
    const currentBgUrl = ref<string>(fallbackBgUrl);
    const windmillSpinning = ref(false);
    const switchingBg = ref(false);

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

    const loadStoredBackground = async () => {
      await useMyStore.getBingImageIndex();
      const storedUrl = await useMyStore.getBackgroundImageUrl();
      if (storedUrl) {
        preloadBg(storedUrl);
      }
    };

    onMounted(() => {
      loadStoredBackground();
    });

    const spinWindmill = () => {
      windmillSpinning.value = true;
      window.setTimeout(() => {
        windmillSpinning.value = false;
      }, 600);
    };

    const switchBackground = async () => {
      if (switchingBg.value) return;
      switchingBg.value = true;
      spinWindmill();
      try {
        const nextIndex = (await useMyStore.getBingImageIndex()) + 1;
        const normalizedIndex = nextIndex % 8;
        await useMyStore.setBingImageIndex(normalizedIndex);
        const nextUrl = await fetchBingImageUrl(normalizedIndex);
        await useMyStore.setBackgroundImageUrl(nextUrl);
        preloadBg(nextUrl);
      } catch (error) {
        // keep current background if fetch fails
      } finally {
        window.setTimeout(() => {
          switchingBg.value = false;
        }, 200);
      }
    };

    return () => {

      const getTemp = () => {
        return <div class={'wrap'} style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            class='wrap-bg'
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${currentBgUrl.value})`
            }}
          ></div>
          <button
            class={['windmill-btn', windmillSpinning.value ? 'is-spinning' : '', switchingBg.value ? 'is-busy' : '']}
            title='切换背景'
            aria-label='切换背景'
            disabled={switchingBg.value}
            onClick={switchBackground}
          >
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M32 6 L40 26 L32 32 L24 26 Z" />
              <path d="M58 32 L38 40 L32 32 L38 24 Z" />
              <path d="M32 58 L24 38 L32 32 L40 38 Z" />
              <path d="M6 32 L26 24 L32 32 L26 40 Z" />
              <circle cx="32" cy="32" r="4" />
            </svg>
          </button>
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
