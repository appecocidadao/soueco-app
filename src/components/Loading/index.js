import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ebecf0',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};
