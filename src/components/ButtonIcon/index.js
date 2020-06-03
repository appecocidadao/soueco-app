/* eslint-disable react/prop-types */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from '~/styles/colors';

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    height: 50,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.main,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 1.2,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default ({ iconName, children, onPress, addStyle }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, addStyle]}>
    <View style={styles.content}>
      <Icon size={20} name={iconName} color={Colors.white} />
      <Text style={styles.buttonText}>{children}</Text>
    </View>
  </TouchableOpacity>
);
