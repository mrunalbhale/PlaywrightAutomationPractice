import {expect,Locator, Page} from '@playwright/test';
import createEventData from '../testData/createEvent.json';

export class HomePage {
    readonly page: Page;
    readonly  homeButton : Locator;
    readonly  adminButton : Locator;
    readonly manageEventsLink : Locator;
    readonly eventTitle : Locator;
    readonly eventDescription : Locator;
    readonly city : Locator;
    readonly venue : Locator;
    readonly eventDateAndTime : Locator;
    readonly price : Locator;
    readonly totalSeats : Locator;
    readonly addEventButton : Locator;
    readonly headingForNewEvent : Locator;
    readonly eventCard : Locator;

    constructor(page: Page) {
        this.page = page;
        this.adminButton = this.page.getByRole('button', { name: 'Admin' });
        this.homeButton = this.page.getByRole('link', { name: 'Home' });
        this.manageEventsLink = this.page.getByRole('link', { name: 'Manage Events' }).first();
        this.eventTitle = this.page.getByTestId('event-title-input');
        this.eventDescription = this.page.getByPlaceholder('Describe the event…');
        this.city = this.page.getByPlaceholder('e.g. Bangalore');
        this.venue = this.page.getByPlaceholder('Venue name & address');
        this.eventDateAndTime = this.page.locator("input[type='datetime-local']");
        this.price = this.page.locator("input[id^='price']");
        this.totalSeats = this.page.locator('#total-seats');
        this.addEventButton = this.page.getByRole('button', { name: '+ Add Event' });
        this.headingForNewEvent = this.page.getByRole('heading', { name: createEventData.Title });
        this.eventCard = this.page.locator('#event-card');
    }

    async navigateToHomePage() {
        await this.homeButton.click();
    }

    async enterTitle(title: string) {
        await this.eventTitle.fill(title);
    };

    async enterDescription(description: string) {
        await this.eventDescription.fill(description);
    };

    async enterCity(city: string) {
        await this.city.fill(city);
    };

    async enterVenue(venue: string) {
        await this.venue.fill(venue);
    };

    async enterEventDateAndTime(dateAndTime: string) {
        await this.eventDateAndTime.fill(dateAndTime);
    };

    async enterPrice(price: string) {
        await this.price.fill(price);
    };

    async enterTotalSeats(seats: string) {
        await this.totalSeats.fill(seats);
    };

    async clickAddEventButton() {
        await this.addEventButton.click();
    }

    async verifyEventCreated(eventName: string) : Promise<boolean> {
        await expect(await this.eventCard.filter({ hasText: eventName })).toBeVisible();
        return true;
    }

    async verifyEventCardForSpecificEventAndClickBookNow( eventName: string) {
        const specificEvent = await this.eventCard.filter({ hasText: eventName });
        await specificEvent.locator('#book-now-btn').click();
    }

    async verifyEventCardForSpecificEvent( eventName: string) {
        const specificEvent = await this.eventCard.filter({ hasText: eventName });
    }

    async seatsAvailableCount( eventName: string) {
        const specificEvent = await this.eventCard.filter({ hasText: eventName });
        const seatsLocator = specificEvent.locator('span').filter({
                                hasText: 'seats available',
                                });

        const seats = await seatsLocator.textContent();
        const availableSeats = Number(seats?.match(/\d+/)?.[0]);
        return availableSeats;  
    }
}



