import React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '~/components/Header';
import Card from '~/components/Card';

import Colors from '~/styles/colors';

import { translate } from '~/locales';

import tceCidadao from '../../../assets/tcecidadao.png';
import tce from '../../../assets/tce.jpeg';
import imageSimposio from '../../../assets/simposio.jpg';

// const styles = StyleSheet.create({
//   scroll: {
//     flex: 1,
//     backgroundColor: Colors.gray,
//   },
//   container: {
//     padding: 15,
//     flex: 1,
//     backgroundColor: Colors.gray,
//   },
//   bodyText: {
//     fontFamily: 'Roboto-Light',
//     textAlign: 'justify',
//     color: '#404040',
//     fontSize: 15,
//     marginBottom: 10,
//   },
// });

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#E8F5FD',
  },
  image: {
    alignSelf: 'center',
    marginLeft: 44,
    marginTop: 16,
  },
  titleText: {
    color: '#04884E',
    fontSize: 16,
    marginLeft: 4,
  },
  personalInfo: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#04884E',
    borderRadius: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1.2,

    backgroundColor: Colors.white,
  },
  locationInfo: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#04884E',
    borderRadius: 5,
    marginBottom: 20,
  },
  reportInfo: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#04884E',
    borderRadius: 5,
    marginBottom: 20,
  },
  formItem: {
    backgroundColor: 'rgba(99, 189, 83, 0.3)',
    // borderWidth: 1,
    // borderColor: '#04884E',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#04884E',
    fontSize: 20,
    padding: 10,
    borderRadius: 7,
  },
  anonymousAlertText: {
    textAlign: 'justify',
    color: '#04884E',
    marginBottom: 10,
  },
  headerModal: {
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 45 : 15,
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
    fontSize: 20,
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
  bodyText: {
    textAlign: 'justify',
    color: '#04884E',
    // marginBottom: 10,
  },
  divisor: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#187E52',
    margin: 5,
    marginBottom: 16,
    marginTop: 16,
  },
  imageTCE: {
    width: '100%',
    height: undefined,
    aspectRatio: 872 / 498,
    // resizeMode: 'contain',
    // height: 245,
    // width: '100%',
    marginBottom: 8,
  },
  contentText: {
    marginBottom: 10,
  },
});

export default ({ navigation }) => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#04884E" />
    {/* <View style={styles.headerModal}>
      <View style={styles.headerTextAbsoluteContainer}>
        <View style={styles.headerTextContainer}>
          <Icon color="#fff" name="landmark" size={18} />
          <Text style={styles.headerTextModal}>TCE Ambiental</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Icon color="#fff" name="bars" size={25} />
      </TouchableOpacity>
    </View> */}
    <Header
      title="TCE Ambiental"
      iconLeft="menu"
      onPressLeft={() => navigation.openDrawer()}
    />

    <ScrollView style={{ flex: 1, backgroundColor: '#E8F5FD' }}>
      <View style={styles.container}>
        <Image style={styles.image} source={tceCidadao} />

        <View style={styles.divisor} />
        <View style={styles.personalInfo}>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon color="#04884E" solid size={16} name="landmark" />
              <Text style={styles.titleText}>TCE Ambiental</Text>
            </View>
          </View>

          <Image style={[styles.imageTCE, {}]} source={tce} />

          <View style={[{ margiflexDirection: 'row' }]}>
            <Text style={[styles.bodyText, { flex: 1 }]}>
              {translate('tceAmbientalP1')}
            </Text>
          </View>

          <View style={styles.divisor} />

          <View style={[styles.contentText, { margiflexDirection: 'row' }]}>
            <Text style={[styles.bodyText, { flex: 1 }]}>
              {translate('tceAmbientalP2')}
            </Text>
          </View>

          <View style={styles.contentText}>
            <Image
              style={[
                { width: '100%', height: undefined, aspectRatio: 1024 / 656 },
              ]}
              source={imageSimposio}
            />
          </View>

          <View style={[styles.contentText, { margiflexDirection: 'row' }]}>
            <Text style={[styles.bodyText, { flex: 1 }]}>
              {translate('tceAmbientalP3')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  </>
  // <>
  //   <StatusBar barStyle="light-content" backgroundColor="#04884E" />

  //   <Header
  //     title="TCE Ambiental"
  //     iconLeft="menu"
  //     onPressLeft={() => navigation.openDrawer()}
  //   />

  //   <ScrollView style={styles.scroll}>
  //     <View style={styles.container}>
  //       <Card title="TCE Ambiental">
  //         <Text style={styles.bodyText}>{translate('tceAmbientalP1')}</Text>
  //       </Card>
  //       <Card noHeader>
  //         <Text style={styles.bodyText}>{translate('tceAmbientalP2')}</Text>
  //       </Card>
  //       <Card noHeader>
  //         <Text style={styles.bodyText}>{translate('tceAmbientalP3')}</Text>
  //       </Card>
  //     </View>
  //   </ScrollView>
  // </>
);
