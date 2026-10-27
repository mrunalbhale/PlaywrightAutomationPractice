import {expect, request} from "@playwright/test";
import { test } from "../fixtures/baseTest";
import { email, password, request_URL_EventHub, URL_EventHub_EVENTCREATION } from "../constants";
const loginPayload = {email: email, password: password};


let token: string;
import { webActions } from "../utils/webActions";
import { APIUtils } from "../utils/apiUtils";
import createEventData from '../testData/eventCreation.json';

test.beforeAll(async ({  }) => {
    const context = await request.newContext();
    const apiUtils = new APIUtils(context, loginPayload);
    token = await apiUtils.getToken(request_URL_EventHub, loginPayload);
    console.log(`Token received: ${token}`);    
});

test('Verify API Login and Token Retrieval', async ({app}) => {
    const objWebActions = new webActions(app.page);    
    await objWebActions.setAPIToken(token);
    await app.loginPage.launchURLForAPILogin();
    await expect(app.homePage.adminButton).toBeVisible();    
});

test('Create an event using an API call', async ({app}) => {
    const context = await request.newContext();
    const apiUtils = new APIUtils(context, loginPayload);

    const objWebActions = new webActions(app.page); 
    await objWebActions.setAPIToken(token);
    await app.loginPage.launchURLForAPILogin();
  
    const response = await apiUtils.createEvent(URL_EventHub_EVENTCREATION, createEventData, token);
    expect(response.status()).toBe(201);
    const responseBodyJson = await response.json();
    console.log(`Event created: ${JSON.stringify(responseBodyJson)}`);
});
