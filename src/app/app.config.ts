import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideHttpClient()],
};

export const restaurantName = 'Change Me in app.config.ts!';
export const restaurantAddress = '1231 Albrecht Blvd, Fargo, ND 58102';
export const taxRate = 0.07;
export const deliveryFeeBase = 3.99;
export const deliveryFeePerMile = 0.50;
export const maxDeliveryDistance = 35; // in miles