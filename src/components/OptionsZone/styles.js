import styled, { css } from 'styled-components/native';

import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '~/styles/colors';

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  flex: 1;

  background: ${Colors.soft};
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: ${Colors.border};

  shadow-color: #000;
  shadow-offset: 2px 2px;
  shadow-opacity: 0.5;
  shadow-radius: 2px;
  elevation: 1.2;
  ${(props) =>
    props.selected &&
    css`
      background: ${Colors.main};
    `}
`;
export const Icon = styled(MCIIcon)`
  margin-right: 12px;
`;
export const OptionText = styled.Text`
  color: ${Colors.fontDark};
  /* min-width: 60px; */
  flex: 1;
  font-size: 14px;
  ${(props) =>
    props.selected &&
    css`
      color: ${Colors.white};
    `};
`;
