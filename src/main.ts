// in typescript if you want to use certain features you need to import them
// this is what's happening here
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// this starts the angular application
// we call the platformBrowserDynamic() function which return something (maybe an object)
// and on that object we call the bootstrapModule function with the parameter AppModule which we imported before
// the AppModule is located in the app.module.ts btw
// "start the angular application with the AppModule (--> registering all the components etc.) in mind"
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
