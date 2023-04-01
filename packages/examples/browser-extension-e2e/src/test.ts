import path from 'path';
import { test as pwTest } from '@playwright/test';
import { BrowserContext, chromium } from 'playwright';
import config from '../playwright.config';
import { wait } from '@nrwl/nx-cloud/lib/utilities/waiter';
import fs from 'fs-extra';

const contextsPath = path.resolve(__dirname, 'contexts');

export const extensionPath = path.join(
  __dirname,
  '../../../../dist/packages/examples/browser-extension'
);

export const test = pwTest.extend<{
  createCtx: () => Promise<BrowserContext>;
}>({
  createCtx: async ({ bypassCSP, trace }, use) => {
    const store = new Set<BrowserContext>();

    // It seems that this is not properly propagated from config
    const headless = config.use.headless;

    const createContext = async () => {
      const browserId = Date.now().toString();

      const currentTestName = pwTest.info().title;
      const contextId = currentTestName.concat(browserId);
      const fullContextPath = path.join(contextsPath, contextId, '.ctx');

      const args = [
        // We use the smallest size we support both because we want to ensure functionality works there
        // and also because it improves test runtime to render fewer pixels, especially in environments
        // that can't hardware-accelerate rendering (eg, docker)
        '--window-size=320x240',
        // Required to work around https://github.com/GoogleChrome/puppeteer/pull/774
        `--disable-extensions-except=${extensionPath}`,
        `--disable-web-security`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        // Causes crash dumps to be saved locally (in ${userDataDir}/Crashpad/reports)
        '--noerrdialogs',
        // Writes a verbose chrome log at ${userDataDir}/chrome_debug.log, useful for debugging page crashes
        '--enable-logging',
        '--v=1',
      ];

      if (headless) {
        args.push('--headless=new');
      }

      const ctx = await chromium.launchPersistentContext(fullContextPath, {
        args,
        headless: false,
        bypassCSP,
      });

      if (trace === 'on-first-retry' && pwTest.info().retry > 0) {
        try {
          await ctx.tracing.start();
        } catch {
          // Nothing here
        }
      }

      store.add(ctx);

      // Wait for extensions to load
      await wait(4500);

      return ctx;
    };

    await use(createContext);

    await Promise.all(Array.from(store).map((ctx) => ctx.close()));
  },
  trace: 'on-first-retry',
  headless: false,
  bypassCSP: true,
  context: [
    async ({ createCtx }, use) => {
      if (!fs.existsSync(extensionPath)) {
        throw new Error(`Extension path ${extensionPath} does not exist`);
      }

      const contextsPath = path.resolve(__dirname, 'contexts');

      if (!fs.existsSync(contextsPath)) {
        fs.mkdirSync(contextsPath);
      }

      const ctx = await createCtx();

      // Wait for extensions to load
      await use(ctx);
    },
    {
      scope: 'test',
    },
  ],
});
