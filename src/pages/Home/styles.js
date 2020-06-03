import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import colors from '~/styles/colors';

import footer from '../../../assets/footeruea.png';
import bannerTransparent1079966 from '../../../assets/background-transparent-1079-966.png';

const widthDevice = Dimensions.get('window').width;

export const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  background-color: ${colors.bg};
`;

export const ImageBackground = styled.Image.attrs({
  source: bannerTransparent1079966,
})`
  align-self: center;
  width: ${`${widthDevice}px`};
  flex: 1;
  background-color: ${colors.bg};
`;
export const ContainerButtons = styled.View`
  padding: 0 20px;
  background-color: ${colors.bg};
`;
export const ImageFooter = styled.Image.attrs({
  source: footer,
})`
  width: ${`${widthDevice}px`};
  align-self: center;

  background-color: ${colors.bg};
  resize-mode: contain;
`;
