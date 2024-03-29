import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { usedesktopPetWindow, useMainWindow } from '../utils/windowInfo'
import { initSignal } from '../utils/signal'

initSignal()

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))
  useMainWindow()
  usedesktopPetWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) useMainWindow()
  })
})

app.on('window-all-closed', () => {
  //如果不是mac就退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
