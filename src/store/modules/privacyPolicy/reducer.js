import produce from 'immer';

const INITIAL_STATE = {
  isAccepted: false,
};

const privacyPolicy = (state = INITIAL_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@privacy_policy/SET_ACCEPT': {
        draft.isAccepted = action.payload;
        break;
      }
      default:
    }
  });
};

export default privacyPolicy;
