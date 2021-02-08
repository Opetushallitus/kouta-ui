import React from 'react';

import _ from 'lodash';
import { transparentize } from 'polished';
import styled from 'styled-components';

import { Box, Icon, Typography } from '#/src/components/virkailija';
import { getThemeProp } from '#/src/theme';

const StyledInlineInfoBox = styled(Box)`
  display: inline-flex;
  background-color: ${getThemeProp('colors.grayLighten6', transparentize(0.5))};
  padding: 20px 20px;
`;

const GrayIcon = styled(Icon)`
  user-select: none;
  font-size: 15px;
  color: ${getThemeProp('colors.secondary.main')};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  background-color: white;
  border-radius: 15px;
`;

const InfoText = styled(Typography)`
  font-weight: ${({ bold }) => (bold ? 700 : 'normal')};
  line-height: 28px;
`;

export const InlineInfoBox = ({
  title,
  value,
  iconType,
}: {
  title: string;
  value?: React.ReactElement;
  iconType: string;
}) => {
  return (
    <StyledInlineInfoBox flexDirection="row" mr={2}>
      <GrayIcon type={iconType} />
      <Box display="flex" flexDirection="column" pt="3px">
        <InfoText>{title}</InfoText>
        {!_.isNil(value) && <InfoText bold>{value}</InfoText>}
      </Box>
    </StyledInlineInfoBox>
  );
};
