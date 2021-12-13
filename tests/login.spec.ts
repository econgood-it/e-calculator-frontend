import { test } from '@playwright/test';

const FRONTEND = process.env.FRONTEND_DOMAIN as string;

test('Test successful login', async ({ page }) => {
  await page.goto(`${FRONTEND}/login`);
  await page.fill('input[name="email"]', process.env.TEST_EMAIL as string);
  await page.fill(
    'input[name="password"]',
    process.env.TEST_PASSWORD as string
  );
  await page.click('text=Login');
  await page.screenshot({ path: 'screenshots/login.png' });
  // await expect(title).toHaveText('Playwright');
});
