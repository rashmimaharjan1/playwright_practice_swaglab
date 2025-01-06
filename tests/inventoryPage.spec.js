// @ts-check
const test = require('../tests/fixture')
const { expect } = require('@playwright/test') ;
const { link } = require('fs');


test.describe('Inventory Filters', ()=>{
    test('Filter options are clickable', async({loggedInPage, inventoryPage})=>{
        
        //ensure user is logged in
        await expect(loggedInPage).toHaveURL('/inventory.html');

        //check default filter option is selected as A to Z
        await expect(inventoryPage.page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

        //test filter changes 
        const sortOptions = ['za', 'lohi', 'hilo'];

            //refactor, optimized code
        for (const option of sortOptions){
            await inventoryPage.page.locator('[data-test="product-sort-container"]').selectOption(option);
        await expect(inventoryPage.page.locator('[data-test="product-sort-container"]')).toHaveValue(option);
        }
    })

    test('Add to cart button should be clickable', async({loggedInPage,inventoryPage})=>{

         //ensure user is logged in
         await expect(loggedInPage).toHaveURL('/inventory.html');
        await inventoryPage.addItemToCart(0);

        //check if Remove text appeares afte Add to cart button is click on the first card
        await expect(inventoryPage.page.locator('[data-test="remove-sauce-labs-backpack"]')).toContainText('Remove');

        //check if shopping cart badge has value 1  
        await inventoryPage.verifyCartBadge(1); //badge number = 1

        await inventoryPage.addItemToCart(1);
        await inventoryPage.verifyCartBadge(2); //badge number =2

        //check if Add to cart option reappears when Remove button is clicked again
        await inventoryPage.removeFromCart(1);
        await inventoryPage.verifyCartBadge(1); //badge number decreases to = 1 again
    
    });

    test('Inventory page has 6 cards in a page',async({loggedInPage,inventoryPage})=>{
         //ensure user is logged in
         await expect(loggedInPage).toHaveURL('/inventory.html');
     const cardCount = await inventoryPage.getCardCount(); //count the inventory items in the inventory page.
     await expect(cardCount).toBe(6); //check card count to be 6
    })

    test('inventory card items should be clickable',async({loggedInPage,inventoryPage})=>{
         //ensure user is logged in
         await expect(loggedInPage).toHaveURL('/inventory.html');
        //clicks first card item and checks if it goes to its detail page
        await inventoryPage.page.locator('[data-test="item-4-title-link"]').click();
        await expect(inventoryPage.page).toHaveURL('/inventory-item.html?id=4');

        //check back to product link redirects user to inventory page
        await inventoryPage.page.locator('[data-test="back-to-products"]').click();
        await expect(inventoryPage.page).toHaveURL('/inventory.html');

        //check add to cart button is clickable in detail page
        await inventoryPage.page.locator('[data-test="item-4-title-link"]').click();
        await inventoryPage.page.locator('[data-test="add-to-cart"]').click();
        await inventoryPage.verifyCartBadge(1); //check badge increases to 1
        
        await inventoryPage.page.getByRole('button', {name: "Remove"}).click(); //new way to use locator and it clicks remove button
        await expect(inventoryPage.cartBadge).not.toBeVisible();
    })
})

