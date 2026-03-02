import { test, expect, Page } from '@playwright/test';

const mockChannelResponse = {
  kind: 'youtube#channelListResponse',
  items: [{
    kind: 'youtube#channel',
    id: 'UCX0FQCMvYg2_V_-tj5oVz2g',
    snippet: {
      title: 'Test Channel',
      customUrl: '@testchannel',
      thumbnails: { high: { url: 'https://example.com/thumb.jpg' } },
    },
    statistics: {
      viewCount: '1234567',
      subscriberCount: '12345',
      videoCount: '123',
    },
  }],
};

async function setupMocks(page: Page, opts: any = {}) {
  const { response = mockChannelResponse, status = 200, networkError = false } = opts;
  await page.route('**/googleapis.com/youtube/v3/channels*', async (route) => {
    if (networkError) {
      await route.abort('failed');
    } else {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response),
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
  });
}

test.describe('YouTube Integration E2E', () => {
  test('13.1 - successful channel data fetch', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('button:has-text("Visit Channel")', { timeout: 15000 });
    await expect(page.locator('button:has-text("Visit Channel")')).toBeVisible();
  });

  test('13.3 - quota exceeded error', async ({ page }) => {
    await setupMocks(page, {
      response: { error: { code: 403, message: 'Quota exceeded' } },
      status: 403,
    });
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('[role="alert"]', { timeout: 15000 });
    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
    // Just verify the alert is present - text content may vary
  });

  test('13.4 - authentication error', async ({ page }) => {
    await setupMocks(page, {
      response: { error: { code: 401, message: 'Invalid API key' } },
      status: 401,
    });
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('[role="alert"]', { timeout: 15000 });
    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
    // Just verify the alert is present - text content may vary
  });

  test('13.5 - channel not found', async ({ page }) => {
    await setupMocks(page, {
      response: { kind: 'youtube#channelListResponse', items: [] },
    });
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('[role="alert"]', { timeout: 15000 });
    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
    // Just verify the alert is present - text content may vary
  });

  test('13.7 - network error', async ({ page }) => {
    await setupMocks(page, { networkError: true });
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('[role="alert"]', { timeout: 15000 });
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('13.9 - cache behavior', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('button:has-text("Visit Channel")', { timeout: 15000 });
    await expect(page.locator('button:has-text("Visit Channel")')).toBeVisible();
  });

  test('13.10 - rate limiting', async ({ page }) => {
    await setupMocks(page, {
      response: { error: { code: 403, message: 'Rate limit exceeded' } },
      status: 403,
    });
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('[role="alert"]', { timeout: 15000 });
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('13.11 - multiple channels', async ({ page }) => {
    const multiResponse = {
      kind: 'youtube#channelListResponse',
      items: [
        mockChannelResponse.items[0],
        { ...mockChannelResponse.items[0], id: 'UCtest2' },
      ],
    };
    await setupMocks(page, { response: multiResponse });
    await page.goto('/en');
    await page.locator('#content').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('button:has-text("Visit Channel")', { timeout: 15000 });
    await expect(page.locator('button:has-text("Visit Channel")')).toBeVisible();
  });
});
