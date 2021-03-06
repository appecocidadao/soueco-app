import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persistedReducer = persistReducer(
    {
      key: 'soueco',
      storage: AsyncStorage,
      whitelist: ['reports', 'privacyPolicy'], // reducers que serao percitidos
    },
    reducers
  );

  return persistedReducer;
};
