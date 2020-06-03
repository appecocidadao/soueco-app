import React, { useState } from 'react';
import { StyleSheet, Modal, Text, View, Linking } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useDispatch } from 'react-redux';

import Card from '~/components/Card';
import ButtonIcon from '../../ButtonIcon';

import { setACCEPT } from '~/store/modules/privacyPolicy/actions';

import { translate } from '~/locales';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 15,
  },
  bodyText: {
    fontFamily: 'Roboto-Light',
    textAlign: 'justify',
    color: '#404040',
    fontSize: 15,
    marginBottom: 10,
  },
  strong: {
    marginBottom: 5,
  },
});

export default ({ visible, onRequestClose }) => {
  const dispatch = useDispatch();
  const [showAgain, setShowAgain] = useState(false);

  async function acceptPolicy() {
    if (showAgain) {
      dispatch(setACCEPT(true));
    }

    onRequestClose();
  }

  return (
    <Modal transparent onRequestClose={onRequestClose} visible={visible}>
      <View style={styles.container}>
        <Card title={translate('useAndPrivacyPolicy')}>
          <Text style={styles.strong}>
            {translate('nowYouCanContributeToSociety')}
          </Text>
          <Text style={styles.bodyText}>{translate('startScreenBody1')}</Text>
          <Text style={styles.bodyText}>{translate('startScreenBody2')}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            {Platform.OS === 'ios'? (
              <CheckBox
                boxType='square'
                tintColor='#04884E'
                onCheckColor='#04884E'
                onTintColor='#04884E'
                style={{marginRight: 8}}
                value={showAgain}
                onValueChange={(value) => setShowAgain(value)}
              />
            ):(
              <CheckBox
                value={showAgain}
                onValueChange={(value) => setShowAgain(value)}
              />
            )}
            
            <Text>{translate('dontShowAgain')}</Text>
          </View>
          <ButtonIcon
            onPress={() =>
              Linking.openURL('https://soueco.tce.am.gov.br/privacy')
            }
            iconName="verified-user"
            addStyle={{ marginBottom: 10 }}
          >
            {translate('useAndPrivacyPolicy')}
          </ButtonIcon>
          <ButtonIcon
            onPress={() => acceptPolicy()}
            iconName="done"
            addStyle={{ marginBottom: 10 }}
          >
            {translate('agree')}
          </ButtonIcon>
        </Card>
      </View>
    </Modal>
  );
};
