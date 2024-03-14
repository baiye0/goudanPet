//窗体信息
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindowConstructorOptions, shell, BrowserWindow } from 'electron'
//主窗体信息
export const mainWindowInfo: BrowserWindowConstructorOptions = {
  width: 900,
  height: 670,
  show: false,
  frame: true,
  // 无标题
  titleBarStyle: 'hidden',
  autoHideMenuBar: true,
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    contextIsolation: false
  }
}

let mainWindow: BrowserWindow
export const useMainWindow = () => {
  if (!mainWindow) {
    mainWindow = new BrowserWindow(mainWindowInfo)
    mainWindow.webContents.openDevTools()
    mainWindow.on('ready-to-show', () => {
      //表明页面内容加载好了。
      mainWindow.show()
    })
    //?
    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      //多页面配置
      mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/src/pages/mainPage/index.html`)
      // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/src/pages/mainPage/index.html'))
    }
  }
  return { mainWindow }
}

let pageBWindow: BrowserWindow
let isShow = false
export const usePageBWindow = () => {
  if (!pageBWindow || !isShow) {
    pageBWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      frame: true,
      // 无标题
      titleBarStyle: 'hidden',
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: false
      }
    })
    pageBWindow.on('ready-to-show', () => {
      //表明页面内容加载好了。
      pageBWindow.show()
      isShow = true
    })
    //?
    pageBWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      pageBWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/src/pages/pageB/index.html`)
      // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      pageBWindow.loadFile(join(__dirname, '../renderer/src/pages/pageB/index.html'))
    }
    pageBWindow.on('ready-to-show', () => {
      //表明页面内容加载好了。
      isShow = true
      pageBWindow.show()
    })
    pageBWindow.on('close', () => {
      isShow = false
    })
  }
  return { pageBWindow, isShow }
}
