/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from '~/styles/colors';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.main,
    padding: 5,
    paddingTop: Platform.OS === 'ios' ? 30 + 5 : 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 3,
  },
  title: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});

export default ({ iconLeft, iconRight, title, onPressLeft, onPressRight }) => {
  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity onPress={onPressLeft} style={styles.iconContainer}>
        <Icon name={iconLeft} size={25} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onPressRight} style={styles.iconContainer}>
        <Icon name={iconRight} size={25} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
