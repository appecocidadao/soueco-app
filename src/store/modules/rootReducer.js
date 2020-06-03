import { combineReducers } from 'redux';
import reports from './reports/reducer';
import privacyPolicy from './privacyPolicy/reducer';
import network from './network/reducer';

export default combineReducers({ reports, privacyPolicy, network });
