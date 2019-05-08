import { TestBed } from '@angular/core/testing';

import { Store, StoreModule, select } from '@ngrx/store';

import * as fromReducers from '../reducers';
import * as fromSelectors from '.';
import { StateWithUser, USER_FEATURE } from '../user-state';
import { ConsignmentTracking } from '../../model/consignment-tracking.model';

describe('Consignment Tracking Selectors', () => {
  let store: Store<StateWithUser>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(USER_FEATURE, fromReducers.getReducers()),
      ],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });
  describe('getConsignmentTracking', () => {
    it('should return the consignment tracking state from the store', () => {
      let result: ConsignmentTracking;
      store
        .pipe(select(fromSelectors.getConsignmentTracking))
        .subscribe(value => (result = value));
      expect(result).not.toBeNull();
    });
  });
});