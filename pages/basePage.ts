import {Page,Expect} from '@playwright/test';
import { LoginPage } from './loginPage';
import { HomePage } from './homePage';
import { EventPage } from './eventPage';

export class BasePage {
    readonly page: Page;
    readonly loginPage: LoginPage;
    readonly homePage: HomePage;
    readonly eventPage: EventPage;  

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
        this.eventPage = new EventPage(page);
    }   

}
