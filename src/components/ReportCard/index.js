import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import moment from 'moment';
import { translate } from '~/locales';

const statusCodes = ['Não Enviada', 'Recebida', 'Encaminhada', 'Finalizada'];

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'space-around',
  },
  // text: {
  //   fontFamily: 'Roboto-Light',
  //   fontWeight: 'bold',
  //   fontSize: 14,
  //   marginBottom: 5,
  // },
  text: {
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    marginBottom: 5,
  },
  footerText: {
    fontFamily: 'Roboto-Light',
    fontSize: 13,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ({ code, type, timestamp, statusId, uri }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri }} />
      <View style={styles.info}>
        <Text style={styles.header}>
          Código: {code || translate('reportNotSent')}
        </Text>
        <Text style={styles.text}>{type}</Text>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{statusCodes[statusId - 1]}</Text>
          <Text style={styles.footerText}>
            {moment(timestamp).format('DD/MM/YYYY HH:mm')}
          </Text>
        </View>
      </View>
    </View>
  );
};
