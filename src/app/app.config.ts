import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    //Actualizamos el provider de router para quitar el Zone.js
    //Esto es para mejorar el rendimiento de la aplicación an Angular 20
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideHttpClient()
  ],
};
