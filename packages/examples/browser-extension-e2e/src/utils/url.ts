import { BrowserContext } from 'playwright';
import { URL } from 'url';
import { readManifest } from './manifest';

export function getBackgroundWorker(browser: BrowserContext) {
  const [worker] = browser.serviceWorkers();

  return worker;
}

export function getExtensionUrl(browser: BrowserContext, path = '') {
  const worker = getBackgroundWorker(browser);

  return new URL(worker.url().replace('/background.js', '').concat(path));
}

export async function getPopupUrl(browser: BrowserContext, pathname = '/') {
  const manifest = await readManifest();

  const url = getExtensionUrl(
    browser,
    `/${manifest.action?.default_popup}#${pathname}`
  );

  return url.toString();
}
