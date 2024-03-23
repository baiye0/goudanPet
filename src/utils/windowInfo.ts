//窗体信息
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindowConstructorOptions, shell, BrowserWindow } from 'electron'
//主窗体信息
export const mainWindowInfo: BrowserWindowConstructorOptions = {
  width: 500,
  height: 670,
  frame: false,
  transparent: true,
  // 无标题
  // titleBarStyle: 'hidden',
  titleBarStyle: 'customButtonsOnHover',
  autoHideMenuBar: true,
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    contextIsolation: false,
    experimentalFeatures: true
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

let desktopPetWindow: BrowserWindow
let isShow = false
export const usedesktopPetWindow = () => {
  if (!desktopPetWindow || !isShow) {
    desktopPetWindow = new BrowserWindow({
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
    desktopPetWindow.on('ready-to-show', () => {
      //表明页面内容加载好了。
      desktopPetWindow.show()
      isShow = true
    })
    //?
    desktopPetWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      desktopPetWindow.loadURL(
        `${process.env['ELECTRON_RENDERER_URL']}/src/pages/desktopPet/index.html`
      )
      // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      desktopPetWindow.loadFile(join(__dirname, '../renderer/src/pages/desktopPet/index.html'))
    }
    desktopPetWindow.on('ready-to-show', () => {
      //表明页面内容加载好了。
      isShow = true
      desktopPetWindow.show()
    })
    desktopPetWindow.on('close', () => {
      isShow = false
    })
  }
  return { desktopPetWindow, isShow }
}
