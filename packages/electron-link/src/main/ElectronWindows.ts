import { BrowserWindow } from 'electron';

export class ElectronWindows {
  private readonly windowsSet = new Set<BrowserWindow>();

  constructor(windows: BrowserWindow[]) {
    windows.forEach((window) => {
      this.registerWindow(window);
    });
  }

  get windows() {
    return [...this.windowsSet];
  }

  add(window: BrowserWindow) {
    this.registerWindow(window);
  }

  private registerWindow(window: BrowserWindow) {
    this.windowsSet.add(window);

    window.webContents.once('destroyed', () => {
      this.windowsSet.delete(window);
    });
  }
}
