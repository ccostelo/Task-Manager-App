import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {UpgradeModule} from '@angular/upgrade/static';
import './assets/legacy/js/app.js';
import './assets/legacy/js/controllers/taskController.js';
import './assets/legacy/js/services/taskService.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
  const upgrade = platformRef.injector.get(UpgradeModule);
  upgrade.bootstrap(document.body, ['taskApp']);
});

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
