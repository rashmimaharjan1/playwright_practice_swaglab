const {expect} =require('@playwright/test');

exports.InventoryPage = class InventoryPage{
    /**
   * @param {import('@playwright/test').Page} page
   */

    constructor(page){
        this.page = page;

        //define locators for elements on the page
        this.productCards = page.locator('[data-test="inventory-item"]');
        this.addtoCartButtons = page.getByText('Add to cart');
        this.removeButtons = page.getByText('Remove');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    //actions

    async addItemToCart(index){
        await this.addtoCartButtons.nth(index).click();
    }
    async removeFromCart(index){
        await this.removeButtons.nth(index).click();
    }


    async verifyCartBadge(count){
        await expect(this.cartBadge).toContainText(String(count));
    }
    

    async getCardCount(){
        return this.productCards.count();
    }
}