import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from '~/styles/colors';

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: '#04884E',
    borderWidth: 1,
    padding: 15,
    paddingBottom: 5,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1.2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: Colors.darkGray,
    fontFamily: 'Roboto-Regular',
    // fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
});

export default ({ children, iconName, title, noHeader }) => {
  return (
    <View style={styles.cardContainer}>
      {!noHeader && (
        <View style={styles.header}>
          <Icon color={Colors.main} size={20} name={iconName} />
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {children}
    </View>
  );
};
