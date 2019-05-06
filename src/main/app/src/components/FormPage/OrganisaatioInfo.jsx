import React from 'react';
import styled from 'styled-components';

import Typography from '../Typography';
import { isObject, getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import { useOrganisaatio } from '../useOrganisaatio';

const OrganisaatioInfoContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
  display: flex;
  justify-content: flex-end;
`;

const OrganisaatioName = styled(Typography)`
  font-weight: bold;
`;

const getOrganisaatioName = organisaatio => {
  return organisaatio && isObject(organisaatio.nimi)
    ? getFirstLanguageValue(organisaatio.nimi)
    : null;
};

const OrganisaatioInfo = ({ organisaatioOid, ...props }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  return (
    <OrganisaatioInfoContainer {...props}>
      <div>
        <Typography as="div" marginBottom={0.5}>
          {t('yleiset.valittuOrganisaatio')}:
        </Typography>
        <OrganisaatioName>
          {organisaatio ? getOrganisaatioName(organisaatio) : ''}
        </OrganisaatioName>
      </div>
    </OrganisaatioInfoContainer>
  );
};

export default OrganisaatioInfo;
