import { expect, test } from '@playwright/test';
import { FRONTEND } from './constants';
import { LoginPage } from './pages/LoginPage';

test('Test successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login();
  await expect(page).toHaveURL(FRONTEND);
});
