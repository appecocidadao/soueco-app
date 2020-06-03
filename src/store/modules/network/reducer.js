import produce from 'immer';

const INITIAL_STATE = {
  isConnected: false,
};

const network = (state = INITIAL_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@network/CHECK_CONNECTION': {
        draft.isConnected = action.payload;
        break;
      }
      default:
    }
  });
};

export default network;
