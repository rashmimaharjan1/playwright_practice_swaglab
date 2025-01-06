// @ts-check
const test = require ('./fixture');
const { expect} = require('@playwright/test');

test.describe('checkout', ()=>{
    test.beforeEach(async({loggedInPage,inventoryPage})=>{
        //ensure user is logged in
        await expect(loggedInPage).toHaveURL('/inventory.html');
        
        await inventoryPage.addItemToCart(0);
        await inventoryPage.addItemToCart(1);

        //first page of checkout  
        await inventoryPage.page.locator('[data-test="shopping-cart-link"]').click();
        
        //check if user lands on cart page or not after clicking on checkout icon button.
        await expect(inventoryPage.page).toHaveURL('/cart.html');
    })
    test('user can checkout successfully', async({page}) =>{   
        await page.locator('[data-test="checkout"]').click();

        //check if user lands on checkout page 1 after clicking on checkout button
        await expect(page).toHaveURL('/checkout-step-one.html');
        await page.locator('[data-test="firstName"]').click();
        await page.locator('[data-test="firstName"]').fill('Rashmi');
        await page.locator('[data-test="firstName"]').press('Tab');
        await page.locator('[data-test="lastName"]').fill('Maharjan');
        await page.locator('[data-test="lastName"]').press('Tab');
        await page.locator('[data-test="postalCode"]').fill('23942');
        await page.locator('[data-test="continue"]').click();

        //check if user lands on checkout page 2 after clicking on continue button
        await expect(page).toHaveURL('/checkout-step-two.html');
        await expect(page.locator('[data-test="title"]')).toBeVisible();
        await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Overview');
        await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
        await expect(page.locator('[data-test="payment-info-label"]')).toBeVisible();
        await expect(page.locator('[data-test="shipping-info-label"]')).toBeVisible();
        await page.locator('[data-test="total-info-label"]').click();
        await expect(page.locator('[data-test="total-info-label"]')).toBeVisible();
        await expect(page.locator('[data-test="finish"]')).toBeVisible();
        await expect(page.locator('[data-test="finish"]')).toContainText('Finish');
        await page.locator('[data-test="finish"]').click();

        //check if user lands on checkout complete page with the messages and back home button.
        await expect(page).toHaveURL('/checkout-complete.html');
        await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
        await expect(page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
        await expect(page.locator('[data-test="back-to-products"]')).toContainText('Back Home');
        await page.locator('[data-test="back-to-products"]').click();
        await expect(page).toHaveURL('/inventory.html');
    })

    test('user cannot checkout if the information fields are empty in checkout step one page', async({page})=>{
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL('/checkout-step-one.html');
        await page.locator('[data-test="continue"]').click();

        //check error message should be visible when user attempts to move next page with empty input values.
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
        //check when clicked on continue button with empty input values in the fields, it should not go to check out second page.
        await expect(page).not.toHaveURL('/checkout-step-two.html')
    })

    test('user cannot checkout if the last name is empty', async({page})=>{
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL('/checkout-step-one.html');
        await page.locator('[data-test="continue"]').click();

        //check error message should be visible when user attempts to move next page with empty input values.
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await page.locator('[data-test="firstName"]').fill('Rashmi');
        await page.locator('[data-test="postalCode"]').click();
        await page.locator('[data-test="postalCode"]').fill('444444');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');

        //check when clicked on continue button with empty input values in the fields, it should not go to check out second page.
        await expect(page).not.toHaveURL('/checkout-step-two.html')
        await page.locator('[data-test="error-button"]').click(); //click X icon button of the error message
        await expect(page.getByText('Error: Last Name is required')).not.toBeVisible();

    })

    test('user cannot checkout if the postal code is empty', async({page})=>{
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL('/checkout-step-one.html');
        await page.locator('[data-test="continue"]').click();

        //check error message should be visible when user attempts to move next page with empty input values.
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await page.locator('[data-test="firstName"]').fill('Rashmi');
        await page.locator('[data-test="lastName"]').fill('Maharjan');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');

        //check when clicked on continue button with empty input values in the fields, it should not go to check out second page.
        await expect(page).not.toHaveURL('/checkout-step-two.html')
        await page.locator('[data-test="error-button"]').click(); //click X icon button of the error message
        await expect(page.getByText('Error: Postal Code is required')).not.toBeVisible();

    })

    //new context and before each hook for cancel checkout scenario | nested describe
    test.describe('user should land on cart page if user cancels the checkout process',()=>{
        test.beforeEach(async({page})=>{
            //first page of checkout  
            await page.locator('[data-test="shopping-cart-link"]').click();
            await page.locator('[data-test="checkout"]').click();
            await page.locator('[data-test="firstName"]').click();
            await page.locator('[data-test="firstName"]').fill('Rashmi');
            await page.locator('[data-test="firstName"]').press('Tab');
            await page.locator('[data-test="lastName"]').fill('Maharjan');
            await page.locator('[data-test="lastName"]').press('Tab');
            await page.locator('[data-test="postalCode"]').fill('23942');
        })
        test('user cancels checkout process from checkout step one', async({page})=>{
        
        await page.locator('[data-test="cancel"]').click();
        await expect(page).toHaveURL('/cart.html');
        })

        test('user cancels checkout process from checkout step two', async({page})=>{
            await page.locator('[data-test="continue"]').click();
            await page.locator('[data-test="cancel"]').click();
            await expect(page).toHaveURL('/inventory.html');
        })
        
    })

    test('user should land on inventory page if user clicks on continue shopping button',async({page})=>{
        await page.locator('[data-test="continue-shopping"]').click();
        await expect(page).toHaveURL('/inventory.html')

    } )
})
