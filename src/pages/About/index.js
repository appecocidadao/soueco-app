import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';

import Header from '~/components/Header';
import Card from '~/components/Card';

import UeaImg from '../../../assets/uea.png';
import JulioImg from '../../../assets/julio-pinheiro.jpeg';
import FabioImg from '../../../assets/fabiocardoso.jpg';
import ViniciusImg from '../../../assets/viniciuscoelho.jpg';
import IsaqueImg from '../../../assets/isaquevilson.jpeg';
import RaimundoImg from '../../../assets/raimundo.jpeg';
import tceCidadao from '../../../assets/header.png';

import Colors from '~/styles/colors';

import { translate } from '~/locales';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#e8f5fd',
  },
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#e8f5fd',
  },
  cardContainer: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: Colors.main,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1.2,
    // marginBottom: 15,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bodyText: {
    fontFamily: 'Roboto-Light',
    textAlign: 'center',
    color: Colors.main,
    fontSize: 13,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 15,
    color: Colors.fontDark,
  },
  titleText: {
    fontSize: 13,
    color: Colors.fontLight,
  },
  images: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    height: 80,
    width: 80,
    borderColor: Colors.main,
    borderWidth: 1,
    borderRadius: 60,
    marginRight: 10,
  },
  profile: {
    alignItems: 'center',
    flex: 1,
  },

  divisor: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#187E52',
    margin: 5,
    marginBottom: 8,
    marginTop: 8,
  },
});

export default ({ navigation }) => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#04884E" />

    <Header
      title={translate('aboutTheApp')}
      iconLeft="menu"
      onPressLeft={() => navigation.openDrawer()}
    />

    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Image
          source={tceCidadao}
          style={{ width: '100%', height: undefined, aspectRatio: 431 / 135 }}
        />

        <Text
          style={[
            styles.bodyText,
            {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: Colors.main,
              paddingVertical: 15,
            },
          ]}
        >
          {translate('aboutP1')}
        </Text>

        <View style={[styles.cardContainer, { flexDirection: 'row' }]}>
          <Image resizeMode="cover" style={styles.image} source={JulioImg} />
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{translate('counselor')}</Text>
            <Text style={[styles.nameText, { marginTop: 8, fontSize: 18 }]}>
              Júlio Assis Corrêa Pinheiro
            </Text>
            <Text
              style={[styles.bodyText, { textAlign: 'right', marginTop: 8 }]}
            >
              {translate('aboutP2')}
            </Text>
          </View>
        </View>
        <View style={styles.divisor} />

        <View style={styles.cardContainer}>
          <View style={[{ flexDirection: 'row', marginBottom: 8 }]}>
            <Text style={[styles.bodyText, { flex: 1 }]}>
              {translate('aboutP3')}
            </Text>
            <Image
              resizeMode="cover"
              style={[
                { height: 60, width: 60, resizeMode: 'contain', marginLeft: 8 },
              ]}
              source={UeaImg}
            />
          </View>
          <View style={styles.images}>
            <View style={styles.profile}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={FabioImg}
              />
              <Text style={[styles.nameText, { textAlign: 'center' }]}>
                Fábio de Souza{'\n'}Cardoso
              </Text>
              <Text style={styles.titleText}>{translate('professor')}</Text>
            </View>
            <View style={styles.profile}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={RaimundoImg}
              />
              <Text style={[styles.nameText, { textAlign: 'center' }]}>
                Raimundo Cláudio{'\n'}Souza Gomes
              </Text>
              <Text style={styles.titleText}>{translate('professor')}</Text>
            </View>
          </View>
          <Text style={styles.bodyText}>{translate('aboutP4')}</Text>
          <View style={styles.images}>
            <View style={styles.profile}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={IsaqueImg}
              />
              <Text style={[styles.nameText, { textAlign: 'center' }]}>
                Isaque Vilson{'\n'}Batista da Costa
              </Text>
              <Text style={styles.titleText}>{translate('developer')}</Text>
            </View>
            <View style={styles.profile}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={ViniciusImg}
              />
              <Text style={[styles.nameText, { textAlign: 'center' }]}>
                Vinicius Tavares{'\n'}Coelho
              </Text>
              <Text style={styles.titleText}>{translate('developer')}</Text>
            </View>
          </View>
        </View>
        {/* <Card title={translate('aboutTheApp')}>
          <Text style={styles.bodyText}>{translate('aboutP1')}</Text>
        </Card>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.images}
        >
          <Image resizeMode="cover" style={styles.image} source={JulioImg} />
          <Image resizeMode="cover" style={styles.image} source={RaimundoImg} />
          <Image resizeMode="cover" style={styles.image} source={FabioImg} />

          <Image resizeMode="cover" style={styles.image} source={IsaqueImg} />
          <Image resizeMode="cover" style={styles.image} source={ViniciusImg} />
        </ScrollView>

        <Card noHeader>
          <Text style={styles.bodyText}>{translate('aboutP2')}</Text>
        </Card> */}
      </View>
    </ScrollView>
  </>
);
