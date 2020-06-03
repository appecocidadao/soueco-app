import 'react-native-gesture-handler';
import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';

import { StatusBar } from 'react-native';

import './config/ReactotronConfig';

import { store, persistor } from './store';

import App from './App';

import colors from '~/styles/colors';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

class Index extends Component {
  constructor(props) {
    super(props);

    OneSignal.init('c9aeeb77-7421-4ad2-939b-d19618ff7640');

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived = (notification) => {
    console.log('Notification received: ', notification);
  };

  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  onIds = (device) => {
    console.log('Device info: ', device);
  };

  render() {
    return (
      <NavigationContainer>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <StatusBar
              backgroundColor={colors.primary}
              barStyle="light-content"
            />
            <App />
          </PersistGate>
        </Provider>
      </NavigationContainer>
    );
  }
}

export default codePush(codePushOptions)(Index);
