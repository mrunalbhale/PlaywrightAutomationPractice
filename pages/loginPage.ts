import {expect, Page, Locator, Browser, BrowserContext} from '@playwright/test';
import { email, password, URL_EventHub, URL_EventHub_APILogin } from '../constants';
//import { BasePage } from './basePage';

export class LoginPage {
    browser: Browser;
    page: Page;
    context: BrowserContext;
    readonly  emailInput : Locator;
    readonly passwordInput : Locator;
    readonly loginButton : Locator;
    contextWithStorageState: BrowserContext;

    constructor(page: Page, browser: Browser, context: BrowserContext, contextWithStorageState: BrowserContext ) {
        this.browser = browser;
        this.context = context;
        this.contextWithStorageState = contextWithStorageState;
        this.page = page;
        this.emailInput = this.page.locator('#email');
        this.passwordInput = this.page.locator('#password');
        this.loginButton = this.page.locator('#login-btn');
    }

    async launchURLForAPILogin() {
        await this.page.goto(URL_EventHub_APILogin);
    }

    async navigateToLoginPage() {
        await this.page.goto(URL_EventHub);
    }

    async login() {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.context.storageState({path:'storageState.json'});
    }

    async loginWithStorageState(){
        await this.page.goto(URL_EventHub);
        await this.login();
        this.contextWithStorageState = await this.browser.newContext({storageState:'storageState.json'});
    }

}