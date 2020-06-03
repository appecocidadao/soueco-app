import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from '~/styles/colors';

const styles = StyleSheet.create({
  formItem: {
    backgroundColor: Colors.soft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    borderRadius: 3,
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
  input: {
    flex: 1,
    marginLeft: 4,
    color: Colors.fontDark,
  },
});

export default ({ iconName, ...props }) => {
  return (
    <View style={styles.formItem}>
      <Icon name={iconName || 'person'} size={20} color={Colors.main} />
      <TextInput
        style={styles.input}
        {...props}
        placeholderTextColor={Colors.fontLight}
      />
    </View>
  );
};
