import _ from 'lodash';
import { setLightness } from 'polished';
import styled from 'styled-components';

const getColorCss = ({ color, theme }) => {
  const baseColor =
    _.get(theme, ['palette', color, 'main']) || theme.palette.primary.main;

  return {
    backgroundColor: setLightness(0.92, baseColor),
    color: baseColor,
  };
};

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: ${({ theme }) => theme.shape.borderRadius};

  ${getColorCss};
`;

export default Badge;
