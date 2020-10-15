import styled, { css } from 'styled-components/native';

import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '~/styles/colors';

export const Container = styled.View`
  width: 100%;
  height: 50px;
  padding: 0 12px;
  background: ${Colors.soft};
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: ${Colors.border};
  flex-direction: row;
  align-items: center;

  shadow-color: #000;
  shadow-offset: 2px 2px;
  shadow-opacity: 0.5;
  shadow-radius: 2px;
  elevation: 1.2;
  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${(props) =>
    props.isFocused &&
    css`
      border-color: ${Colors.main};
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: ${Colors.fontDark};
  font-size: 16px;
`;

export const Icon = styled(MCIIcon)`
  margin-right: 16px;
`;
