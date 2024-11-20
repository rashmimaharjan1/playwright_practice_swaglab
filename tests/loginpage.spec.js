// @ts-check

const { test, expect } = require('@playwright/test') ;
//test and expect are functions from playwright. 
//Test function used for writing testcases and expect funcction used for assertions.

test.beforeEach(async ({ page })=>{
await page.goto('/');
});

test.describe('Login', ()=>{   
    // Group related login tests together
    test('should allow user to login with valid login credentials', async({page}) =>{
        //fill username and password fields
       await page.fill('input[name="user-name"]','standard_user');
       await page.fill('input[name="password"]','secret_sauce');

       //click the login button
       await page.click('input[data-test="login-button"]');
       await expect(page).toHaveURL('/inventory.html')
    })

    //another test case within a describe test group
    test('should not allow user to login with invalid username', async({page})=>{
        await page.fill('input[name="user-name"]','standard');
       await page.fill('input[name="password"]','secret');

       //click the login button
       await page.click('input[data-test="login-button"]');

       expect(page.locator('div').filter({ hasText: 'Epic sadface: Username and password do not match any user in this service'}));
    //locator is a playwright method used to locate elements for interaction or assertion.
    //filter method filters the list of <div> elements that contains above exact text.


    await expect(page.locator('div.error-message-container')).toHaveText(/Epic sadface: Username and password do not match any user in this service/);
    //simply you can use classes for locator and toHaveText assertion

    await page.locator('[data-test="error-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeHidden();
    })
})