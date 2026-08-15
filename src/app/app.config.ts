import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    provideAnimations(), // 👈 Add this
    provideToastr({
      timeOut: 2500,
  positionClass: 'toast-top-right',
  closeButton: true,
  progressBar: false,
  preventDuplicates: true,
  newestOnTop: true,
  easeTime: 300
    })
  ]
};