import { BrowserWindow } from 'electron';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';

export function sendMessageToWindow<T>(window: BrowserWindow, message: T) {
  try {
    if (window.isDestroyed()) {
      console.warn(
        `Attempted to send message to destroyed window ${window.id}`,
        message
      );

      return;
    }

    if (!window.isVisible()) {
      console.warn(
        `Attempted to send message to invisible window ${window.id}`,
        message
      );

      return;
    }

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
