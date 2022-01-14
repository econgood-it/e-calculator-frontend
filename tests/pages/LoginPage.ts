import { Page } from '@playwright/test';
import { FRONTEND } from '../constants';

export class LoginPage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(`${FRONTEND}/login`);
  }

  async login() {
    await this.page.fill(
      'input[name="email"]',
      process.env.TEST_EMAIL as string
    );
    await this.page.fill(
      'input[name="password"]',
      process.env.TEST_PASSWORD as string
    );
    await this.page.click('text=Login');
  }
}
