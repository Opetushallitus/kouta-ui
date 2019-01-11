import React from 'react';
import styled from 'styled-components';
import { setLightness } from 'polished';

import { isString } from '../../utils';
import { getThemeProp } from '../../theme';
import Icon from '../Icon';
import Typography from '../Typography';

const statusByIcon = {
  archived: 'get_app',
  published: 'done',
  saved: 'save',
};

const labelByStatus = {
  archived: 'Arkistoitu',
  published: 'Julkaistu',
  saved: 'Tallennettu',
};

const getStatusIconType = status => {
  if (!isString(status)) {
    return '';
  }

  return statusByIcon[status] || '';
};

const getLabel = status => {
  if (!isString(status)) {
    return null;
  }

  return labelByStatus[status] || null;
};

const getColor = ({ theme, status }) => {
  let color = theme.palette.primary.main;

  if (status === 'saved') {
    color = theme.palette.primary.main;
  } else if (status === 'archived') {
    color = theme.palette.warning.main;
  } else if (status === 'published') {
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
  padding: 16px;
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

const FormStatus = ({ status = 'saved', children = null, ...props }) => {
  return (
    <Container status={status} {...props}>
      <IconContainer status={status}>
        <StatusIcon type={getStatusIconType(status)} />
      </IconContainer>
      <LabelContainer>{children || getLabel(status)}</LabelContainer>
    </Container>
  );
};

export default FormStatus;
