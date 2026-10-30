import { BasePage } from '../pages/basePage';
import { test as baseTest, chromium, type Browser, type BrowserContext, type Page, request } from '@playwright/test';
import * as path from 'path';
import * as os from 'os';
import { LoginPage } from '../pages/loginPage';
import { URL_EventHub, email, password, URL_EventHub_EVENTCREATION, request_URL_EventHub } from '../constants';
import { APIUtils } from '../utils/apiUtils';
const loginPayload = { email, password };
import createEventData from '../testData/eventCreation.json';

let token: string;

export const test = baseTest.extend<{
    app: BasePage;
    contextWithStorageState: BrowserContext;
    loginUsingAPICall: BasePage;
    createOrder: any;
    datafixtureExample: string;

}>({
    browser: async ({}, use, testInfo) => {
        let browser: Browser | null = null;
        if(process.env.INCOGNITO === 'true'){
            console.log();
            await use(browser as any);
        } else {
            browser = await chromium.launch();
            await use(browser);
            await browser.close();
        }
    },

    context: async ({browser}, use, testInfo) => {
        let context: BrowserContext;
        if(process.env.INCOGNITO === 'true'){
            const userDataDir = path.join(os.tmpdir(), `playwright-user-data-${Date.now()}`);
            const isCI = process.env.CI === 'true';
            console.log(`Creating incognito context with user data dir: ${userDataDir}`);
           
            context = await chromium.launchPersistentContext(userDataDir, {
                headless: isCI,
                channel: isCI ? undefined : 'chrome',
                args: ['--incognito'],
            });
        } else if(browser){
            const contextOptions = {
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
            };
            context = await browser.newContext(contextOptions);
        } else {
            throw new Error('Browser instance is not available.');
        }

        await use(context);
        await context.close();
    },

    contextWithStorageState: async ({browser}, use) => {
        const contextWithStorageState = await browser.newContext();
        await use(contextWithStorageState);
        await contextWithStorageState.close();
    },

    page: async ({context}, use) => {

        let page: Page;
        if(process.env.INCOGNITO === 'true' && context.pages().length > 0){
            page = context.pages()[0];
            console.log(`Using existing page in incognito context: ${page.url()}`);
        } else {
            page = await context.newPage();
        }
        await use(page);
        
        if(process.env.INCOGNITO !== 'true'){
            await page.close();
        }
    },
 
    app: async ({page,browser,context,contextWithStorageState}, use, testInfo) => {
        const app = new BasePage(page,browser,context,contextWithStorageState);
        await use(app);
        //await app.close();
    },

    loginUsingAPICall: async ({page,browser,context,contextWithStorageState}, use) => {
        const loginPageObj = new LoginPage(page,browser,context,contextWithStorageState);
        await page.goto(URL_EventHub);
        await loginPageObj.login();
        contextWithStorageState = await browser.newContext({ storageState: 'storageState.json' });
        const app = new BasePage(page,browser,context,contextWithStorageState);
        await use(app);
        await contextWithStorageState.close();
    },

    createOrder: async ({}, use:any) => {
        const apicontext = await request.newContext();
        const apiUtils = new APIUtils(apicontext, loginPayload);
        const token = await apiUtils.getToken(request_URL_EventHub, loginPayload);
        const event = await apiUtils.createEvent(URL_EventHub_EVENTCREATION, createEventData, token);
        await use(event);
        await event.close();
    },

    // datafixtureExample: {
    //     value : 'xyz',
    // }


});
