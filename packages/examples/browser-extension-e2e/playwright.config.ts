import type { PlaywrightTestConfig } from '@playwright/test';

import { baseConfig } from '../../../playwright.config.base';

const config = {
  ...baseConfig,
  testDir: './src/integration',
  use: {
    headless: true,
  },
  timeout: 90_000,
} satisfies PlaywrightTestConfig;

export default config;
