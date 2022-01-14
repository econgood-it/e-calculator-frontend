import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

test('Open and close balance sheet tab', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login();
  const homePage = new HomePage(page);
  await expect(await homePage.getBalanceSheetTabs()).toHaveCount(0);
  await homePage.clickOnHomeButton();
  // Open balance sheet
  await homePage.openFirstBalanceSheet();
  await expect(await homePage.getBalanceSheetTabs()).toHaveCount(1);
  // Close balance sheet
  await page.click('button[aria-label="close balance sheet tab"]');
  await expect(await homePage.getBalanceSheetTabs()).toHaveCount(0);
  await expect(page.locator('button:has-text("Open")')).not.toHaveCount(0);
});
