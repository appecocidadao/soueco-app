import { all } from 'redux-saga/effects';
import reports from './reports/sagas';

export default function* rootSaga() {
  return yield all([reports]);
}
