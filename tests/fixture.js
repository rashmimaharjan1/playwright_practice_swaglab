const { test: baseTest, expect } = require('@playwright/test');

// Step 1: Create a custom fixture for logged-in state
const test = baseTest.extend({
  loggedInPage: async ({ page }, use) => {
    // Navigate to the login page
    await page.goto('/');

    // Perform login steps
    await page.fill('input[name="user-name"]','standard_user');
           await page.fill('input[name="password"]','secret_sauce');
    
           //click the login button
           await page.click('input[data-test="login-button"]');
           await expect(page).toHaveURL('/inventory.html')

    // Provide the logged-in page to the test
    await use(page);
  },
});

module.exports = test;
