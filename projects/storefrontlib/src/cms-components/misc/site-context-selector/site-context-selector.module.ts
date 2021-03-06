import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  ConfigModule,
  ContextServiceMap,
  SiteContextModule,
} from '@spartacus/core';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
import { IconModule } from '../icon/index';
import { LanguageCurrencyComponent } from './language-currency.component';
import { SiteContextComponentService } from './site-context-component.service';
import { SiteContextSelectorComponent } from './site-context-selector.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CMSSiteContextComponent: {
          selector: 'cx-site-context-selector',
          providers: [
            {
              provide: SiteContextComponentService,
              useClass: SiteContextComponentService,
              deps: [CmsComponentData, ContextServiceMap, Injector],
            },
          ],
        },
        LanguageCurrencyComponent: {
          selector: 'cx-language-currency-selector',
        },
      },
    }),
    SiteContextModule,
    IconModule,
  ],
  providers: [SiteContextComponentService],
  declarations: [SiteContextSelectorComponent, LanguageCurrencyComponent],
  entryComponents: [SiteContextSelectorComponent, LanguageCurrencyComponent],
})
export class SiteContextSelectorModule {}
