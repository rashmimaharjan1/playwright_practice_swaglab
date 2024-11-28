// @ts-check

const { test, expect } = require('@playwright/test') ;
const { link } = require('fs');

test.beforeEach(async ({ page })=>{
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="username"]').press('Tab');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('/inventory.html');
    });
test.describe('Inventory Filters', ()=>{
    test('filter options are clickable', async({page})=>{
        //check default filter option is selected as A to Z
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

        //check filter option changes to Z to A
        await page.locator('[data-test="product-sort-container"]').selectOption('za');
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');

        //check filter option changes to low to high
        await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');

        //check filter option changes to high to low
        await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('hilo');
    });

    test('Add to cart button should be clickable', async({page})=>{
        await page.getByText('Add to cart').nth(0).click();

        //check if Remove text appeares afte Add to cart button is click on the first card
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toContainText('Remove');

        //check if shopping cart badge has value 1
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1'); //badge number = 1

        await page.getByText('Add to cart').nth(1).click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('2'); //badge number =2

        //check if Add to cart option reappears when Remove button is clicked again
        await page.getByText('Remove').nth(1).click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1'); //badge number decreases to = 1 again
    
    });

    test('Inventory page has 6 cards in a page',async({page})=>{
     const cardCount = await page.locator('[data-test="inventory-item"]').count(); //count the inventory items in the inventory page.
     await expect(cardCount).toBe(6); //check card count to be 6
    })

    test.only('inventory card items should be clickable',async({page})=>{
        //clicks first card item and checks if it goes to its detail page
        await page.locator('[data-test="item-4-title-link"]').click();
        await expect(page).toHaveURL('/inventory-item.html?id=4');

        //check back to product link redirects user to inventory page
        await page.locator('[data-test="back-to-products"]').click();
        await expect(page).toHaveURL('/inventory.html');

        //check add to cart button is clickable in detail page
        await page.locator('[data-test="item-4-title-link"]').click();
        await page.locator('[data-test="add-to-cart"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1'); //check badge increases to 1
        
        await page.getByRole('button', {name: "remove"}).click(); //new way to use locator and it clicks remove button
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
        
    })
})

