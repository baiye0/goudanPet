import { BrowserWindow, screen } from 'electron'
import { usePageBWindow } from './windowInfo'

export function detachService(type: string, win: BrowserWindow): void {
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
  operation[type]()
}

export function open2() {
  usePageBWindow()
}
