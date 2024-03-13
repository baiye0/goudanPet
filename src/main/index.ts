import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

//入口
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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
  //调试窗口
  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    //表明页面内容加载好了。
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  ipcMain.on('detach:service', async (event, arg: { type: string }) => {
    operation[arg.type]()
  })

  ipcMain.on(
    'msg-trigger',
    async (
      event,
      arg: { type: string; data: { mouseX: number; mouseY: number; width: number; height: number } }
    ) => {
      operation[arg.type](arg.data)
    }
  )

  ipcMain.on('open2', () => {
    const mainWindow = new BrowserWindow({
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
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/src/pages/pageB/index.html`)
      // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/src/pages/pageB/index.html'))
    }
    mainWindow.on('ready-to-show', () => {
      //表明页面内容加载好了。
      mainWindow.show()
    })
  })

  const win = mainWindow
  const operation = {
    minimize: () => {
      win.focus()
      win.minimize()
    },
    maximize: () => {
      win.isMaximized() ? win.unmaximize() : win.maximize()
    },
    close: () => {
      win.close()
    },
    windowMoving: ({ mouseX, mouseY, width, height }) => {
      const { x, y } = screen.getCursorScreenPoint()
      console.log(x, y)
      win.setBounds({ x: x - mouseX, y: y - mouseY, width, height })
      win.setPosition(x - mouseX, y - mouseY)
    }
  }

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  console.log(process.env['ELECTRON_RENDERER_URL'])
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    //多页面配置
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/src/pages/mainPage/index.html`)
    // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/src/pages/mainPage/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  //如果不是mac就退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
