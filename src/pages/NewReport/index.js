/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  Alert,
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Toast from 'react-native-toast-message';

// import AsyncStorage from '@react-native-community/async-storage';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import Geolocation from '@react-native-community/geolocation';
import getValidationErrors from '~/utils/getValidationErrors';
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
import Input from '~/components/Input';

import Colors from '~/styles/colors';

import api from '~/services/api';
import Loading from '~/components/Loading';

import { translate } from '~/locales';
import Dropdown from '~/components/Dropdown';
import OptionsZone from '~/components/OptionsZone';
import colors from '~/styles/colors';

Geolocation.setRNConfiguration({ authorizationLevel: 'always' });

function NewReport({ anonymous, navigation }) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const refsVideos = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  const network = useSelector((state) => state.network);

  const [isUrban, setIsUrban] = useState(true);

  const [data, setData] = useState({
    mapVisible: false,

    activityIndicator: false,

    // name: '',
    // email: '',
    // contact: '',

    urban: true,
    street: '',
    district: '',
    number: '',
    zipcode: '',
    city: '',
    state: '',
    reference: '',
    latitude: '',
    longitude: '',

    type: '',
    description: '',
    prevMedias: [null, null, null],
  });

  const [medias, setMedias] = useState([null, null, null]);
  const [errorsMedias, setErrorsMedias] = useState([null, null, null]);

  const [errorLocation, setErrorLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialData = {
    mapVisible: false,

    activityIndicator: false,

    name: '',
    email: '',
    contact: '',

    urban: true,
    street: '',
    district: '',
    number: '',
    zipcode: '',
    // city: '',
    // state: '',
    reference: '',
    // latitude: '',
    // longitude: '',

    type: '',
    description: '',
    prevMedias: [null, null, null],
  };

  useEffect(() => {
    async function loadPosition() {
      setLoading(true);

      // setState(initialState);
      // setImage([null, null, null]);

      // console.log('loadPOsition');

      Geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setData((prevData) => ({
            ...prevData,
            latitude,
            longitude,
          }));
        },
        (_err) => {
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
    state
  ) => {
    if (!latitude || !longitude) {
      // Toast.show({
      //   type: 'error',
      //   position: 'bottom',
      //   text1: 'Por favor,',
      //   text2: 'Não possivel obter sua localização, tente novamente...',
      // });
      if (!data.latitude || !data.longitude) {
        setErrorLocation(true);
      }

      setData((prevData) => ({
        ...prevData,

        mapVisible: false,
      }));
      return;
    }

    setData((prevData) => ({
      ...prevData,
      latitude,
      longitude,

      street: place,
      district: zone,
      city,
      zipcode: cep,
      state,
      mapVisible: false,
    }));

    formRef.current.setData({
      latitude,
      longitude,

      street: place,
      district: zone,
      city,
      zipcode: cep,
      state,
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
      contact,
      urban,
      street,
      district,
      number,
      zipcode,
      city,
      state,
      reference,
      type,
      description,
      latitude,
      longitude,
    } = data;

    if (!anonymous && (!email || !name || !contact)) {
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
                  setData((prevData) => ({
                    ...prevData,
                    number: translate('none'),
                  }));
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

    if (urban && (!street || !district || !zipcode || !number)) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    if (!city || !state) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    if (!type || !description) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    if (!medias[0] && !medias[1] && !medias[2]) {
      Alert.alert(translate('incompleteReport'), translate('fillAllFields'));
      return;
    }

    // if (
    //   latitude &&
    //   longitude &&
    //   latitude !== '' &&
    //   longitude !== '' &&
    //   (city === '' || state === '')
    // ) {
    //   AddressByLocation({ latitude, longitude }).then((address) => {
    //
    //   });
    // }

    // eslint-disable-next-line no-empty
    if (!latitude || !longitude || latitude === '' || longitude === '') {
      Geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          setData((prevData) => ({
            ...prevData,
            latitude,
            longitude,
          }));
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
        report.append('contact', contact);
      }

      report.append('urban', urban);

      report.append('street', street);
      report.append('district', district);
      report.append('number', number);
      report.append('zipcode', zipcode);
      report.append('state', state);
      report.append('city', city);
      report.append('reference', reference);
      report.append('latitude', latitude);
      report.append('longitude', longitude);
      report.append('timestamp', new Date().toISOString());

      report.append('type', type);
      report.append('description', description);
      report.append('file', medias[0]);
      report.append('file', medias[1]);
      report.append('file', medias[2]);

      const response = await api.post('/denunciations', report);

      // await pushReportCode(response.data.denunciation.code);

      setData(initialData);
      setMedias([null, null, null]);
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

            const { mapVisible, activityIndicator, prevMedias, ...rest } = data;

            rest.medias = medias;
            rest.anonymous = anonymous;
            rest.timestamp = new Date().toISOString();

            setData(initialData);
            setMedias([null, null, null]);
            setErrorLocation(false);
            setErrorsMedias([null, null, null]);

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
            setData(initialData);
            setMedias([null, null, null]);
            setErrorLocation(false);
            setErrorsMedias([null, null, null]);
            navigation.navigate('Home');
          },
          style: 'cancel',
        },
      ]);
    }
  };

  const deleteImage = (index) => {
    Alert.alert(translate('Attention'), translate('msgDeleteImg'), [
      {
        text: translate('yesDelete'),
        onPress: () => {
          let tmp = [...medias];
          tmp[index] = null;
          setMedias(tmp);

          tmp = [...data.prevMedias];
          tmp[index] = null;
          setData((prev) => ({ ...prev, prevMedias: tmp }));
        },
      },
      {
        text: translate('cancel'),
        style: 'cancel',
      },
    ]);
  };

  const openPicker = (index) => {
    let options = {
      title: 'Inserir evidência',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Abrir câmera',
      chooseFromLibraryButtonTitle: 'Galeria',

      storageOptions: {
        skipBackup: true,
        path: 'Evidências Sou Eco!',
      },
      mediaType: 'mixed',
      durationLimit: 10,
      formatToMp4: true,
    };

    if (data.prevMedias[index]) {
      let customButtons = [{ name: 'delete', title: 'Remover' }];

      if (medias[index].type?.includes('video')) {
        customButtons = [{ name: 'view', title: 'Visualizar' }].concat(
          customButtons
        );
      }
      options = {
        ...options,
        customButtons,
      };
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        Alert.alert('Erro!', response.error);
        // eslint-disable-next-line no-empty
      } else if (response.didCancel) {
      } else if (response.customButton) {
        if (response.customButton === 'view') {
          refsVideos.current[index].current.seek(0);
          refsVideos.current[index].current.presentFullscreenPlayer();
        } else {
          deleteImage(index);
        }
      } else {
        console.log(response);

        console.log(response.type?.includes('image'));
        const tempPrevMedias = [...data.prevMedias];

        tempPrevMedias[index] = {
          ...response,
          type: response.type?.includes('image') ? 'image' : 'video',
        };

        setData({ ...data, prevMedias: tempPrevMedias });

        if (response.type?.includes('image')) {
          ImageResizer.createResizedImage(response.uri, 500, 500, 'JPEG', 70)
            .then(({ uri }) => {
              const prefix = new Date().getTime();

              const img = {
                uri,
                type: response.type,
                name: `${prefix}.jpg`,
              };

              const tempMedias = [...medias];

              tempMedias[index] = img;

              setMedias(tempMedias);
            })
            .catch((_err) => {
              Alert.alert(
                translate('imageError'),
                translate('imageErrorDescription')
              );
            });
        } else {
          // save video

          const prefix = new Date().getTime();

          const video = {
            uri: response.uri,
            type: 'video/mp4',
            name: `${prefix}-video`,
          };

          const tempMedias = [...medias];

          tempMedias[index] = video;

          setMedias(tempMedias);
        }
      }
    });
  };

  const handleNewReport = useCallback(
    async (formData) => {
      const allData = {
        ...formData,
        latitude: data.latitude,
        longitude: data.longitude,
        urban: isUrban,
        anonymous,
      };
      console.log(allData);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          type: Yup.string()
            .nullable()
            .required('Must enter type denunciation'),
          description: Yup.string().required('Must enter description'),
          longitude: Yup.number().required('Must enter longitude'),
          latitude: Yup.number().required('Must enter latitude'),
          urban: Yup.boolean().required('must enter urban'),
          anonymous: Yup.boolean().required('must enter anonymous'),
          reference: Yup.string(),
          // country: Yup.string().required('Must enter country'),
          country: Yup.string(),
          state: Yup.string().required('Must enter state'),
          city: Yup.string().required('Must enter city'),
          zipcode: Yup.string().when('urban', {
            is: true,
            then: Yup.string().required('Must enter zipcode address'),
          }),
          number: Yup.string().when('urban', {
            is: true,
            then: Yup.string().required('Must enter number address'),
          }),
          street: Yup.string().when('urban', {
            is: true,
            then: Yup.string().required('Must enter street address'),
          }),
          district: Yup.string().when('urban', {
            is: true,
            then: Yup.string().required('Must enter district address'),
          }),
          // timestamp: Yup.date().required('Must enter timestamp'),
          name: Yup.string().when('anonymous', {
            is: false,
            then: Yup.string().required('Must enter name'),
          }),
          email: Yup.string().when('anonymous', {
            is: false,
            then: Yup.string().required('Must enter email'),
          }),
          contact: Yup.string().when('anonymous', {
            is: false,
            then: Yup.string().required('Must enter contact'),
          }),

          medias: Yup.array()
            .of(Yup.object().nullable().required('Must enter one media'))
            .required('Must enter medias'),

          // date: Yup.date().required(),
        });

        await schema.validate(
          { ...allData, medias },
          {
            abortEarly: false,
          }
        );

        if (!network.isConnected) {
          throw new Error('Fail');
        }
        setLoading(true);

        const report = new FormData();

        report.append('anonymous', anonymous);

        if (!anonymous) {
          report.append('name', allData.name);
          report.append('email', allData.email);
          report.append('contact', allData.contact);
        }

        report.append('urban', allData.urban);

        report.append('street', allData.street);
        report.append('district', allData.district);
        report.append('number', allData.number);
        report.append('zipcode', allData.zipcode);
        report.append('state', allData.state);
        report.append('city', allData.city);
        report.append('reference', allData.reference);
        report.append('latitude', allData.latitude);
        report.append('longitude', allData.longitude);
        report.append('timestamp', new Date().toISOString());

        report.append('type', allData.type);
        report.append('description', allData.description);
        report.append('file', medias[0]);
        report.append('file', medias[1]);
        report.append('file', medias[2]);

        const response = await api.post('/denunciations', report);

        // await pushReportCode(response.data.denunciation.code);

        setData(initialData);
        setMedias([null, null, null]);
        setErrorLocation(false);
        setErrorsMedias([null, null, null]);
        setLoading(false);

        Alert.alert(translate('reported'), translate('reportedDescription'));
        dispatch(sendReportSuccess(response.data.denunciation));

        navigation.navigate('Home');
      } catch (err) {
        setLoading(false);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          console.log(errors);
          formRef.current?.setErrors(errors);
          console.log(formRef.current?.getErrors());

          setErrorsMedias([
            formRef.current?.getFieldError(`medias[0]`),
            formRef.current?.getFieldError(`medias[1]`),
            formRef.current?.getFieldError(`medias[2]`),
          ]);

          if (
            formRef.current?.getFieldError(`latitude`) ||
            formRef.current?.getFieldError(`longitude`)
          ) {
            setErrorLocation(true);
            // colocar um confirm dialog para confirmar a localizacao do dispositivo como local
            Geolocation.getCurrentPosition(
              async ({ coords: { latitude, longitude } }) => {
                setData((prevData) => ({
                  ...prevData,
                  latitude,
                  longitude,
                }));
                formRef.current.setData({
                  latitude,
                  longitude,
                });

                setErrorLocation(false);
              },
              (_err) => {
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
          } else {
            setErrorLocation(false);
          }

          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: translate('incompleteReport'),
            text2: translate('fillAllFields'),
          });
          return;
        }

        Alert.alert(translate('errorSend'), translate('submitLater'), [
          {
            text: translate('yesSave'),
            onPress: async () => {
              setLoading(true);

              const {
                mapVisible,
                activityIndicator,
                prevMedias,
                ...rest
              } = data;

              rest.medias = medias;
              rest.anonymous = anonymous;
              rest.timestamp = new Date().toISOString();

              setData(initialData);
              setMedias([null, null, null]);
              setErrorLocation(false);
              setErrorsMedias([null, null, null]);

              dispatch(addReport(rest));
              navigation.navigate('Home');
              setLoading(false);
            },
          },
          {
            text: translate('noDelete'),
            onPress: () => {
              setData(initialData);
              setMedias([null, null, null]);
              setErrorLocation(false);
              setErrorsMedias([null, null, null]);
              navigation.navigate('Home');
            },
            style: 'cancel',
          },
        ]);
      }
    },
    [
      anonymous,
      isUrban,
      medias,
      navigation,
      data,
      dispatch,
      initialData,
      network.isConnected,
    ]
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#04884E" />

      <Modal
        animationType="slide"
        visible={data.mapVisible}
        onRequestClose={() => setData({ ...data, mapVisible: false })}
      >
        <Map
          closeModal={() => setData({ ...data, mapVisible: false })}
          onFillLocation={onFillLocation}
          urban={data.urban}
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

      {loading && <Loading />}

      {!loading && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          // keyboardVerticalOffset={30}

          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled
        >
          <ScrollView
            // removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"

            // contentContainerStyle={{ flex: 1 }}
          >
            <View style={styles.container}>
              <Form
                onSubmit={handleNewReport}
                ref={formRef}
                initialData={{
                  ...data,
                }}
              >
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
                      <Input
                        autoCorrect={false}
                        returnKeyType="next"
                        placeholder={translate('name')}
                        name="name"
                      />
                      <Input
                        icon="email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                        placeholder={translate('email')}
                        name="email"
                      />
                      <Input
                        icon="phone"
                        keyboardType="phone-pad"
                        returnKeyType="next"
                        placeholder={translate('phone')}
                        name="contact"
                      />
                    </>
                  )}
                </Card>

                <Card title={translate('location')} iconName="room">
                  {network.isConnected ? (
                    <ButtonIcon
                      addStyle={{
                        marginBottom: 10,
                        ...(errorLocation
                          ? {
                              height: 55,
                              borderColor: '#c53030',
                              borderWidth: 3,
                            }
                          : {}),
                      }}
                      iconName="room"
                      onPress={() => setData({ ...data, mapVisible: true })}
                    >
                      {data.latitude !== ''
                        ? translate('changeLocation').toUpperCase()
                        : translate('addLocation').toUpperCase()}
                    </ButtonIcon>
                  ) : (
                    <Text style={styles.label}>
                      {data.latitude !== ''
                        ? translate('noConnection')
                        : translate('searchLocation')}
                    </Text>
                  )}

                  <OptionsZone
                    handleSelect={(value) => {
                      setIsUrban(value);
                    }}
                  />

                  {isUrban && (
                    <>
                      <Input
                        // keyboardType="number-pad"
                        name="number"
                        icon="numeric"
                        returnKeyType="next"
                        placeholder={translate('number')}
                      />
                      <Input
                        name="street"
                        icon="road-variant"
                        returnKeyType="next"
                        placeholder={translate('street')}
                      />

                      <Input
                        name="district"
                        returnKeyType="next"
                        icon="view-dashboard-variant"
                        placeholder={translate('district')}
                      />

                      <Input
                        // keyboardType="number-pad"
                        name="zipcode"
                        icon="deskphone"
                        returnKeyType="next"
                        placeholder={translate('zipcode')}
                      />
                    </>
                  )}

                  <Input
                    name="city"
                    returnKeyType="next"
                    icon="home-city"
                    placeholder={translate('city')}
                  />

                  <Input
                    name="state"
                    returnKeyType="next"
                    icon="city"
                    placeholder={translate('state')}
                  />
                  <Input
                    name="reference"
                    returnKeyType="next"
                    icon="map-marker-radius"
                    placeholder={translate('reference')}
                  />
                </Card>

                <Card title={translate('reportInformation')} iconName="info">
                  <Dropdown
                    name="type"
                    options={typesReports.map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))}
                    placeholder={translate('selectReportType')}
                    icon="alarm-light"
                  />
                  <Input
                    name="description"
                    icon="clipboard-text"
                    style={styles.description}
                    returnKeyType="done"
                    blurOnSubmit
                    placeholder={translate('reportDescription')}
                    multiline
                    numberOfLines={5}
                  />

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.selectedImages}
                  >
                    {data.prevMedias.map((prevMedia, index) =>
                      !prevMedia ? (
                        <TouchableOpacity
                          key={index}
                          onPress={() => openPicker(index)}
                          style={[
                            styles.imageCircle,
                            errorsMedias[index]
                              ? {
                                  borderColor: '#c53030',
                                  borderWidth: 3,
                                }
                              : {},
                          ]}
                        >
                          <Icon name="camera-alt" size={24} color="#fff" />

                          <View
                            style={{
                              borderWidth: 1,
                              width: 32,
                              borderColor: '#fff',
                              transform: [
                                {
                                  translateX: -0.8,
                                },
                              ],
                            }}
                          />
                          <Icon name="videocam" size={26} color="#fff" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          key={index}
                          onLongPress={() => deleteImage(index)}
                          onPress={() => openPicker(index)}
                          style={{ position: 'relative' }}
                        >
                          <>
                            {medias[index]?.type?.includes('video') ? (
                              <>
                                <View
                                  style={{
                                    position: 'absolute',
                                    zIndex: 10,
                                    right: 2,
                                    top: 0,
                                    padding: 4,
                                    backgroundColor: colors.soft,
                                    borderRadius: 22,
                                  }}
                                >
                                  <Icon
                                    name="videocam"
                                    size={22}
                                    color={colors.main}
                                    style={{}}
                                  />
                                </View>
                                <Video
                                  ref={refsVideos.current[index]}
                                  resizeMode="cover"
                                  source={{ uri: prevMedia.uri }} // Can be a URL or a local file.
                                  // ref={(ref) => {
                                  //   this.player = ref;
                                  // }} // Store reference
                                  // onBuffer={this.onBuffer} // Callback when remote video is buffering
                                  // onError={this.videoError} // Callback when video cannot be loaded
                                  style={[styles.videoCircle, { zIndex: 5 }]}
                                />
                              </>
                            ) : (
                              <>
                                <View
                                  style={{
                                    position: 'absolute',
                                    zIndex: 10,
                                    right: 2,
                                    top: 0,
                                    padding: 4,
                                    backgroundColor: colors.soft,
                                    borderRadius: 22,
                                  }}
                                >
                                  <Icon
                                    name="photo-camera"
                                    size={22}
                                    color={colors.main}
                                    style={{}}
                                  />
                                </View>

                                <Image
                                  source={{ uri: prevMedia.uri }}
                                  style={styles.imageCircle}
                                />
                              </>
                            )}
                          </>
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
                  addStyle={{ marginHorizontal: 15, marginTop: 10 }}
                  iconName="send"
                  // onPress={() => handleSubmit()}
                  onPress={() => formRef.current.submitForm()}
                >
                  {translate('sendReport').toUpperCase()}
                </ButtonIcon>
              </Form>
              {/* <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button> */}
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
    // textAlignVertical: 'top',
    // height: Platform.OS == 'ios' ? 80 : null,
    height: 124,
    // justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 2,
    paddingRight: 8,
  },
  selectedImages: {
    marginTop: 5,
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
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: '#04884E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCircle: {
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
