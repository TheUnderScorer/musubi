import * as browser from 'webextension-polyfill';

export async function getCurrentTab() {
  return browser.tabs?.query
    ? await browser.tabs
        .query({
          active: true,
          currentWindow: true,
        })
        .then((tabs) => tabs[0])
    : undefined;
}
