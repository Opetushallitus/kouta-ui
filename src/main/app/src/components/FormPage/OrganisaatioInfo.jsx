import React from 'react';
import styled from 'styled-components';

import Typography from '../Typography';
import { getOrganisaatioByOid } from '../../apiUtils';
import { isObject, getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';

const getOrganisaatio = args => getOrganisaatioByOid(args);

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
  const { data } = useApiAsync({
    promiseFn: getOrganisaatio,
    oid: organisaatioOid,
    watch: organisaatioOid,
  });

  return (
    <OrganisaatioInfoContainer {...props}>
      <div>
        <Typography as="div" marginBottom={0.5}>
          {t('yleiset.valittuOrganisaatio')}:
        </Typography>
        <OrganisaatioName>
          {data ? getOrganisaatioName(data) : ''}
        </OrganisaatioName>
      </div>
    </OrganisaatioInfoContainer>
  );
};

export default OrganisaatioInfo;
