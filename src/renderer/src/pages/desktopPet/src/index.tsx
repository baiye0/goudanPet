import { defineComponent, onMounted } from 'vue'
import { ipcRenderer } from '@renderer/global'
import { wlLive2d } from '../lib/index.js'

export default defineComponent({
  setup() {
    onMounted(() => {
      const live2d = wlLive2d({ seletor: '#live2d-id' })
    })
    return () => <div id="live2d-id"></div>
  }
})
