import React from 'react';
import { Button, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '~/pages/Home';
import NewReport from '~/pages/NewReport';
import MyReports from '~/pages/MyReports';
import TCEAmbiental from '~/pages/TCEAmbiental';
import About from '~/pages/About';

import { translate } from '~/locales';

const Drawer = createDrawerNavigator();

export default function createRouter() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContentOptions={{
        activeTintColor: '#63BD53',
        inactiveTintColor: '#04884E',
      }}
      drawerStyle={{ backgroundColor: '#fff' }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Sou ECO!',
          drawerIcon: ({ color }) => (
            <Icon name="home" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="NewReport"
        options={{
          title: translate('identifiedReport'),
          drawerIcon: ({ color }) => (
            <Icon name="person" size={20} color={color} />
          ),
        }}
      >
        {(props) => <NewReport {...props} anonymous={false} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="NewReportAnonymous"
        options={{
          title: translate('anonymousReport'),
          drawerIcon: ({ color }) => (
            <Icon name="lock" size={20} color={color} />
          ),
        }}
      >
        {(props) => <NewReport {...props} anonymous />}
      </Drawer.Screen>
      <Drawer.Screen
        name="MyReports"
        component={MyReports}
        options={{
          title: translate('myReports'),
          drawerIcon: ({ color }) => (
            <Icon name="receipt" size={20} color={color} />
          ),
        }}
      />

      {/* <Drawer.Screen
        name="TCEAmbiental"
        component={TCEAmbiental}
        options={{
          title: 'TCE Ambiental',
          drawerIcon: ({ color }) => (
            <Icon name="nature-people" size={20} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="About"
        component={About}
        options={{
          title: translate('aboutTheApp'),
          drawerIcon: ({ color }) => (
            <Icon name="info" size={20} color={color} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
}
