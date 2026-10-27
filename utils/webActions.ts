import { Page, expect } from "@playwright/test";
import { readFile } from "fs/promises";

export class webActions {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }       


    async setAPIToken(token: string) {
        await this.page.addInitScript((token) => {
            window.localStorage.setItem("eventhub_token", token);
        }, token);  
    }

    async  readJSONFile(filePath: string): Promise<Record<string, unknown>> {
        const contents = await readFile(filePath, "utf-8");
        return JSON.parse(contents) as Record<string, unknown>;
    }
}