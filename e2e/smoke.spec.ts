import { expect, test } from '@playwright/test';

test.describe('Matrix LED smoke', () => {
  test('loads default Vietnamese text', async ({ page }) => {
    await page.goto('/');
    const input = page.getByTestId('text-input');
    await expect(input).toHaveValue(/Chào mừng/);
    await expect(page.getByTestId('display-stage')).toBeVisible();
    await expect(page.getByTestId('effect-select')).toBeVisible();
  });

  test('does not request Google Fonts CDN', async ({ page }) => {
    const blocked: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (
        url.includes('fonts.googleapis.com') ||
        url.includes('fonts.gstatic.com')
      ) {
        blocked.push(url);
      }
    });
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(blocked).toEqual([]);
  });

  test('edits text', async ({ page }) => {
    await page.goto('/');
    const input = page.getByTestId('text-input');
    await input.fill('TEST QC');
    await expect(input).toHaveValue('TEST QC');
  });

  test('persists text after reload', async ({ page }) => {
    await page.goto('/');
    const input = page.getByTestId('text-input');
    await input.fill('PERSIST ME');
    await page.waitForTimeout(400);
    await page.reload();
    await expect(page.getByTestId('text-input')).toHaveValue('PERSIST ME');
  });

  test('mobile viewport shows controls', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByTestId('text-input')).toBeVisible();
    await expect(page.getByTestId('play-pause')).toBeVisible();
  });
});
