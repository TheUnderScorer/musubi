import { test } from '../test';
import { navigateToPopup } from '../utils/navigation';
import { expect } from '@playwright/test';

test.describe('Popup', () => {
  test('should render', async ({ page }) => {
    await navigateToPopup(page);

    await expect(
      page.waitForSelector('#popup', {
        timeout: 15_000,
      })
    ).resolves.not.toThrow();
  });
});
