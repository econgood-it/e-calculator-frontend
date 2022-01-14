import { Locator, Page } from '@playwright/test';
import { FRONTEND } from '../constants';

export class HomePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(`${FRONTEND}`);
  }

  async clickOnHomeButton() {
    await this.page.click('button[aria-label="home"]');
  }

  async openFirstBalanceSheet() {
    await this.page.locator('button:has-text("Open")').first().click();
  }

  async getBalanceSheetTabs(): Promise<Locator> {
    const balanceSheetTabSelector = 'div[aria-label="balance sheet tab"]';
    return this.page.locator(balanceSheetTabSelector);
  }
}
