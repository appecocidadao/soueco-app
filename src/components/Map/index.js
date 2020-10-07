/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Platform,
  Alert,
  Text,
  View,
  Modal,
  ActivityIndicator,
  StatusBar,
  Button,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import { useSelector } from 'react-redux';
// import Geocoder from 'react-native-geocoding';

import ButtonIcon from '~/components/ButtonIcon';
import Loading from '~/components/Loading';
import AddressByLocation from '~/utils/AddressByLocation';
import { translate } from '~/locales';

// Geocoder.init('AIzaSyAKZxm85lnVjuiqzwEiAjjn6hTioyDLDrQ');

Geolocation.setRNConfiguration({ authorizationLevel: 'always' });

export default function Map({ urban, closeModal, onFillLocation }) {
  const network = useSelector((state) => state.network);

  const [state, setState] = useState({
    region: null,
    markers: null,
    address: '',
    location: '',
    activityIndicator: false,
    latitude: '',
    longitude: '',
    number: '',
    place: '',
    city: '',
    cep: '',
    estado: '',
  });

  const markLocation = async (e) => {
    const { latitude } = e.nativeEvent.coordinate;
    const { longitude } = e.nativeEvent.coordinate;

    const marker = {
      title: translate('reportingLocation'),
      latlng: {
        latitude,
        longitude,
      },
      description: translate('reportingLocation'),
    };

    setState({ ...state, marker, latitude, longitude });

    if (network.isConnected) {
      setState({
        ...state,
        marker,
        latitude,
        longitude,
        activityIndicator: true,
      });

      try {
        const address = await AddressByLocation({ latitude, longitude });

        setState({
          ...state,
          marker,
          activityIndicator: false,
          ...address,
          latitude,
          longitude,
        });
      } catch (err) {
        Alert.alert(
          translate('connectionErrorForAddress'),
          translate('checkConnectionInternetForAddress')
        );
        setState({
          ...state,
          marker,
          latitude,
          longitude,
          activityIndicator: false,
        });
        // closeModal();
      }
    }
  };

  useEffect(() => {
    async function loadPosition() {
      setState({ ...state, activityIndicator: true });

      Geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setState({
            ...state,
            region: {
              latitude,
              longitude,
              latitudeDelta: 0.0143,
              longitudeDelta: 0.0134,
            },
          });
        },
        () => {
          Alert.alert(
            translate('locationError'),
            translate('checkConnectionGPS')
          );
          setState({ ...state, activityIndicator: false });
          closeModal();
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 5000,
        }
      );

      setState({ ...state, activityIndicator: false });
    }

    loadPosition();
  }, []);

  const {
    latitude,
    longitude,
    region,
    number,
    place,
    zone,
    city,
    cep,
    estado,
  } = state;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#04884E" barStyle="light-content" />

      {state.activityIndicator ? (
        <Loading />
      ) : Platform.OS === 'ios' ? (
        <MapView
          // style={{ flex: 1 }}
          style={{ flex: 3 }}
          initialRegion={
            state.marker ? { ...region, ...state.marker.latlng } : region
          }
          showsUserLocation
          loadingEnabled
          onPress={(e) => markLocation(e)}
        >
          {state.marker ? (
            <Marker
              coordinate={state.marker.latlng}
              title={state.marker.title}
              description={state.marker.description}
            />
          ) : null}
        </MapView>
      ) : (
        <MapView
          // style={{ flex: 1 }}
          provider="google"
          style={{ flex: 3 }}
          initialRegion={
            state.marker ? { ...region, ...state.marker.latlng } : region
          }
          showsUserLocation
          loadingEnabled
          onPress={(e) => markLocation(e)}
        >
          {state.marker ? (
            <Marker
              coordinate={state.marker.latlng}
              title={state.marker.title}
              description={state.marker.description}
            />
          ) : null}
        </MapView>
      )}

      <ButtonIcon
        onPress={() =>
          onFillLocation(
            latitude,
            longitude,
            number,
            place,
            zone,
            city,
            cep,
            estado
          )
        }
      >
        {translate('confirmLocation')}
      </ButtonIcon>
    </View>
  );
}
