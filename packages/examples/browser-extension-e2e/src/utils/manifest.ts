import * as fs from 'fs-extra';
import path from 'path';
import type { Manifest } from 'webextension-polyfill';
import { extensionPath } from '../test';

let manifest: BrowserExtensionManifest;

interface BrowserExtensionManifest extends Manifest.WebExtensionManifest {
  browser_action: {
    default_popup: string;
  };
}

export const readManifest = async () => {
  if (manifest) {
    return manifest;
  }

  const manifestPath = path.join(extensionPath, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found, perhaps extension is not built?');
  }

  manifest = JSON.parse(
    fs.readFileSync(manifestPath).toString()
  ) as BrowserExtensionManifest;

  return manifest;
};
