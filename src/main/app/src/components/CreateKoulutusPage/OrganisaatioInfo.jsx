import React from 'react';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';
import ApiAsync from '../ApiAsync';
import { getOrganisaatioByOid } from '../../apiUtils';
import { isObject } from '../../utils';

const getOrganisaatio = args => getOrganisaatioByOid(args);

const OrganisaatioInfoContainer = styled.div`
  ${getThemeProp('typography.body')};
  margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
  display: flex;
  justify-content: flex-end;
`;

const getOrganisaatioName = organisaatio => {
  return organisaatio && isObject(organisaatio.nimi)
    ? organisaatio.nimi.fi || null
    : null;
};

const OrganisaatioInfo = ({ organisaatioOid }) => (
  <OrganisaatioInfoContainer>
    <ApiAsync
      promiseFn={getOrganisaatio}
      oid={organisaatioOid}
      watch={organisaatioOid}
    >
      {({ data }) => (
        <div>Organisaatio: {data ? getOrganisaatioName(data) : null}</div>
      )}
    </ApiAsync>
  </OrganisaatioInfoContainer>
);

export default OrganisaatioInfo;
