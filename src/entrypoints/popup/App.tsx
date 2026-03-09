import { Button, Col, FileUpload, Row, TinyNotify } from '@opentiny/vue';
import { defineComponent } from 'vue';
import { useHistoryGroup } from './use';
import { getBackupFolderName, miaoStorage, openUrlInNewTab, readFromJson, saveAsJson } from './common/util';

export default defineComponent({
  setup() {
    const { openHistoryGroup, addHistoryGroup } = useHistoryGroup()


    return () => (
      <Row class={'wrap'}>
        <Col span={12}>
          <h3>{i18n.t('HistoryGroup.title')}</h3>
        </Col>
        <Col span={6}>
          <Button
            style={{ width: '100%' }}
            size='medium'
            onClick={addHistoryGroup}
          >
            {i18n.t('Popup.add')}
          </Button>
        </Col>
        <Col span={6}>
          <Button
            type="primary"
            onClick={openHistoryGroup}
            style={{ width: '100%' }}
            size='medium'
          >
            {i18n.t('Popup.open')}
          </Button>
        </Col>
        <Col span={12}>
          <h3>{i18n.t('NewTab.text.update_bg')}</h3>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            size='medium'
            reset-time={0}
            style={{ width: '100%' }}
            onClick={() => {
              const url = chrome.runtime.getURL('bg.html');
              openUrlInNewTab(url)
            }}
          >
            {i18n.t('Popup.open')}
          </Button>
        </Col>
        <Col span={12}>
          <h3>{i18n.t('Popup.text.configuration')}</h3>
        </Col>
        <Col span={12} class={'flex gap-20'}>
          <Button
            type="danger"
            size='medium'
            reset-time={0}
            style={{ width: '100%' }}
            onClick={() => {
              miaoStorage.clear()
              browser.runtime.sendMessage({ action: 'reload' }, (response) => {
                TinyNotify({
                  type: 'success',
                  message: i18n.t('HistoryGroup.notify.clear_success'),
                  position: 'top-right'
                })
              })
            }}
          >
            {i18n.t('Popup.text.clear_configuration')}
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
                  let obj = await readFromJson(file) as { [k: string]: any };
                  Object.entries(obj).forEach(([key, value]) => {
                    miaoStorage.set(key, value);
                  })
                  browser.runtime.sendMessage({ action: 'reload' }, (response) => {
                    TinyNotify({
                      type: 'success',
                      message: i18n.t('HistoryGroup.notify.import_success'),
                      position: 'top-right'
                    })
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
                size='medium'
                reset-time={0}
                style={{ width: '100%' }}
              >
                {i18n.t('Popup.text.import_config')}
              </Button>
            }}
          />

          <Button
            type="primary"
            style={{ width: '100%' }}
            size='medium'
            resetTime={0}
            onClick={async () => {
              let data = await miaoStorage.exportData()
              saveAsJson(data, `local bookmark manager allsettings ${getBackupFolderName()}`);
              TinyNotify({
                type: 'success',
                message: i18n.t('HistoryGroup.notify.export_success'),
                position: 'top-right'
              })
            }}>
            {i18n.t('Popup.text.export_config')}
          </Button>
        </Col>
      </Row>
    )
  }
}) 
