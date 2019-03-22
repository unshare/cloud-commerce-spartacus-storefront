import { TestBed } from '@angular/core/testing';

import { CmsService, PageType, TranslationService } from '@spartacus/core';
import { CmsMappingService } from '@spartacus/storefront';
import { of } from 'rxjs';
import createSpy = jasmine.createSpy;
import { CmsI18nService } from './cms-i18n.service';

describe('CmsI18nService', () => {
  let service: CmsI18nService;
  let translation: TranslationService;

  const mockPageContext = {
    type: PageType.CONTENT_PAGE,
    id: 'testId'
  };
  const mockCmsMapping = {
    getI18nNamespacesForComponents: () => ['namespace1', 'namespace2']
  };
  const mockCmsService = {
    getPageComponentTypes: () => of([])
  };
  const mockTranslation = {
    loadNamespaces: createSpy('loadNamespaces')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CmsI18nService,
        { provide: CmsService, useValue: mockCmsService },
        { provide: CmsMappingService, useValue: mockCmsMapping },
        { provide: TranslationService, useValue: mockTranslation }
      ]
    });
    service = TestBed.get(CmsI18nService);
    translation = TestBed.get(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadNamespaces', () => {
    it('should load namespaces for given page context', () => {
      service.loadNamespaces(mockPageContext);

      expect(translation.loadNamespaces).toHaveBeenCalledWith([
        'namespace1',
        'namespace2'
      ]);
    });
  });
});