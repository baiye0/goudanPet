<script setup lang="ts">
import { ipcRenderer } from '../../../global'
import { onMounted } from 'vue'
import { wlLive2d } from '../lib/index.js'
console.log(ipcRenderer)
function open2() {
  ipcRenderer.send('open2')
}
// 最小化
const minimize = () => {
  ipcRenderer.send('detach:service', { type: 'minimize' })
}
// 最大化
const maximize = () => {
  ipcRenderer.send('detach:service', { type: 'maximize' })
}
// 关闭窗口
const close = () => {
  ipcRenderer.send('detach:service', { type: 'close' })
}

onMounted(() => {
  const live2d = wlLive2d({
    selector: '#live2d-id'
  })
})
</script>

<template>
  <!--
  <div class="nav">
    <div class="info">
      <span>狗蛋功能面板</span>
    </div>
    <div class="handle-container">
      <div class="handle">
        <div class="devtool" title="开发者工具"></div>
        <div class="window-handle">
          <div class="minimize" @click="minimize"></div>
          <div class="maximize" @click="maximize"></div>
          <div class="close" @click="close"></div>
        </div>
      </div>
    </div>
  </div> -->
  <div id="live2d-id"></div>
</template>
<style>
.nav {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: drag;
}
.info {
  display: flex;
  align-items: center;
}

.handle {
  display: flex;
  -webkit-app-region: no-drag;
}

.handle > div {
  height: 36px;
  border-radius: 18px;
  cursor: pointer;
  margin-right: 6px;
}

.handle .devtool {
  background: center no-repeat url('./assets/tool.svg');
}

.handle-container {
  display: flex;
  align-items: center;
}

.window-handle {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
}

.window-handle > div {
  width: 48px;
  height: 56px;
  cursor: pointer;
}
.minimize {
  background: center / 20px no-repeat url('./assets/minimize.svg');
}

.maximize {
  background: center / 20px no-repeat url('./assets/maximize.svg');
}

.unmaximize {
  background: center / 20px no-repeat url('./assets/unmaximize.svg');
}

.close {
  background: center / 20px no-repeat url('./assets/close.svg');
}

.close:hover {
  background-color: #e53935;
  background-image: url('./assets/close-hover.svg');
}
</style>
