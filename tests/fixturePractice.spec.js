//@ts-check
 
const test = require('./fixture');
const { expect } = require('@playwright/test');

 test('Add to cart button should be clickable', async({loggedInPage})=>{
        await loggedInPage.getByText('Add to cart').nth(0).click();

        //check if Remove text appeares afte Add to cart button is click on the first card
        await expect(loggedInPage.locator('[data-test="remove-sauce-labs-backpack"]')).toContainText('Remove');

        //check if shopping cart badge has value 1  
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toContainText('1'); //badge number = 1

        await loggedInPage.getByText('Add to cart').nth(1).click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toContainText('2'); //badge number =2

        //check if Add to cart option reappears when Remove button is clicked again
        await loggedInPage.getByText('Remove').nth(1).click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toContainText('1'); //badge number decreases to = 1 again
    
    });
