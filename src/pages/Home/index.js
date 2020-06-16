import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import {
  StatusBar,
  View,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import Header from '~/components/Header';
import ButtonIcon from '~/components/ButtonIcon';
import ModalPrivacyPolicy from '~/components/Modals/PrivacyPolicy';
import Loading from '~/components/Loading';

import footer from '../../../assets/footeruea.png';
import bannerTransparent1079966 from '../../../assets/background-transparent-1079-966.png';

// import bannerTransparent1079966 from '../../../assets/header.png';

import { sendAllRequest } from '~/store/modules/reports/actions';
import { checkConnection } from '~/store/modules/network/actions';
import { translate } from '~/locales';

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    // alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    // paddingBottom: 0,
    backgroundColor: '#f2fafd',
  },

  title: {
    fontSize: 28,
    marginRight: 5,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f2fafd',
  },

  headerModal: {
    padding: 15,
    paddingTop: Platform.OS == 'ios' ? 45 : 15,
    backgroundColor: '#04884E',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextModal: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 18,
  },
  headerTextContainer: {
    color: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextAbsoluteContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: Platform.OS === 'ios' ? 30 : 0,
    bottom: 0,
  },
  button: {
    width: '70%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#04884E',
    padding: 15,
    borderRadius: 7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
  },

  image: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    height: undefined,
    aspectRatio: 1079 / 966,
    // aspectRatio: 431 / 135,

    backgroundColor: '#f2fafd',
  },

  imageFooter: {
    width: Dimensions.get('window').width - 30,
    alignSelf: 'center',
    height: undefined,
    aspectRatio: 621 / 210,
    marginBottom: 10,
  },
});

const Home = () => {
  const navigation = useNavigation();
  const isAccepted = useSelector((state) => state.privacyPolicy.isAccepted);

  const reportsNotSent = useSelector((state) => state.reports.reportsNotSent);

  const dispatch = useDispatch();

  const [showStartScreen, setShowStartScreen] = useState(!isAccepted);
  const [loading, setLoading] = useState(false);

  async function handleConnectivityChange({ isConnected }) {
    dispatch(checkConnection(isConnected));

    if (isConnected) {
      if (reportsNotSent.length) {
        dispatch(sendAllRequest());
      }
    }
  }

  useEffect(() => {
    let unsubscribe;
    async function init() {
      unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    }

    init();

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#04884E" />

      <ModalPrivacyPolicy
        visible={showStartScreen}
        onRequestClose={() => setShowStartScreen(false)}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: '#f2fafd',
          justifyContent: 'space-evenly',
        }}
      >
        <View
          style={{
            backgroundColor: '#f2fafd',
            justifyContent: 'flex-start',
            flex: 2,
          }}
        >
          <Header
            title={translate('home').toUpperCase()}
            iconLeft="menu"
            onPressLeft={() => navigation.openDrawer()}
          />

          <View style={{ flex: 1 }}>
            <Image source={bannerTransparent1079966} style={styles.image} />
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.body}>
            <ButtonIcon
              iconName="lock"
              addStyle={{ marginBottom: 10 }}
              onPress={() => navigation.navigate('NewReportAnonymous')}
            >
              {translate('anonymousReport').toUpperCase()}
            </ButtonIcon>

            <ButtonIcon
              iconName="person"
              addStyle={{ marginBottom: 10 }}
              onPress={() => navigation.navigate('NewReport')}
            >
              {translate('identifiedReport').toUpperCase()}
            </ButtonIcon>

            <ButtonIcon
              iconName="receipt"
              onPress={() => navigation.navigate('MyReports')}
            >
              {translate('myReports').toUpperCase()}
            </ButtonIcon>
          </View>
        </View>

        <View style={{ backgroundColor: '#f2fafd' }}>
          <Image source={footer} style={styles.imageFooter} />
        </View>
      </View>
    </>
  );
};

export default Home;
