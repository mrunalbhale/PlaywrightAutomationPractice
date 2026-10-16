import {BasePage} from '../pages/basePage';
import {Page,Expect,test as baseTest, chromium,Browser,BrowserContext} from '@playwright/test';
import * as path from 'path';
import * as os from 'os';

type Fixtures = {
    basePage: BasePage;
    page: Page;
    browser: Browser;
    context: BrowserContext;
};

export const test = baseTest.extend<{
    fixtures: Fixtures;
    app: BasePage;
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

    app: async ({page}, use, testInfo) => {
        const app = new BasePage(page);
        await use(app);
    }
});