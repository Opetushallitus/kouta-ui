import React from 'react';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';
import ApiAsync from '../ApiAsync';
import { getOrganisaatioByOid } from '../../apiUtils';
import { isObject, getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';

const getOrganisaatio = args => getOrganisaatioByOid(args);

const OrganisaatioInfoContainer = styled.div`
  ${getThemeProp('typography.body')};
  margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
  display: flex;
  justify-content: flex-end;
`;

const getOrganisaatioName = organisaatio => {
  return organisaatio && isObject(organisaatio.nimi)
    ? getFirstLanguageValue(organisaatio.nimi)
    : null;
};

const OrganisaatioInfo = ({ organisaatioOid, ...props }) => {
  const { t } = useTranslation();

  return (
    <OrganisaatioInfoContainer {...props}>
      <ApiAsync
        promiseFn={getOrganisaatio}
        oid={organisaatioOid}
        watch={organisaatioOid}
      >
        {({ data }) => (
          <div>{t('yleiset.organisaatio')}: {data ? getOrganisaatioName(data) : null}</div>
        )}
      </ApiAsync>
    </OrganisaatioInfoContainer>
  );
}

export default OrganisaatioInfo;
