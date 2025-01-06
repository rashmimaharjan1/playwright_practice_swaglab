const { test: baseTest, expect } = require('@playwright/test');

const { LoginPage } = require('../Pages/loginPage.js');
const {InventoryPage} =require ('../Pages/inventory.page.js');

// Step 1: Create a custom fixture for logged-in state
const test = baseTest.extend({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    // Navigate to the login page
    await loginPage.goto();

    // Perform login steps
    await loginPage.login('standard_user','secret_sauce');
    await loginPage.assertLoginSuccess();

    // Provide the logged-in page to the test
    await use(page);
  },

  //another fixture 
  inventoryPage: async({page},use) => {
    const inventoryPage = new InventoryPage(page);
    //provide the inventory page to the test
    await use(inventoryPage);
  }
});

module.exports = test;
