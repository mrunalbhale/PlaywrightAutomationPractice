import {expect, Page, Locator} from '@playwright/test';
import { email, password, URL_EventHub } from '../constants';
//import { BasePage } from './basePage';

export class LoginPage {
    page: Page;
    readonly  emailInput : Locator;
    readonly passwordInput : Locator;
    readonly loginButton : Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = this.page.locator('#email');
        this.passwordInput = this.page.locator('#password');
        this.loginButton = this.page.locator('#login-btn');
    }

    async navigateToLoginPage() {
        await this.page.goto(URL_EventHub);
    }

    async login() {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }



}