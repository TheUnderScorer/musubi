import { PlaywrightTestConfig } from '@playwright/test';
import { isCI } from 'nx/src/utils/is-ci';

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:4200/';

const ci = Boolean(isCI());

export const baseConfig: PlaywrightTestConfig = {
  retries: 3,
  maxFailures: 2,
  timeout: 120000,
  use: {
    baseURL,
  },
  reporter: ci ? [['list'], ['github']] : 'list',
};
