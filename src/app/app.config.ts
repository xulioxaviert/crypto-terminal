import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, icons } from 'lucide-angular';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(LucideAngularModule.pick(icons)),
    //Actualizamos el provider de router para quitar el Zone.js
    //Esto es para mejorar el rendimiento de la aplicación an Angular 20
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideHttpClient()
  ],
};
