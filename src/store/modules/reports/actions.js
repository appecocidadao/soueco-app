export function addReport(report) {
  return {
    type: '@reports/ADD',
    payload: { report },
  };
}

export function sendAllRequest() {
  return {
    type: '@reports/SEND_ALL_REQUEST',
  };
}

export function sendReportSuccess(report) {
  return {
    type: '@reports/SEND_SUCCESS',
    payload: {
      report,
    },
  };
}

export function sendReportFailure(report) {
  return {
    type: '@reports/SEND_FAILURE',
    payload: {
      report,
    },
  };
}
