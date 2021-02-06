import React from 'react';

import _ from 'lodash';
import { setLightness } from 'polished';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Icon, Typography } from '#/src/components/virkailija';
import { JULKAISUTILA } from '#/src/constants';
import { getThemeProp } from '#/src/theme';

import { getColor, getLabel } from './utils';

const statusByIcon = {
  [JULKAISUTILA.ARKISTOITU]: 'get_app',
  [JULKAISUTILA.JULKAISTU]: 'done',
  [JULKAISUTILA.TALLENNETTU]: 'save',
};

const getStatusIconType = status => {
  if (!_.isString(status)) {
    return '';
  }

  return statusByIcon[status] || '';
};

const getIconContainerStatusCss = ({ theme, status }) => ({
  backgroundColor: getColor({ theme, status }),
});

const getContainerStatusCss = ({ theme, status }) => {
  const color = getColor({ theme, status });

  return {
    borderColor: color,
    backgroundColor: setLightness(0.95, color),
  };
};

const Container = styled.div`
  display: inline-flex;
  padding: 8px 16px;
  border: 2px solid;
  border-radius: ${getThemeProp('shape.borderRadius')};
  align-items: center;

  ${getContainerStatusCss};
`;

const IconContainer = styled.div`
  display: inline-flex;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-right: 8px;

  ${getIconContainerStatusCss};
`;

const StatusIcon = styled(Icon)`
  font-size: 0.9rem;
  color: white;
`;

const LabelContainer = styled(Typography)`
  font-size: 1rem;
  color: #313541;
`;

const LargeStatusTag = ({ status, children = null, ...props }) => {
  const { t } = useTranslation();

  return (
    <Container status={status} {...props}>
      <IconContainer status={status}>
        <StatusIcon type={getStatusIconType(status)} />
      </IconContainer>
      <LabelContainer>{children || getLabel({ status, t })}</LabelContainer>
    </Container>
  );
};

export default LargeStatusTag;
