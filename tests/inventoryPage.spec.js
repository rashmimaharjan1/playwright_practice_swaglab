// @ts-check

const { test, expect } = require('@playwright/test') ;

test.beforeEach(async ({ page })=>{
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="username"]').press('Tab');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="title"]')).toBeVisible();
    });
test.describe('Inventory Filters', ()=>{
    test('filter options are clickable', async({page})=>{
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
        await page.locator('[data-test="product-sort-container"]').selectOption('za');
        await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
        await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    });
    test('Add to cart button should be clickable', async({page})=>{
          
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toContainText('Remove');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
    });
})

