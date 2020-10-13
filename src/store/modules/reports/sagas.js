import { Alert } from 'react-native';

import { takeLatest, select, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';

import { sendReportSuccess, sendReportFailure } from './actions';
import AddressByLocation from '~/utils/AddressByLocation';
import { translate } from '~/locales';

export function* sendReports() {
  const reportsNotSent = yield select((state) => state.reports.reportsNotSent);

  for (const [idx, info] of reportsNotSent.entries()) {
    // const todo = await fetch(url);
    // console.log(`Received Todo ${idx+1}:`, todo);

    try {
      // if (id === '') {
      //   Alert.alert('Falha na autenticação', 'Informe o ID.');
      //   yield put(signFailure());
      //   return;
      // }

      if (
        info.latitude &&
        info.longitude &&
        info.latitude !== '' &&
        info.longitude !== '' &&
        (info.city === '' || info.state === '')
      ) {
        const address = yield AddressByLocation({
          latitude: info.latitude,
          longitude: info.longitude,
        });

        info.state = address.state;
        info.city = address.city;
      }

      const report = new FormData();

      report.append('anonymous', info.anonymous);

      report.append('name', info.name);
      report.append('email', info.email);
      report.append('contact', info.phone);

      report.append('urban', info.urban);

      report.append('street', info.place);
      report.append('district', info.zone);
      report.append('number', info.number);
      report.append('zipcode', info.cep);
      report.append('state', info.state);
      report.append('city', info.city);
      report.append('reference', info.reference);
      report.append('latitude', info.latitude);
      report.append('longitude', info.longitude);
      report.append('timestamp', info.timestamp);

      report.append('type', info.type);
      report.append('description', info.description);
      report.append('file', info.image[0]);
      report.append('file', info.image[1]);
      report.append('file', info.image[2]);

      const response = yield call(api.post, '/denunciations', report, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const {
        data: { denunciation },
      } = response;

      yield put(sendReportSuccess(denunciation));
    } catch (err) {
      if (err.response) {
        // const codeErro = err.response.status;
        // if (codeErro === 400) {
        //   Alert.alert('Sentimos muito :(', 'Err');
        // } else {
        //   Alert.alert('Falha na autenticação', 'O ID é inválido.');
        // }
        Alert.alert(
          translate('failedReportArchived'),
          translate('invalidReport')
        );
      } else {
        Alert.alert(translate('failedReportArchived'), translate('tryLater'));
      }
      yield put(sendReportFailure());
    }
  }
}

export default all([takeLatest('@reports/SEND_ALL_REQUEST', sendReports)]);
