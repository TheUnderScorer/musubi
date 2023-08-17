import { BrowserWindow } from 'electron';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';

export function sendMessageToWindow<T>(window: BrowserWindow, message: T) {
  try {
    window.webContents.send(ELECTRON_MESSAGE_CHANNEL, message);
  } catch (error) {
    console.error(`Failed to send message to window ${window.id}`, {
      error,
      message,
    });
  }
}

export function sendMessageToAllWindows<T>(message: T) {
  BrowserWindow.getAllWindows().forEach((window) => {
    sendMessageToWindow(window, message);
  });
}
