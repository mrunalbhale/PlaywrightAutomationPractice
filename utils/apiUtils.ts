import {Page} from "@playwright/test";
import { request_URL_EventHub, URL_EventHub_EVENTCREATION } from "../constants";

export class APIUtils {
    apiContext: any;
    loginPayload: object;
    request_URL_EventHub: string;

    constructor(apiContext: any, loginPayload: object) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
        this.request_URL_EventHub = request_URL_EventHub;
    }

    async getToken(request_URL_EventHub: string, loginPayload: object): Promise<string> {     
        const response = await this.apiContext.post(request_URL_EventHub, {
            data: loginPayload
        });
        const responseBodyJson = await response.json();
        return responseBodyJson.token;
    }

    async createEvent(URL_EventHub_EVENTCREATION: string, createEventData: object, token: string): Promise<any> {
        const response = await this.apiContext.post(URL_EventHub_EVENTCREATION, {
            data: createEventData,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        return response;
    }
}