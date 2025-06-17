import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {downgradeInjectable, UpgradeModule} from '@angular/upgrade/static';
import './assets/legacy/js/app.js';
import './assets/legacy/js/controllers/taskController.js';
import './assets/legacy/js/services/taskService.js';
import { TaskService2 } from './app/services/task.service';

declare var angular: any;

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((platformRef) => {
    angular
      .module('taskApp')
      .factory('TaskService2', downgradeInjectable(TaskService2));
    const upgrade = platformRef.injector.get(UpgradeModule);
    upgrade.bootstrap(document.body, ['taskApp']);
  })
  .catch((error) => console.error(error));

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
