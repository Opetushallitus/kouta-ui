import React from 'react';
import styled from 'styled-components';
import { isFunction } from 'lodash';
import { setLightness } from 'polished';
import { useTranslation } from 'react-i18next';

import Anchor from '#/src/components/Anchor';
import Icon from '#/src/components/Icon';
import Flex, { FlexItem } from '#/src/components/Flex';
import Spacing from '#/src/components/Spacing';
import Typography from '#/src/components/Typography';
import { getThemeProp, spacing } from '#/src/theme';

const ErrorIcon = styled(Icon).attrs({ type: 'error_outline' })`
  color: ${({ theme }) => theme.palette.danger.main};
  font-size: 2.25rem;
`;

const ErrorTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.danger.main};
`;

const ReloadAnchor = styled(Anchor)`
  ${({ theme }) => theme.typography.secondary};
  cursor: pointer;
`;

const Container = styled.div`
  padding: ${spacing(2)};
  border-radius: ${getThemeProp('shape.borderRadius')};
  background-color: ${({ theme }) =>
    setLightness(0.97, theme.palette.danger.main)};
`;

export const ErrorAlert = ({
  onReload,
  children,
  reloadText: reloadTextProp,
  center = false,
}) => {
  const { t } = useTranslation();

  const reloadText = reloadTextProp || t('yleiset.yritaUudelleen');
  const text = children || t('ilmoitukset.tuntematonVirhe');

  const content = (
    <Container>
      <Flex alignCenter>
        <FlexItem grow={0} paddingRight={1}>
          <ErrorIcon />
        </FlexItem>
        <FlexItem grow={1}>
          <ErrorTypography>{text}</ErrorTypography>{' '}
          <Spacing>
            {isFunction(onReload) ? (
              <ReloadAnchor as="span" onClick={onReload}>
                {reloadText}
              </ReloadAnchor>
            ) : null}
          </Spacing>
        </FlexItem>
      </Flex>
    </Container>
  );

  return center ? <Flex justifyCenter>{content}</Flex> : content;
};

export default ErrorAlert;
