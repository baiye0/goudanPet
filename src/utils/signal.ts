//信号处理
import { ipcMain } from 'electron'
import { useMainWindow, usedesktopPetWindow } from '../utils/windowInfo'
import { detachService } from './action'

export function initSignal() {
  ipcMain.on('open2', () => {
    usedesktopPetWindow()
  })

  ipcMain.on('detach:service', (event, arg: { type: string }) => {
    const { mainWindow } = useMainWindow()
    detachService(arg.type, mainWindow)
  })

  ipcMain.on('ping', () => console.log('pong'))
}
