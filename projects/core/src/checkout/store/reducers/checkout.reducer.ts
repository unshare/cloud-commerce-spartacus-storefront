import { CheckoutStepsState } from '../checkout-state';
import * as fromAction from './../actions/index';
import { DeliveryMode, Order } from '../../../model/order.model';
import { Address } from '../../../model/address.model';

export const initialState: CheckoutStepsState = {
  address: {},
  deliveryMode: {
    supported: {},
    selected: '',
  },
  paymentDetails: {},
  orderDetails: {},
};

export function reducer(
  state = initialState,
  action: fromAction.CheckoutAction | fromAction.CheckoutClearMiscsData
): CheckoutStepsState {
  switch (action.type) {
    case fromAction.ADD_DELIVERY_ADDRESS_SUCCESS:
    case fromAction.SET_DELIVERY_ADDRESS_SUCCESS: {
      const address: Address = action.payload;

      return {
        ...state,
        address,
      };
    }

    case fromAction.LOAD_SUPPORTED_DELIVERY_MODES_SUCCESS: {
      const supportedModes = action.payload;
      if (!supportedModes) {
        return state;
      }

      const supported = supportedModes.reduce(
        (modes: { [code: string]: DeliveryMode }, mode: DeliveryMode) => {
          return {
            ...modes,
            [mode.code]: mode,
          };
        },
        {
          ...state.deliveryMode.supported,
        }
      );

      return {
        ...state,
        deliveryMode: {
          ...state.deliveryMode,
          supported,
        },
      };
    }

    case fromAction.SET_DELIVERY_MODE_SUCCESS: {
      const selected = action.payload;

      return {
        ...state,
        deliveryMode: {
          ...state.deliveryMode,
          selected,
        },
      };
    }

    case fromAction.CREATE_PAYMENT_DETAILS_SUCCESS:
    case fromAction.SET_PAYMENT_DETAILS_SUCCESS: {
      return {
        ...state,
        paymentDetails: action.payload,
      };
    }

    case fromAction.CREATE_PAYMENT_DETAILS_FAIL: {
      const paymentDetails = action.payload;
      if (paymentDetails['hasError']) {
        return {
          ...state,
          paymentDetails,
        };
      }

      return state;
    }

    case fromAction.PLACE_ORDER_SUCCESS: {
      const orderDetails: Order = action.payload;

      return {
        ...state,
        orderDetails,
      };
    }

    case fromAction.CLEAR_CHECKOUT_DATA: {
      return initialState;
    }

    case fromAction.CLEAR_CHECKOUT_STEP: {
      const stepNumber = action.payload;
      switch (stepNumber) {
        case 1: {
          return {
            ...state,
            address: {},
          };
        }

        case 2: {
          return {
            ...state,
            deliveryMode: {
              ...state.deliveryMode,
              supported: {},
              selected: '',
            },
          };
        }

        case 3: {
          return {
            ...state,
            paymentDetails: {},
          };
        }
      }

      return state;
    }

    case fromAction.CLEAR_SUPPORTED_DELIVERY_MODES:
    case fromAction.CHECKOUT_CLEAR_MISCS_DATA: {
      return {
        ...state,
        deliveryMode: {
          ...state.deliveryMode,
          supported: {},
        },
      };
    }
    case fromAction.LOAD_CHECKOUT_DETAILS_SUCCESS: {
      return {
        ...state,
        address: action.payload.deliveryAddress,
        deliveryMode: {
          ...state.deliveryMode,
          selected:
            action.payload.deliveryMode && action.payload.deliveryMode.code,
        },
        paymentDetails: action.payload.paymentInfo,
      };
    }
  }

  return state;
}
