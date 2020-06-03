/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
  Image,
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Picker,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
// import AsyncStorage from '@react-native-community/async-storage';

import Geolocation from '@react-native-community/geolocation';
// import AddressByLocation from '~/utils/AddressByLocation';

import {
  // sendAllRequest,
  addReport,
  sendReportSuccess,
} from '~/store/modules/reports/actions';

import Map from '~/components/Map';
import Header from '~/components/Header';
import Card from '~/components/Card';
import ButtonIcon from '~/components/ButtonIcon';
import CustomInput from '~/components/CustomInput';

import Colors from '~/styles/colors';

import api from '~/services/api';
import Loading from '~/components/Loading';

import { translate } from '~/locales';

Geolocation.setRNConfiguration({ authorizationLevel: 'always' });

function NewReport({ anonymous, navigation }) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const network = useSelector((state) => state.network);

  const [state, setState] = useState({
    pickerUrbanVisible: false,
    pickerVisible: false,

    mapVisible: false,

    activityIndicator: false,

    name: '',
    email: '',
    phone: '',

    urban: true,
    place: '',
    zone: '',
    number: '',
    cep: '',
    city: '',
    estado: '',
    reference: '',
    latitude: '',
    longitude: '',

    type: '',
    description: '',
    filePath: [null, null, null],
  });

  const [image, setImage] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  const initialState = {
    pickerUrbanVisible: false,
    pickerVisible: false,

    mapVisible: false,

    activityIndicator: false,

    name: '',
    email: '',
    phone: '',

    urban: true,
    place: '',
    zone: '',
    number: '',
    cep: '',
    // city: '',
    // estado: '',
    reference: '',
    // latitude: '',
    // longitude: '',

    type: '',
    description: '',
    filePath: [null, null, null],
  };

  useEffect(() => {
    async function loadPosition() {
      setLoading(true);

      // setState(initialState);
      // setImage([null, null, null]);

      // console.log('loadPOsition');

      Geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setState({
            ...state,
            latitude,
            longitude,
          });
        },
        (err) => {
          Alert.alert(
            translate('locationError'),
            translate('checkConnectionGPS')
          );
          setLoading(false);
          // closeModal();
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 5000,
        }
      );

      setLoading(false);
    }

    if (isFocused) {
      loadPosition();
    }
  }, [isFocused]);

  const typesReports = useMemo(() => {
    return [
      {
        label: translate('selectReportType'),
        value: '',
      },
      {
        label: translate('trash'),
        value: 'Lixo',
      },
      {
        label: translate('water'),
        value: 'Água',
      },
      {
        label: translate('burned'),
        value: 'Queimadas',
      },
      {
        label: translate('deforestation'),
        value: 'Desmatamentos',
      },
      {
        label: translate('traffickingAnimals'),
        value: 'Tráfico de animais silvestres',
      },
      {
        label: translate('predatoryFishing'),
        value: 'Pesca predatória',
      },
      {
        label: translate('hazardousWaste'),
        value: 'Resíduos perigosos',
      },
      {
        label: translate('others'),
        value: 'Outros',
      },
    ];
  }, []);

  const onFillLocation = (
    latitude,
    longitude,
    number,
    place,
    zone,
    city,
    cep,
    estado
  ) => {
    setState({
      ...state,
      latitude,
      longitude,

      place,
      zone,
      city,
      cep,
      estado,
      mapVisible: false,
    });
  };

  // const pushReportCode = async (code) => {
  //   let codes = null;

  //   const storedCodes = JSON.parse(await AsyncStorage.getItem('USER_REPORTS'));

  //   storedCodes ? (codes = storedCodes) : (codes = []);

  //   codes.push(code);

  //   await AsyncStorage.setItem('USER_REPORTS', JSON.stringify(codes));
  // };

  const handleSubmit = async () => {
    const {
      name,
      email,
      phone,
      urban,
      place,
      zone,
      number,
      cep,
      city,
      estado,
      reference,
      type,
      description,
      latitude,
      longitude,
    } = state;

    if (!anonymous && (!email || !name || !phone)) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    if (urban && !number) {
      const AsyncAlert = async () =>
        new Promise((resolve) => {
          Alert.alert(
            translate('numberRequired'),
            translate('setUnknownFild'),
            [
              {
                text: translate('yes'),
                onPress: async () => {
                  resolve(true);
                  setState({
                    ...state,
                    number: translate('none'),
                  });
                },
              },
              {
                text: translate('no'),
                onPress: () => {
                  resolve(false);
                },
                style: 'cancel',
              },
            ]
          );
        });

      const ans = await AsyncAlert();
      if (!ans) {
        return;
      }
    }

    if (urban && (!place || !zone || !cep || !number)) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    if (!city || !estado) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    if (!type || !description) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    if (!image[0] && !image[1] && !image[2]) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    // if (
    //   latitude &&
    //   longitude &&
    //   latitude !== '' &&
    //   longitude !== '' &&
    //   (city === '' || estado === '')
    // ) {
    //   AddressByLocation({ latitude, longitude }).then((address) => {
    //
    //   });
    // }

    // eslint-disable-next-line no-empty
    if (!latitude || !longitude || latitude === '' || longitude === '') {
      Geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setState({
            ...state,
            latitude,
            longitude,
          });
        },
        (err) => {
          Alert.alert(
            translate('locationError'),
            translate('checkConnectionGPS')
          );
          setLoading(false);
          // closeModal();
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 5000,
        }
      );

      Alert.alert(translate('incompleteReport'), translate('failGetLocation'));
      return;
    }

    try {
      if (!network.isConnected) {
        throw new Error('Fail');
      }
      setLoading(true);

      const report = new FormData();

      report.append('anonymous', anonymous);

      if (!anonymous) {
        report.append('name', name);
        report.append('email', email);
        report.append('contact', phone);
      }

      report.append('urban', urban);

      report.append('street', place);
      report.append('district', zone);
      report.append('number', number);
      report.append('zipcode', cep);
      report.append('state', estado);
      report.append('city', city);
      report.append('reference', reference);
      report.append('latitude', latitude);
      report.append('longitude', longitude);
      report.append('timestamp', new Date().toISOString());

      report.append('type', type);
      report.append('description', description);
      report.append('file', image[0]);
      report.append('file', image[1]);
      report.append('file', image[2]);

      const response = await api.post('/denunciations', report);

      // await pushReportCode(response.data.denunciation.code);

      setState(initialState);
      setImage([null, null, null]);
      setLoading(false);

      Alert.alert(translate('reported'), translate('reportedDescription'));
      dispatch(sendReportSuccess(response.data.denunciation));

      navigation.navigate('Home');
    } catch (err) {
      setLoading(false);

      Alert.alert(translate('errorSend'), translate('submitLater'), [
        {
          text: translate('yesSave'),
          onPress: async () => {
            setLoading(true);

            const {
              pickerUrbanVisible,
              pickerVisible,
              mapVisible,
              activityIndicator,
              filePath,
              ...rest
            } = state;

            rest.image = image;
            rest.anonymous = anonymous;
            rest.timestamp = new Date().toISOString();

            setState(initialState);
            setImage([null, null, null]);

            dispatch(addReport(rest));
            navigation.navigate('Home');
            setLoading(false);

            // try {
            //   const getArchived = JSON.parse(
            //     await AsyncStorage.getItem('ARCHIVED_REPORTS')
            //   );

            //   if (getArchived) {
            //     Alert.alert(
            //       'Você já possui uma denúncia arquivada.',
            //       'Deseja substituí-la?',
            //       [
            //         {
            //           text: 'Sim',
            //           onPress: async () => {
            //             // await AsyncStorage.setItem(
            //             //   'ARCHIVED_REPORTS',
            //             //   JSON.stringify(rest)
            //             // );
            //             dispatch(addReport(rest));
            //             navigation.navigate('Home');
            //             setLoading(false);
            //           },
            //         },
            //         {
            //           text: 'Cancelar',
            //           style: 'cancel',
            //         },
            //       ]
            //     );
            //   } else {
            //     // await AsyncStorage.setItem(
            //     //   'ARCHIVED_REPORTS',
            //     //   JSON.stringify(rest)
            //     // );
            //     dispatch(addReport(rest));
            //     navigation.navigate('Home');
            //     setLoading(false);
            //   }
            // } catch (err) {
            //   alert(err);
            //   navigation.navigate('Home');
            //   setLoading(false);
            // }
          },
        },
        {
          text: translate('noDelete'),
          onPress: () => {
            setState(initialState);
            setImage([null, null, null]);
            navigation.navigate('Home');
          },
          style: 'cancel',
        },
      ]);
    }
  };

  const openPicker = (index) => {
    const options = {
      title: 'Select image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Alert.alert('Erro!', response.error);
        // eslint-disable-next-line no-empty
      } else if (response.didCancel) {
      } else {
        const source = response;

        const tempFilePath = state.filePath;

        tempFilePath[index] = source;

        setState({ ...state, filePath: tempFilePath });

        ImageResizer.createResizedImage(response.uri, 500, 500, 'JPEG', 70)
          .then(({ uri }) => {
            const prefix = new Date().getTime();

            const img = {
              uri,
              type: response.type,
              name: `${prefix}.jpg`,
            };

            const tempImage = image;

            tempImage[index] = img;

            setImage(tempImage);
          })
          .catch((err) => {
            Alert.alert(
              translate('imageError'),
              translate('imageErrorDescription')
            );
          });
      }
    });
  };

  const deleteImage = (index) => {
    Alert.alert(translate('Attention'), translate('msgDeleteImg'), [
      {
        text: translate('yesDelete'),
        onPress: () => {
          const tmp = image;

          tmp[index] = null;

          setImage(tmp);
        },
      },
      {
        text: translate('cancel'),
        style: 'cancel',
      },
    ]);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#04884E" />

      <Modal
        animationType="slide"
        visible={state.mapVisible}
        onRequestClose={() => setState({ ...state, mapVisible: false })}
      >
        <Map
          closeModal={() => setState({ ...state, mapVisible: false })}
          onFillLocation={onFillLocation}
          urban={state.urban}
        />
      </Modal>

      <Header
        title={
          anonymous
            ? translate('anonymousReport')
            : translate('identifiedReport')
        }
        iconLeft="menu"
        onPressLeft={() => navigation.openDrawer()}
      />

      {loading ? (
        <Loading />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled
        >
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
            <View style={styles.container}>
              <Card
                title={
                  anonymous
                    ? translate('anonymousReport')
                    : translate('identifiedReport')
                }
                iconName={anonymous ? 'lock' : 'person'}
              >
                {!anonymous && (
                  <>
                    <CustomInput
                      autoCorrect={false}
                      returnKeyType="next"
                      onChangeText={(name) => setState({ ...state, name })}
                      placeholder={translate('name')}
                      value={state.name}
                    />
                    <CustomInput
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onChangeText={(email) => setState({ ...state, email })}
                      placeholder={translate('email')}
                      value={state.email}
                    />
                    <CustomInput
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onChangeText={(phone) => setState({ ...state, phone })}
                      placeholder={translate('phone')}
                      value={state.phone}
                    />
                  </>
                )}
              </Card>

              <Card title={translate('location')} iconName="room">
                {network.isConnected ? (
                  <ButtonIcon
                    addStyle={{ marginBottom: 10 }}
                    iconName="room"
                    onPress={() => setState({ ...state, mapVisible: true })}
                  >
                    {state.latitude !== ''
                      ? translate('changeLocation').toUpperCase()
                      : translate('addLocation').toUpperCase()}
                  </ButtonIcon>
                ) : (
                  <Text style={styles.label}>
                    {state.latitude !== ''
                      ? translate('noConnection')
                      : translate('searchLocation')}
                  </Text>
                )}

                {Platform.OS === 'ios' ? (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        setState({
                          ...state,
                          pickerUrbanVisible: true,
                        })
                      }
                      style={[styles.formItem, { flexDirection: 'row' }]}
                    >
                      <Text style={{ flex: 1 }}>
                        {state.urban
                          ? translate('urbanArea')
                          : translate('ruralArea')}
                      </Text>
                      <Icon
                        name={
                          !state.pickerUrbanVisible
                            ? 'arrow-drop-down'
                            : 'arrow-drop-up'
                        }
                        size={20}
                        color={Colors.main}
                      />
                    </TouchableOpacity>
                    <Modal
                      transparent
                      animationType="slide"
                      visible={state.pickerUrbanVisible}
                      onRequestClose={() =>
                        setState({
                          ...state,
                          pickerUrbanVisible: false,
                        })
                      }
                    >
                      <View
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: Colors.gray,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }}
                        >
                          <Picker
                            // style={{
                            //   marginBottom: 30,
                            // }}
                            selectedValue={state.urban}
                            mode="dropdown"
                            onValueChange={(urban) =>
                              setState({
                                ...state,
                                urban,
                                pickerUrbanVisible: false,
                              })
                            }
                          >
                            <Picker.Item label={translate('urbanArea')} value />
                            <Picker.Item
                              label={translate('ruralArea')}
                              value={false}
                            />
                          </Picker>
                        </View>
                      </View>
                    </Modal>
                  </>
                ) : (
                  <View
                    style={[
                      styles.formItem,
                      {
                        maxHeight: 50,
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Picker
                      selectedValue={state.urban}
                      mode="dropdown"
                      onValueChange={(urban) => setState({ ...state, urban })}
                    >
                      <Picker.Item label={translate('urbanArea')} value />
                      <Picker.Item
                        label={translate('ruralArea')}
                        value={false}
                      />
                    </Picker>
                  </View>
                )}

                {state.urban ? (
                  <>
                    <CustomInput
                      // keyboardType="number-pad"
                      returnKeyType="next"
                      onChangeText={(number) => setState({ ...state, number })}
                      placeholder={translate('number')}
                      value={state.number}
                    />
                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(place) => setState({ ...state, place })}
                      placeholder={translate('street')}
                      value={state.place}
                    />

                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(zone) => setState({ ...state, zone })}
                      placeholder={translate('district')}
                      value={state.zone}
                    />

                    <CustomInput
                      // keyboardType="number-pad"
                      returnKeyType="next"
                      onChangeText={(cep) => setState({ ...state, cep })}
                      placeholder={translate('zipcode')}
                      value={state.cep}
                    />

                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(city) => setState({ ...state, city })}
                      placeholder={translate('city')}
                      value={state.city}
                    />

                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(estado) => setState({ ...state, estado })}
                      placeholder={translate('state')}
                      value={state.estado}
                    />

                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(reference) =>
                        setState({ ...state, reference })
                      }
                      placeholder={translate('reference')}
                      value={state.reference}
                    />
                  </>
                ) : (
                  <>
                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(city) => setState({ ...state, city })}
                      placeholder={translate('city')}
                      value={state.city}
                    />

                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(estado) => setState({ ...state, estado })}
                      placeholder={translate('state')}
                      value={state.estado}
                    />
                    <CustomInput
                      returnKeyType="next"
                      onChangeText={(reference) =>
                        setState({ ...state, reference })
                      }
                      placeholder={translate('reference')}
                      value={state.reference}
                    />
                  </>
                )}
              </Card>

              <Card title={translate('reportInformation')} iconName="info">
                {Platform.OS == 'ios' ? (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        setState({
                          ...state,
                          pickerVisible: true,
                        })
                      }
                      style={[styles.formItem, { flexDirection: 'row' }]}
                    >
                      <Text style={{ flex: 1 }}>
                        {state.type
                          ? state.typeLabel
                          : translate('selectReportType')}
                      </Text>
                      <Icon
                        name={
                          !state.pickerVisible
                            ? 'arrow-drop-down'
                            : 'arrow-drop-up'
                        }
                        size={20}
                        color={Colors.main}
                      />
                    </TouchableOpacity>
                    <Modal
                      transparent
                      animationType="slide"
                      visible={state.pickerVisible}
                      onRequestClose={() =>
                        setState({
                          ...state,
                          pickerVisible: false,
                        })
                      }
                    >
                      <View
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: Colors.gray,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }}
                        >
                          <Picker
                            selectedValue={state.type}
                            mode="dropdown"
                            onValueChange={(type, idx) =>
                              setState({
                                ...state,
                                type,
                                typeLabel: typesReports[idx].label,
                                pickerVisible: false,
                              })
                            }
                          >
                            {typesReports.map((item) => (
                              <Picker.Item
                                key={item.value}
                                label={item.label}
                                value={item.value}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    </Modal>
                  </>
                ) : (
                  <View
                    style={[
                      styles.formItem,
                      {
                        maxHeight: 50,
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Picker
                      selectedValue={state.type}
                      mode="dropdown"
                      onValueChange={(type, idx) =>
                        setState({
                          ...state,
                          type,
                          typeLabel: typesReports[idx].label,
                          pickerVisible: false,
                        })
                      }
                    >
                      {typesReports.map((item) => (
                        <Picker.Item
                          key={item.value}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </Picker>
                  </View>
                )}

                <TextInput
                  style={[styles.formItem, styles.description]}
                  returnKeyType="done"
                  onChangeText={(description) =>
                    setState({ ...state, description })
                  }
                  blurOnSubmit
                  placeholder={translate('reportDescription')}
                  multiline
                  numberOfLines={5}
                  value={state.description}
                />

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.selectedImages}
                >
                  {state.filePath.map((filePath, index) =>
                    !filePath ? (
                      <TouchableOpacity
                        key={index}
                        onLongPress={() => deleteImage(index)}
                        onPress={() => openPicker(index)}
                        style={styles.imageCircle}
                      >
                        <Icon name="camera-alt" size={25} color="#fff" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={index}
                        onPress={() => openPicker(index)}
                      >
                        <Image
                          source={{ uri: filePath.uri }}
                          style={styles.imageCircle}
                        />
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>

                {/* <ButtonIcon iconName='camera-alt'
								onPress={() => openPicker()}
								addStyle={{ marginBottom: 10 }}>
								<Text style={{ color: '#fff', marginLeft: 5 }}>{translate('addImage').toUpperCase()}*</Text>
							</ButtonIcon> */}
              </Card>

              <ButtonIcon
                addStyle={{ marginHorizontal: 15 }}
                iconName="send"
                onPress={() => handleSubmit()}
              >
                {translate('sendReport').toUpperCase()}
              </ButtonIcon>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#e8f5fd',
  },
  container: {
    padding: 15,
    marginBottom: 15,
    flex: 1,
  },
  formItem: {
    backgroundColor: Colors.soft,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1.2,
  },
  description: {
    textAlignVertical: 'top',
    height: Platform.OS == 'ios' ? 80 : null,
  },
  selectedImages: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageCircle: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: '#04884E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 5,
  },
});

export default NewReport;
