import {Page,Expect,Browser,BrowserContext} from '@playwright/test';
import { LoginPage } from './loginPage';
import { HomePage } from './homePage';
import { EventPage } from './eventPage';

export class BasePage {
    readonly page: Page;
    readonly browser: Browser;
    readonly context: BrowserContext;
    readonly loginPage: LoginPage;
    readonly homePage: HomePage;
    readonly eventPage: EventPage; 
    contextWithStorageState: BrowserContext; 

    constructor(page: Page,browser:Browser,context:BrowserContext,contextWithStorageState: BrowserContext) {
        this.page = page;
        this.browser = browser;
        this.context = context;
        this.contextWithStorageState = contextWithStorageState
        this.loginPage = new LoginPage(page,browser,context,contextWithStorageState);
        this.homePage = new HomePage(page);
        this.eventPage = new EventPage(page);
    }   

}
