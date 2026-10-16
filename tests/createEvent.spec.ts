import { expect } from '@playwright/test';
import { test } from '../fixtures/baseTest';
import createEventData from '../testData/createEvent.json';

test('Create Event and Verify Booking Flow', async ({ app }) => {
    //Event creation flow
    await app.loginPage.navigateToLoginPage();
    await app.loginPage.login();
    await app.homePage.adminButton.click();
    await app.homePage.manageEventsLink.click();
    await app.homePage.enterTitle(createEventData.Title);
    await app.homePage.enterDescription(createEventData.Description);
    await app.homePage.enterCity(createEventData.City);
    await app.homePage.enterVenue(createEventData.Venue);
    await app.homePage.enterEventDateAndTime(createEventData['Event date and time']);
    await app.homePage.enterPrice(createEventData.Price);
    await app.homePage.enterTotalSeats(createEventData['Total Seats']);
    await app.homePage.clickAddEventButton();

    // Verify event creation and booking flow
    await app.homePage.navigateToHomePage();  
    await expect(await app.homePage.verifyEventCreated(createEventData.Title)).toBe(true);
    const seatsAvailable = await app.homePage.seatsAvailableCount(createEventData.Title);
    await app.homePage.verifyEventCardForSpecificEventAndClickBookNow(createEventData.Title);
    await app.eventPage.verifyEventHeader();
    await app.eventPage.enterFullName('John Doe');
    await app.eventPage.enterEmail('johndoe@example.com');
    await app.eventPage.enterPhone('1234567890');
    const ticketCount = await app.eventPage.getTicketCount();
    await app.eventPage.clickConfirmBookingButton(); 
    await expect(app.eventPage.bookingConfirmationMessage).toBeVisible();
    await app.homePage.navigateToHomePage();

    // Verify seats available after booking
    await app.homePage.verifyEventCardForSpecificEvent(createEventData.Title);
    const seatsAvailableAfterBooking = await app.homePage.seatsAvailableCount(createEventData.Title);
    console.log(`Seats available for ${createEventData.Title}: ${seatsAvailableAfterBooking}`); 
    await expect(seatsAvailableAfterBooking).toBe(seatsAvailable - ticketCount);
});

