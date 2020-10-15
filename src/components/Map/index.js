/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Platform, Alert, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import { useSelector } from 'react-redux';
// import Geocoder from 'react-native-geocoding';

import Colors from '~/styles/colors';
import ButtonIcon from '~/components/ButtonIcon';
import Loading from '~/components/Loading';
import AddressByLocation from '~/utils/AddressByLocation';
import { translate } from '~/locales';

// Geocoder.init('AIzaSyAKZxm85lnVjuiqzwEiAjjn6hTioyDLDrQ');

Geolocation.setRNConfiguration({ authorizationLevel: 'always' });

export default function Map({ urban, closeModal, onFillLocation }) {
  const network = useSelector((state) => state.network);

  const [data, setData] = useState({
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
    state: '',
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

    setData({ ...data, marker, latitude, longitude });

    if (network.isConnected) {
      setData({
        ...data,
        marker,
        latitude,
        longitude,
        activityIndicator: true,
      });

      try {
        const address = await AddressByLocation({ latitude, longitude });

        setData({
          ...data,
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
        setData({
          ...data,
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
      setData({ ...data, activityIndicator: true });

      Geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setData({
            ...data,
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
          setData({ ...data, activityIndicator: false });
          closeModal();
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 5000,
        }
      );

      setData({ ...data, activityIndicator: false });
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
    state,
  } = data;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
      }}
    >
      {data.activityIndicator ? (
        <Loading />
      ) : Platform.OS === 'ios' ? (
        <MapView
          // style={{ flex: 1 }}
          style={{ flex: 3 }}
          initialRegion={
            data.marker ? { ...region, ...data.marker.latlng } : region
          }
          showsUserLocation
          loadingEnabled
          onPress={(e) => markLocation(e)}
        >
          {data.marker ? (
            <Marker
              coordinate={data.marker.latlng}
              title={data.marker.title}
              description={data.marker.description}
            />
          ) : null}
        </MapView>
      ) : (
        <MapView
          // style={{ flex: 1 }}
          provider="google"
          style={{ flex: 3 }}
          initialRegion={
            data.marker ? { ...region, ...data.marker.latlng } : region
          }
          showsUserLocation
          loadingEnabled
          onPress={(e) => markLocation(e)}
        >
          {data.marker ? (
            <Marker
              coordinate={data.marker.latlng}
              title={data.marker.title}
              description={data.marker.description}
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
            state
          )
        }
      >
        {translate('confirmLocation')}
      </ButtonIcon>
    </View>
  );
}
