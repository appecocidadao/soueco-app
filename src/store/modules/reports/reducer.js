import produce from 'immer';

const INITIAL_STATE = {
  reportsNotSent: [],
  reportsSent: [],
  loading: false,
};

// AsyncStorage.clear();

const reports = (state = INITIAL_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@reports/ADD': {
        const { report } = action.payload;

        draft.reportsNotSent.push(report);
        break;
      }
      case '@reports/SEND_SUCCESS': {
        const { report } = action.payload;

        const reportIdx = state.reportsNotSent.findIndex(
          (rep) => rep.timestamp === report.timestamp
        );

        if (reportIdx !== -1) {
          draft.reportsNotSent.splice(reportIdx, 1);
        }

        draft.reportsSent.push(report);
        // draft.loading = false;
        break;
      }
      case '@reports/SEND_FAILURE': {
        // alguma denuncia falhou
        // draft.loading = false;
        break;
      }

      // case '@reports/SET_LOADING': {
      //   draft.loading = action.payload;
      //   break;
      // }
      default:
    }
  });
};

export default reports;
