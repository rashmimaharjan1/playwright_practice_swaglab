// @ts-check

const { test, expect } = require('@playwright/test') ;
//test and expect are functions from playwright. 
//Test function used for writing testcases and expect funcction used for assertions.

const { LoginPage } = require('../Pages/loginPage.js');

test.describe('Login', ()=>{   
    let loginPage;
    
    test.beforeEach(async ({ page })=>{
        // Initialize the loginPage object for each test
    loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should allow user to login with valid login credentials', async({page}) =>{
        //fill username and password fields and click login button
       await loginPage.login('standard_user','secret_sauce');
       await expect(page).toHaveURL('/inventory.html')
    })

    //another test case within a describe test group
    test('should not allow user to login with invalid username', async({page})=>{
        await loginPage.login('standard','secret')
        await expect(loginPage.errorMessage).toHaveText(/Epic sadface: Username and password do not match any user in this service/);

        //close the error message and verify its hidden
        await loginPage.closeErrorMessage();
        await expect(loginPage.errorMessage.filter({ hasText: 'Epic sadface: Username and password do not match any user in this service'})).toBeHidden();
    })
})