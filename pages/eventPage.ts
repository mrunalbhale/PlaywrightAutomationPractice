import {expect,Page,Locator} from '@playwright/test';
import { test } from '../fixtures/baseTest';
import createEventData from '../testData/createEvent.json';

export class EventPage {    
    readonly page: Page;
    readonly eventHeader : Locator;
    readonly fullNameInputField : Locator;
    readonly emailInputField : Locator;
    readonly phoneInputField : Locator;
    readonly confirmBookingButton : Locator;
    readonly bookingConfirmationMessage : Locator;
    readonly ticketCountValue : Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventHeader = this.page.locator('h1').filter({ hasText: createEventData.Title });
        this.fullNameInputField = this.page.locator('#customerName');
        this.emailInputField = this.page.locator('#customer-email');
        this.phoneInputField = this.page.locator('#phone');
        this.confirmBookingButton = this.page.locator('#confirm-booking');
        this.bookingConfirmationMessage = this.page.locator('h3').filter({ hasText: 'Booking Confirmed!' });
        this.ticketCountValue = this.page.locator('#ticket-count');
    }

    async verifyEventHeader() {
        await expect(this.eventHeader).toBeVisible();
    }

    async enterFullName(fullName: string) {
        await this.fullNameInputField.fill(fullName);
    }

    async enterEmail(email: string) {
        await this.emailInputField.fill(email);
    }

    async enterPhone(phone: string) {
        await this.phoneInputField.fill(phone);
    }

    async clickConfirmBookingButton() {
        await this.confirmBookingButton.click();
    }

    async getTicketCount(): Promise<number> {
        const ticketCountText = await this.ticketCountValue.textContent();
        return parseInt(ticketCountText || '0', 10);
    }
}