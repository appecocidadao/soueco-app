import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import colors from '~/styles/colors';

import { Container, OptionContainer, Icon, OptionText } from './styles';

const OptionsZone = ({ handleSelect }) => {
  const [isUrban, setIsUrban] = useState(true);

  return (
    <Container>
      <OptionContainer
        selected={isUrban}
        onPress={() => {
          setIsUrban(true);
          handleSelect(true);
        }}
      >
        <Icon
          name="city"
          size={24}
          color={isUrban ? colors.white : colors.fontLight}
        />

        <OptionText selected={isUrban}>Zona Urbana</OptionText>
      </OptionContainer>
      <OptionContainer
        selected={!isUrban}
        onPress={() => {
          setIsUrban(false);
          handleSelect(false);
        }}
      >
        <Icon
          name="home-group"
          size={24}
          color={!isUrban ? colors.white : colors.fontLight}
        />
        <OptionText selected={!isUrban}>Zona Rural</OptionText>
      </OptionContainer>
    </Container>
  );
};

export default OptionsZone;
