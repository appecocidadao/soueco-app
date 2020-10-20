import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import moment from 'moment';
import Video from 'react-native-video';

import { TouchableOpacity } from 'react-native-gesture-handler';
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
  console.log(uri);

  const videoRef = useRef(null);

  const [paused, setPaused] = useState(true);

  return (
    <View style={styles.container}>
      {uri.endsWith('mp4') ? (
        <TouchableOpacity
          onPress={() => {
            videoRef.current.seek(0);
            videoRef.current.presentFullscreenPlayer();
            setPaused(false);
          }}
        >
          <Video
            resizeMode="cover"
            source={{ uri }} // Can be a URL or a local file.
            ref={videoRef}
            paused={paused}
            onEnd={() => setPaused(true)}
            // ref={(ref) => {
            //   this.player = ref;
            // }} // Store reference
            // onBuffer={this.onBuffer} // Callback when remote video is buffering
            // onError={this.videoError} // Callback when video cannot be loaded
            style={styles.image}
          />
        </TouchableOpacity>
      ) : (
        <Image style={styles.image} source={{ uri }} />
      )}

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
