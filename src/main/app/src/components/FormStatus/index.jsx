import React from 'react';
import styled from 'styled-components';
import { setLightness } from 'polished';

import { isString } from '../../utils';
import { getThemeProp } from '../../theme';
import Icon from '../Icon';
import Typography from '../Typography';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';

const statusByIcon = {
  [JULKAISUTILA.ARKISTOITU]: 'get_app',
  [JULKAISUTILA.JULKAISTU]: 'done',
  [JULKAISUTILA.TALLENNETTU]: 'save',
};

const getStatusIconType = status => {
  if (!isString(status)) {
    return '';
  }

  return statusByIcon[status] || '';
};

const getLabel = ({ status, t }) => {
  if (!isString(status)) {
    return null;
  }

  const labelByStatus = {
    [JULKAISUTILA.ARKISTOITU]: t('yleiset.arkistoitu'),
    [JULKAISUTILA.JULKAISTU]: t('yleiset.julkaistu'),
    [JULKAISUTILA.TALLENNETTU]: t('yleiset.tallennettu'),
  }

  return labelByStatus[status] || null;
};

const getColor = ({ theme, status }) => {
  let color = theme.palette.primary.main;

  if (status === JULKAISUTILA.TALLENNETTU) {
    color = theme.palette.primary.main;
  } else if (status === JULKAISUTILA.ARKISTOITU) {
    color = theme.palette.warning.main;
  } else if (status === JULKAISUTILA.JULKAISTU) {
    color = theme.palette.success.main;
  }

  return color;
};

const getIconContainerStatusCss = ({ theme, status }) => ({
  backgroundColor: getColor({ theme, status }),
});

const getContainerStatusCss = ({ theme, status }) => {
  const color = getColor({ theme, status });

  return {
    borderColor: color,
    backgroundColor: setLightness(0.9, color),
  };
};

const Container = styled.div`
  display: inline-flex;
  padding: 8px;
  border: 1px solid;
  border-radius: ${getThemeProp('shape.borderRadius')};
  align-items: center;

  ${getContainerStatusCss};
`;

const IconContainer = styled.div`
  display: inline-flex;
  border-radius: 50%;
  width: 1.75rem;
  height: 1.75rem;
  justify-content: center;
  align-items: center;
  margin-right: 8px;

  ${getIconContainerStatusCss};
`;

const StatusIcon = styled(Icon)`
  font-size: 1rem;
  color: white;
`;

const LabelContainer = styled(Typography)`
  font-size: 1rem;
`;

const FormStatus = ({ status = JULKAISUTILA.TALLENNETTU, children = null, ...props }) => {
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

export default FormStatus;
