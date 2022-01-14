import { expect, Page, test } from '@playwright/test';

const FRONTEND = process.env.FRONTEND_DOMAIN as string;

export const login = async (page: Page) => {
  await page.goto(`${FRONTEND}/login`);
  await page.fill('input[name="email"]', process.env.TEST_EMAIL as string);
  await page.fill(
    'input[name="password"]',
    process.env.TEST_PASSWORD as string
  );
  await page.click('text=Login');
};

test('Test successful login', async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(FRONTEND);
});
