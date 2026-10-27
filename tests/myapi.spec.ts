import {expect, request} from "@playwright/test";
import { readFile } from "node:fs/promises";
import { test } from "../fixtures/baseTest";
import { email, password, request_URL_EventHub, URL_EventHub_EVENTCREATION } from "../constants";
const loginPayload = {email: email, password: password};

const eventCreationPayload = {
  title: "AI Summit 2026",
  description: "GEN AI knowledge Sharing event for AI enthusiasts and professionals.",
  category: "Conference",
  venue: "Bangalore International Centre",
  city: "Bangalore",
  eventDate: "2027-12-15T09:00:00.000Z",
  price: 100,
  totalSeats: 500,
  imageUrl: "https://example.com/banner.jpg"
};

let token: string;
import { webActions } from "../utils/webActions";
import createEventData from '../testData/eventCreation.json';

test.beforeAll(async ({  }) => {
    const context = await request.newContext();
    const response = await context.post(request_URL_EventHub, {
        data: loginPayload
    });
    expect(response.ok()).toBeTruthy();
    const responseBodyJson = await response.json();
    token = responseBodyJson.token;
    console.log(`Token received: ${token}`);
});

test('Verify API Login and Token Retrieval', async ({app}) => {
    const objWebActions = new webActions(app.page); 
    await objWebActions.setAPIToken(token);
    await app.loginPage.launchURLForAPILogin();
    await expect(app.homePage.adminButton).toBeVisible();    
});

test('Create an event using an API call', async ({app}) => {
    const objWebActions = new webActions(app.page); 
    await objWebActions.setAPIToken(token);
    await app.loginPage.launchURLForAPILogin();

    const context = await request.newContext();
    const response = await context.post(URL_EventHub_EVENTCREATION, {
        data: eventCreationPayload,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    expect(response.status()).toBe(201);
    const responseBodyJson = await response.json();
    console.log(`Event created: ${JSON.stringify(responseBodyJson)}`);
});
