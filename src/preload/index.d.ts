import { ElectronAPI } from '@electron-toolkit/preload'
export {}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
