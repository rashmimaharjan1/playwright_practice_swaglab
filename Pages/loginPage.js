const {expect} =require('@playwright/test');

//class declaration
//LoginPage will be exported,making it available for use in other parts of the application
exports.LoginPage = class LoginPage{
/**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page){
        this.page = page;

        //define locators for elements on the page
        this.usernameField = page.locator('input[name="user-name"]');
        this.passwordField = page.locator('input[name="password"]');
        this.loginButton = page.locator('input[data-test="login-button"]');
        this.errorMessage = page.locator('div.error-message-container');
        this.errorCloseButton = page.locator('[data-test="error-button"]')
    }

    //actions
    async goto(){
        await this.page.goto('/');
    }

    async login(username, password){
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    async closeErrorMessage(){
        await this.errorCloseButton.click();
    }

    async getErrorMessage(){
        await this.errorMessage.textContent();
    }

    async assertLoginSuccess(){
        await expect(this.page).toHaveURL('/inventory.html');
    }
}